import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateSlug, generatePassword, hashPassword } from '@/lib/utils'

const headers = { 'Content-Type': 'application/json; charset=utf-8' }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, coupleName, specialDate, message, senderName } = body

    if (!templateId || !coupleName || !specialDate || !message) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400, headers }
      )
    }

    const template = await prisma.template.findUnique({
      where: { slug: templateId }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404, headers }
      )
    }

    const slug = generateSlug()
    const password = generatePassword()
    const hashedPassword = await hashPassword(password)

    const gift = await prisma.gift.create({
      data: {
        slug,
        accessPassword: hashedPassword,
        templateId: template.id,
        coupleName,
        specialDate: new Date(specialDate),
        message,
        dayCountStart: new Date(),
        senderName: senderName || null,
        photos: '[]',
        loveQuotes: '[]',
        storySections: '[]',
        timelineEvents: '[]',
        isPublished: false
      }
    })

    return NextResponse.json({
      success: true,
      gift: {
        id: gift.id,
        slug: gift.slug,
        password,
        editUrl: `/gift/edit/${slug}`
      }
    }, { headers })
  } catch (error) {
    console.error('Error creating gift:', error)
    return NextResponse.json(
      { error: 'Erro ao criar presente', details: error instanceof Error ? error.message : String(error) },
      { status: 500, headers }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const gift = await prisma.gift.findUnique({
        where: { slug },
        include: { template: true }
      })

      if (!gift) {
        return NextResponse.json(
          { error: 'Presente não encontrado' },
          { status: 404, headers }
        )
      }

      return NextResponse.json({ success: true, gift }, { headers })
    }

    const gifts = await prisma.gift.findMany({
      include: { template: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, gifts }, { headers })
  } catch (error) {
    console.error('Error fetching gifts:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar presentes', details: error instanceof Error ? error.message : String(error) },
      { status: 500, headers }
    )
  }
}
