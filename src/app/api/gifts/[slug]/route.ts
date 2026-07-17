import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { notifyGiftPublished } from '@/lib/notify'

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' }

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    const gift = await prisma.gift.findUnique({
      where: { slug }
    })

    if (!gift) {
      return NextResponse.json(
        { error: 'Presente não encontrado' },
        { status: 404, headers: jsonHeaders }
      )
    }

    const updateData: Record<string, unknown> = {}

    if (body.coupleName !== undefined) updateData.coupleName = body.coupleName
    if (body.specialDate !== undefined) updateData.specialDate = new Date(body.specialDate)
    if (body.message !== undefined) updateData.message = body.message
    if (body.photos !== undefined) updateData.photos = JSON.stringify(body.photos)
    if (body.loveQuotes !== undefined) updateData.loveQuotes = JSON.stringify(body.loveQuotes)
    if (body.locationUrl !== undefined) updateData.locationUrl = body.locationUrl
    if (body.locationName !== undefined) updateData.locationName = body.locationName
    if (body.musicUrl !== undefined) updateData.musicUrl = body.musicUrl
    if (body.accentColor !== undefined) updateData.accentColor = body.accentColor
    if (body.fontFamily !== undefined) updateData.fontFamily = body.fontFamily
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished
    if (body.senderName !== undefined) updateData.senderName = body.senderName
    if (body.clientName !== undefined) updateData.clientName = body.clientName
    if (body.storyTitle !== undefined) updateData.storyTitle = body.storyTitle
    if (body.storySections !== undefined) updateData.storySections = JSON.stringify(body.storySections)
    if (body.timelineEvents !== undefined) updateData.timelineEvents = JSON.stringify(body.timelineEvents)
    if (body.dayCountStart !== undefined) updateData.dayCountStart = new Date(body.dayCountStart)
    if (body.templateId !== undefined) {
      const template = await prisma.template.findUnique({ where: { slug: body.templateId } })
      if (template) updateData.templateId = template.id
    }

    const updatedGift = await prisma.gift.update({
      where: { slug },
      data: updateData,
      include: { template: true }
    })

    if (body.isPublished === true && gift.isPublished === false) {
      notifyGiftPublished({
        slug,
        coupleName: updatedGift.coupleName,
        templateName: updatedGift.template?.name,
        clientName: updatedGift.clientName || undefined,
      })
    }

    return NextResponse.json({ success: true, gift: updatedGift }, { headers: jsonHeaders })
  } catch (error) {
    console.error('Error updating gift:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar presente' },
      { status: 500, headers: jsonHeaders }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return PUT(request, { params })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const gift = await prisma.gift.findUnique({
      where: { slug }
    })

    if (!gift) {
      return NextResponse.json(
        { error: 'Presente não encontrado' },
        { status: 404, headers: jsonHeaders }
      )
    }

    await prisma.gift.delete({
      where: { slug }
    })

    return NextResponse.json({ success: true }, { headers: jsonHeaders })
  } catch (error) {
    console.error('Error deleting gift:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir presente' },
      { status: 500, headers: jsonHeaders }
    )
  }
}
