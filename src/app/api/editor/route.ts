import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, hashPassword, generatePassword } from '@/lib/utils'

const headers = { 'Content-Type': 'application/json; charset=utf-8' }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, slug, password } = body

    if (action === 'regenerate') {
      const userId = request.cookies.get('session')?.value
      if (!userId) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401, headers })
      }

      const gift = await prisma.gift.findFirst({ where: { userId } })
      if (!gift) {
        return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404, headers })
      }

      const newEditorPassword = generatePassword()
      const hashed = await hashPassword(newEditorPassword)

      await prisma.gift.update({
        where: { id: gift.id },
        data: { accessPassword: hashed }
      })

      return NextResponse.json({
        success: true,
        editorPassword: newEditorPassword,
        slug: gift.slug
      }, { headers })
    }

    if (!slug) {
      return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400, headers })
    }

    const gift = await prisma.gift.findUnique({ where: { slug } })
    if (!gift) {
      return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404, headers })
    }

    if (!password) {
      return NextResponse.json({ error: 'Senha é obrigatória' }, { status: 400, headers })
    }

    const valid = await verifyPassword(password, gift.accessPassword)
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
  } catch (error) {
    console.error('Editor auth error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500, headers })
  }
}

export async function GET(request: NextRequest) {
  const slug = request.cookies.get('editor')?.value
  if (!slug) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401, headers })
  }

  const gift = await prisma.gift.findUnique({ where: { slug } })
  if (!gift) {
    return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404, headers })
  }

  return NextResponse.json({ success: true, gift: { slug: gift.slug } }, { headers })
}
