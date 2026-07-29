'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

interface PhotoDisplayProps {
  photos: string[]
  display?: string
  aspectRatio?: string
  className?: string
}

export default function PhotoDisplay({ photos, display = 'single', aspectRatio = '16/9', className = '' }: PhotoDisplayProps) {
  if (!photos || photos.length === 0) return null

  const validPhotos = photos.filter(Boolean)
  if (validPhotos.length === 0) return null

  if (display === 'single') {
    return (
      <img
        src={validPhotos[0]}
        alt=""
        style={{ width: '100%', aspectRatio, objectFit: 'cover', borderRadius: '12px' }}
        className={className}
      />
    )
  }

  if (display === 'grid') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(validPhotos.length, 3)}, 1fr)`, gap: '8px' }} className={className}>
        {validPhotos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            style={{ width: '100%', aspectRatio, objectFit: 'cover', borderRadius: '8px' }}
          />
        ))}
      </div>
    )
  }

  return <Carousel photos={validPhotos} aspectRatio={aspectRatio} />
}

function Carousel({ photos, aspectRatio }: { photos: string[]; aspectRatio: string }) {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => setCurrent((p) => (p + 1) % photos.length), [photos.length])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + photos.length) % photos.length), [photos.length])

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [next])

  if (photos.length === 1) {
    return (
      <img
        src={photos[0]}
        alt=""
        style={{ width: '100%', aspectRatio, objectFit: 'cover', borderRadius: '12px' }}
      />
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio, borderRadius: '12px', overflow: 'hidden' }}>
      {photos.map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
          }}
        />
      ))}
      <button
        onClick={(e) => { e.stopPropagation(); prev() }}
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0,0,0,0.4)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          lineHeight: 1,
        }}
      >
        &#8249;
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next() }}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0,0,0,0.4)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          lineHeight: 1,
        }}
      >
        &#8250;
      </button>
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
        }}
      >
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}