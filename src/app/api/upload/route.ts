import { NextRequest, NextResponse } from 'next/server'

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' }

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Nenhuma imagem enviada' },
        { status: 400, headers: jsonHeaders }
      )
    }

    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Formato de imagem inválido' },
        { status: 400, headers: jsonHeaders }
      )
    }

    const maxSize = 5 * 1024 * 1024
    if (image.length > maxSize) {
      return NextResponse.json(
        { error: 'Imagem muito grande' },
        { status: 400, headers: jsonHeaders }
      )
    }

    return NextResponse.json({
      success: true,
      url: image,
    }, { headers: jsonHeaders })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500, headers: jsonHeaders }
    )
  }
}