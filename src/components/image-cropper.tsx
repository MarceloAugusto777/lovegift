'use client'

import { useState, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'

interface ImageCropperProps {
  image: string
  onCrop: (croppedBlob: Blob) => void
  onCancel: () => void
  aspect?: number
}

export default function ImageCropper({ image, onCrop, onCancel, aspect = 4 / 3 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return
    const canvas = document.createElement('canvas')
    const imageObj = new Image()
    imageObj.crossOrigin = 'anonymous'
    imageObj.src = image
    await new Promise((resolve) => { imageObj.onload = resolve })

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(
      imageObj,
      croppedAreaPixels.x, croppedAreaPixels.y,
      croppedAreaPixels.width, croppedAreaPixels.height,
      0, 0,
      croppedAreaPixels.width, croppedAreaPixels.height
    )

    canvas.toBlob((blob) => {
      if (blob) onCrop(blob)
    }, 'image/jpeg', 0.85)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', height: '70vh', position: 'relative' }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 32px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          style={{
            padding: '12px 32px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #e11d48, #db2777)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          Confirmar Corte
        </button>
      </div>
    </div>
  )
}