'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Sparkles } from 'lucide-react'

interface ConstellationViewerProps {
  photos: string[]
  accentColor: string
  fontFamily?: string
  coupleName?: string
  title?: string
  message?: string
  onClose: () => void
}

interface HeartPoint {
  left: number
  top: number
}

interface Flyer {
  id: number
  fromX: number
  fromY: number
  toX: number
  toY: number
}

function heartPoints(count: number): HeartPoint[] {
  const pts: HeartPoint[] = []
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    const left = 50 + (x / 16) * 44
    const top = 50 + (y / 17) * 40
    pts.push({ left, top })
  }
  return pts
}

export default function ConstellationViewer({
  photos,
  accentColor,
  fontFamily,
  coupleName,
  title,
  message,
  onClose,
}: ConstellationViewerProps) {
  const skyRef = useRef<HTMLDivElement>(null)
  const [flyers, setFlyers] = useState<Flyer[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [flash, setFlash] = useState<number | null>(null)
  const flyerId = useRef(0)

  const photosToUse = useMemo(() => photos.slice(0, 24), [photos])
  const points = useMemo(() => heartPoints(photosToUse.length), [photosToUse.length])
  const [placed, setPlaced] = useState<boolean[]>(() => Array(photosToUse.length).fill(false))

  const allPlaced = placed.length > 0 && placed.every(Boolean)

  useEffect(() => {
    if (placed.length === photosToUse.length) return
    setPlaced((prev) => {
      const next = Array(photosToUse.length).fill(false)
      prev.forEach((v, i) => {
        if (i < next.length && v) next[i] = true
      })
      return next
    })
  }, [photosToUse.length, placed.length])

  useEffect(() => {
    const measure = () => {
      const el = skyRef.current
      if (el) setSize({ w: el.clientWidth, h: el.clientHeight })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const skyRect = () => skyRef.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 }

  const ignite = (index: number) => {
    if (placed[index]) return
    const card = document.getElementById(`const-card-${index}`)
    const rect = card?.getBoundingClientRect()
    const s = skyRect()
    const cx = (rect?.left ?? 0) + (rect?.width ?? 0) / 2
    const cy = (rect?.top ?? 0) + (rect?.height ?? 0) / 2
    const p = points[index]
    const tx = s.left + (p.left / 100) * s.width
    const ty = s.top + (p.top / 100) * s.height

    setPlaced((prev) => prev.map((v, i) => (i === index ? true : v)))
    setFlash(index)
    setTimeout(() => setFlash(null), 500)
    const id = flyerId.current++
    setFlyers((prev) => [...prev, { id, fromX: cx, fromY: cy, toX: tx, toY: ty }])
  }

  const placedCount = placed.filter(Boolean).length

  const polylinePoints = points
    .map((p) => `${(p.left / 100) * size.w},${(p.top / 100) * size.h}`)
    .join(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[90] overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 20%, #221040 0%, #12081f 55%, #0a0414 100%)',
        fontFamily: fontFamily ? `'${fontFamily}', serif` : 'serif',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-40 flex items-center justify-center rounded-full"
        style={{
          width: 42,
          height: 42,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        <X size={18} />
      </button>

      <div className="absolute top-5 left-5 right-16 z-10 flex items-start gap-3">
        <Star size={20} color={accentColor} style={{ marginTop: 3 }} />
        <div>
          <h2 className="text-white text-xl font-serif">
            {title || 'Constelação do Amor'}
          </h2>
          <p className="text-white/40 text-xs mt-1 leading-relaxed">
            {allPlaced
              ? 'Sua constelação está completa ✨'
              : `Toque em cada momento para acendê-lo no céu ${placedCount}/${photosToUse.length}`}
          </p>
        </div>
      </div>

      <div
        ref={skyRef}
        className="absolute inset-0 overflow-hidden"
        style={{ touchAction: 'manipulation' }}
      >
        {/* ambient stars */}
        {Array.from({ length: 60 }, (_, i) => (
          <span
            key={i}
            className="absolute rounded-full twinkle"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              background: i % 4 === 0 ? accentColor : 'rgba(255,255,255,0.6)',
              animationDelay: `${(i % 10) * 0.35}s`,
            }}
          />
        ))}

        {/* constellation lines */}
        {size.w > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: allPlaced ? 1 : 0, transition: 'opacity 1s' }}
          >
            <polyline
              points={polylinePoints}
              fill="none"
              stroke={accentColor}
              strokeWidth={1.5}
              strokeOpacity={0.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: '1600',
                strokeDashoffset: allPlaced ? 0 : 1600,
                transition: 'stroke-dashoffset 2.4s ease',
                filter: `drop-shadow(0 0 6px ${accentColor})`,
              }}
            />
          </svg>
        )}

        {/* stars (placed photos) */}
        {points.map((p, i) =>
          placed[i] ? (
            <motion.div
              key={`star-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className="absolute rounded-full overflow-hidden"
              style={{
                left: p.left,
                top: p.top,
                width: 26,
                height: 26,
                marginLeft: -13,
                marginTop: -13,
                boxShadow: `0 0 18px 4px ${accentColor}aa, inset 0 0 0 2px ${accentColor}66`,
                zIndex: 5,
              }}
            >
              <img src={photosToUse[i]} alt={`Estrela ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          ) : null
        )}

        {/* scatter cards */}
        {!allPlaced && (
          <div className="absolute inset-x-0 top-[24%] bottom-0 flex flex-wrap justify-center content-start gap-3 px-6 pt-4 overflow-y-auto">
            {photosToUse.map((photo, i) =>
              placed[i] ? null : (
                <motion.button
                  id={`const-card-${i}`}
                  key={i}
                  onClick={() => ignite(i)}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className="const-card cursor-pointer select-none"
                  style={{
                    width: 88,
                    background: '#fff',
                    borderRadius: 8,
                    padding: 6,
                    boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
                    border: 'none',
                    position: 'relative',
                  }}
                >
                  <img
                    src={photo}
                    alt={`Momento ${i + 1}`}
                    style={{ width: '100%', height: 66, objectFit: 'cover', borderRadius: 4, display: 'block' }}
                  />
                  <span className="block text-center mt-1" style={{ fontSize: 9, color: '#8a6a2f', fontWeight: 600 }}>
                    {coupleName || 'momento'}
                  </span>
                </motion.button>
              )
            )}
          </div>
        )}

        {/* flash on ignite */}
        {flash !== null && placed[flash] && (
          <motion.div
            initial={{ opacity: 1, scale: 0.4 }}
            animate={{ opacity: 0, scale: 2.4 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute rounded-full"
            style={{
              left: points[flash].left,
              top: points[flash].top,
              width: 80,
              height: 80,
              marginLeft: -40,
              marginTop: -40,
              background: `radial-gradient(circle, ${accentColor}cc 0%, transparent 70%)`,
              zIndex: 6,
            }}
          />
        )}

        {/* completion content */}
        {allPlaced && (
          <div className="absolute inset-x-0 bottom-0 pb-12 px-6 text-center z-10">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white text-xl md:text-2xl font-serif mb-2"
            >
              {coupleName ? `${coupleName}, essa constelação é nossa` : 'Essa constelação é nossa'}
            </motion.p>
            {(message?.trim() || true) && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-white/50 text-sm max-w-md mx-auto mb-6 leading-relaxed"
              >
                {message?.trim() || 'Cada estrela acesa é um momento nosso que brilha para sempre no céu.'}
              </motion.p>
            )}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={onClose}
              className="px-10 py-3.5 rounded-full text-sm font-bold text-white shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
            >
              Continuar ❤
            </motion.button>
          </div>
        )}
      </div>

      {/* flyers */}
      {flyers.map((f) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 1, x: f.fromX, y: f.fromY, scale: 0.8 }}
          animate={{ opacity: [1, 1, 0], x: f.toX, y: f.toY, scale: 0.3 }}
          transition={{ duration: 0.65, ease: 'easeIn' }}
          onAnimationComplete={() => setFlyers((prev) => prev.filter((x) => x.id !== f.id))}
          className="fixed z-[95] pointer-events-none rounded-full"
          style={{
            width: 14,
            height: 14,
            marginLeft: -7,
            marginTop: -7,
            background: accentColor,
            boxShadow: `0 0 16px 4px ${accentColor}`,
          }}
        />
      ))}

      <style>{`
        .twinkle {
          animation: twinkle 2.4s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.25); }
        }
      `}</style>
    </motion.div>
  )
}
