import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' }

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'lovegift',
      resource_type: 'image',
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    }, { headers: jsonHeaders })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500, headers: jsonHeaders }
    )
  }
}
