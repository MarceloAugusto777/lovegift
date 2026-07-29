import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' }

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400, headers: jsonHeaders }
      )
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido' },
        { status: 400, headers: jsonHeaders }
      )
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande (máximo 10MB)' },
        { status: 400, headers: jsonHeaders }
      )
    }

    const blob = await put(file.name, file, {
      addRandomSuffix: true,
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
    }, { headers: jsonHeaders })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500, headers: jsonHeaders }
    )
  }
}