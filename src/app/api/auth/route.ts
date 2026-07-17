import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, verifyPassword, generateSlug, generatePassword } from '@/lib/utils'

const headers = { 'Content-Type': 'application/json; charset=utf-8' }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, name } = body

    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400, headers })
      }

      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409, headers })
      }

      const hashed = await hashPassword(password)
      const user = await prisma.user.create({
        data: { email, password: hashed, name }
      })

      const slug = generateSlug()
      const editorPassword = generatePassword()
      const hashedEditorPw = await hashPassword(editorPassword)

      const template = await prisma.template.findFirst({ where: { slug: 'romantic' } })

      const defaultLoveQuotes = JSON.stringify([
        "O amor não se vê com os olhos, mas com o coração.",
        "Eu te amo não só pelo que você é, mas pelo que eu sou quando estou com você.",
        "Em todos os mundos, em todas as vidas, eu sempre te encontraria.",
        "O amor é a força mais humilde, mas a mais poderosa de que o mundo dispõe.",
        "Cada momento ao seu lado é um presente que não troco por nada.",
      ])

      const defaultStorySections = JSON.stringify([
        {
          title: "O Começo",
          text: "Tudo começou com um simples olhar. Ninguém imaginava que aquele momento seria o início de uma história de amor tão linda.",
          photo: "",
        },
        {
          title: "O Primeiro Encontro",
          text: "O tempo pareceu parar quando nos encontramos. Foi como se o universo tivesse conspirado pra colocar nós dois no mesmo lugar, na mesma hora.",
          photo: "",
        },
        {
          title: "A Decisão",
          text: "E então percebemos que não dávamos mais pra viver um sem o outro. Escolhemos ficar, todos os dias, pra sempre.",
          photo: "",
        },
      ])

      const defaultTimelineEvents = JSON.stringify([
        {
          date: new Date().toISOString().split("T")[0],
          title: "O Primeiro Encontro",
          description: "O dia em que tudo começou. O momento em que nossos olhares se cruzaram pela primeira vez.",
          photo: "",
        },
        {
          date: new Date().toISOString().split("T")[0],
          title: "O Primeiro Beijo",
          description: "Aquele beijo que confirmou que éramos feitos um pro outro.",
          photo: "",
        },
        {
          date: new Date().toISOString().split("T")[0],
          title: "O Pedido",
          description: "O dia em que decidimos que queremos passar o resto da vida juntos.",
          photo: "",
        },
      ])

      const gift = await prisma.gift.create({
        data: {
          slug,
          userId: user.id,
          accessPassword: hashedEditorPw,
          templateId: template!.id,
          coupleName: name,
          specialDate: new Date(),
          message: "Escreva aqui uma mensagem especial pra pessoa que vai receber este presente. Conta como você se sente, o que ela significa pra você, e por que este presente é tão especial.",
          dayCountStart: new Date(),
          storyTitle: "Nossa História de Amor",
          loveQuotes: defaultLoveQuotes,
          storySections: defaultStorySections,
          timelineEvents: defaultTimelineEvents,
        }
      })

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
        gift: { slug: gift.slug, editorPassword }
      }, { headers })

      response.cookies.set('session', user.id, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })

      return response
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400, headers })
      }

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401, headers })
      }

      const valid = await verifyPassword(password, user.password)
      if (!valid) {
        return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401, headers })
      }

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email }
      }, { headers })

      response.cookies.set('session', user.id, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })

      return response
    }

    if (action === 'editorLogin') {
      const { slug: giftSlug, password: editorPw } = body
      if (!giftSlug || !editorPw) {
        return NextResponse.json({ error: 'Senha é obrigatória' }, { status: 400, headers })
      }

      const gift = await prisma.gift.findUnique({ where: { slug: giftSlug } })
      if (!gift) {
        return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404, headers })
      }

      const valid = await verifyPassword(editorPw, gift.accessPassword)
      if (!valid) {
        return NextResponse.json({ error: 'Senha inválida' }, { status: 401, headers })
      }

      const response = NextResponse.json({
        success: true,
        gift: { slug: gift.slug, coupleName: gift.coupleName }
      }, { headers })

      response.cookies.set('editor', gift.slug, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })

      return response
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400, headers })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500, headers })
  }
}

export async function GET(request: NextRequest) {
  const userId = request.cookies.get('session')?.value
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401, headers })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404, headers })
  }

  const gift = await prisma.gift.findFirst({
    where: { userId: user.id },
    include: { template: true }
  })

  return NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    gift: gift ? {
      slug: gift.slug,
      coupleName: gift.coupleName,
      isPublished: gift.isPublished,
      viewCount: gift.viewCount,
      createdAt: gift.createdAt,
      templateName: gift.template?.name || 'Romântico',
    } : null
  }, { headers })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true }, { headers })
  response.cookies.delete('session')
  return response
}
