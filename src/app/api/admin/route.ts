import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/utils'

const headers = { 'Content-Type': 'application/json; charset=utf-8' }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password } = body

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400, headers })
      }

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || !user.isAdmin) {
        return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401, headers })
      }

      const valid = await verifyPassword(password, user.password)
      if (!valid) {
        return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401, headers })
      }

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email }
      }, { headers })

      response.cookies.set('admin', user.id, {
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
    console.error('Admin auth error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500, headers })
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminId = request.cookies.get('admin')?.value || request.cookies.get('session')?.value
    if (!adminId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401, headers })
    }

    const user = await prisma.user.findUnique({ where: { id: adminId } })
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403, headers })
    }

    const gifts = await prisma.gift.findMany({
      include: { template: true, user: true },
      orderBy: { createdAt: 'desc' },
    })

    const totalGifts = gifts.length
    const publishedGifts = gifts.filter(g => g.isPublished).length
    const totalViews = gifts.reduce((sum, g) => sum + g.viewCount, 0)

    const giftsData = gifts.map(g => ({
      slug: g.slug,
      coupleName: g.coupleName,
      clientName: g.clientName,
      isPublished: g.isPublished,
      viewCount: g.viewCount,
      createdAt: g.createdAt,
      templateName: g.template?.name || 'Romântico',
      userName: g.user?.name || 'Sem usuário',
      userEmail: g.user?.email || '',
    }))

    return NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email },
      stats: { totalGifts, publishedGifts, totalViews },
      gifts: giftsData,
    }, { headers })
  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500, headers })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true }, { headers })
  response.cookies.delete('admin')
  return response
}
