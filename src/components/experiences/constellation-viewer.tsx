'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Check } from 'lucide-react'

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

function heartX(t: number) {
  return 16 * Math.pow(Math.sin(t), 3)
}

function heartY(t: number) {
  return 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
}

function heartPoints(count: number): HeartPoint[] {
  const pts: HeartPoint[] = []
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2
    const x = heartX(t)
    const y = heartY(t)
    const left = 50 + (x / 16) * 44
    const top = 10 + ((11.5 - y) / 28.5) * 50
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
    setTimeout(() => setFlash(null), 600)
    const id = flyerId.current++
    setFlyers((prev) => [...prev, { id, fromX: cx, fromY: cy, toX: tx, toY: ty }])
  }

  const placedCount = placed.filter(Boolean).length

  const px = (p: HeartPoint) => ({ x: (p.left / 100) * size.w, y: (p.top / 100) * size.h })
  const polylinePoints = points.map((p) => `${px(p).x},${px(p).y}`).join(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[90] overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 22%, #241244 0%, #130a20 55%, #0a0414 100%)',
        fontFamily: fontFamily && fontFamily !== 'serif' ? `'${fontFamily}', serif` : 'serif',
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
          <h2 className="text-white text-xl font-serif">{title || 'Constelação do Amor'}</h2>
          <p className="text-white/40 text-xs mt-1 leading-relaxed">
            {allPlaced
              ? 'Sua constelação está completa ✨'
              : `Toque nos momentos abaixo e acenda cada estrela ${placedCount}/${photosToUse.length}`}
          </p>
        </div>
      </div>

      <div ref={skyRef} className="absolute inset-0 overflow-hidden" style={{ touchAction: 'manipulation' }}>
        {/* ambient stars */}
        {Array.from({ length: 50 }, (_, i) => (
          <span
            key={i}
            className="absolute rounded-full twinkle"
            style={{
              width: 1 + (i % 3),
              height: 1 + (i % 3),
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 97}%`,
              background: i % 4 === 0 ? accentColor : 'rgba(255,255,255,0.55)',
              animationDelay: `${(i % 10) * 0.4}s`,
            }}
          />
        ))}

        {/* heart guide */}
        {size.w > 0 && points.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <polyline
                points={polylinePoints}
                fill="none"
                stroke={accentColor}
                strokeWidth={1.2}
                strokeOpacity={allPlaced ? 0.9 : 0.35}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: allPlaced ? 'none' : '5 9',
                  strokeDashoffset: allPlaced ? 0 : 1600,
                  transition: 'stroke-dashoffset 2.2s ease, stroke-opacity 0.6s',
                  filter: `drop-shadow(0 0 8px ${accentColor}aa)`,
                }}
              />
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={px(p).x}
                  cy={px(p).y}
                  r={7}
                  fill={placed[i] ? accentColor : 'transparent'}
                  stroke={placed[i] ? accentColor : `${accentColor}66`}
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  style={{
                    filter: placed[i] ? `drop-shadow(0 0 8px ${accentColor})` : 'none',
                    transition: 'fill 0.4s, filter 0.4s',
                  }}
                />
              ))}
            </svg>
          </motion.div>
        )}

        {/* placed stars */}
        {points.map((p, i) =>
          placed[i] ? (
            <motion.div
              key={`star-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 17 }}
              className="absolute rounded-full overflow-hidden star-pulse"
              style={{
                left: p.left,
                top: p.top,
                width: 30,
                height: 30,
                marginLeft: -15,
                marginTop: -15,
                boxShadow: `0 0 20px 5px ${accentColor}99, inset 0 0 0 2px ${accentColor}88`,
                zIndex: 5,
              }}
            >
              <img
                src={photosToUse[i]}
                alt={`Estrela ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          ) : null
        )}

        {/* flash on ignite */}
        <AnimatePresence>
          {flash !== null && placed[flash] && (
            <motion.div
              initial={{ opacity: 0.9, scale: 0.4 }}
              animate={{ opacity: 0, scale: 2.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: points[flash].left,
                top: points[flash].top,
                width: 110,
                height: 110,
                marginLeft: -55,
                marginTop: -55,
                background: `radial-gradient(circle, ${accentColor}dd 0%, transparent 68%)`,
                zIndex: 6,
              }}
            />
          )}
        </AnimatePresence>

        {/* completion content */}
        {allPlaced && (
          <div className="absolute inset-x-0 top-[62%] px-6 text-center z-10 pointer-events-none">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white text-xl md:text-2xl font-serif mb-2"
            >
              {coupleName ? `${coupleName}, essa constelação é nossa` : 'Essa constelação é nossa'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-white/50 text-sm max-w-md mx-auto mb-6 leading-relaxed"
            >
              {message?.trim() || 'Cada estrela acesa é um momento nosso que brilha para sempre no céu.'}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={onClose}
              className="px-10 py-3.5 rounded-full text-sm font-bold text-white shadow-2xl cursor-pointer pointer-events-auto"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
            >
              Continuar ❤
            </motion.button>
          </div>
        )}
      </div>

      {/* photo strip */}
      {!allPlaced && photosToUse.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-5">
          <div className="flex gap-2.5 overflow-x-auto pb-1 constellation-strip">
            {photosToUse.map((photo, i) => (
              <motion.button
                id={`const-card-${i}`}
                key={i}
                onClick={() => ignite(i)}
                whileHover={{ scale: placed[i] ? 1 : 1.08, y: placed[i] ? 0 : -3 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="relative flex-none cursor-pointer select-none overflow-hidden rounded-xl"
                style={{
                  width: 66,
                  height: 66,
                  border: placed[i] ? '2px solid rgba(255,255,255,0.2)' : `2px solid ${accentColor}55`,
                  opacity: placed[i] ? 0.35 : 1,
                  boxShadow: placed[i] ? 'none' : '0 8px 22px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={photo}
                  alt={`Momento ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {placed[i] ? (
                  <span
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.55)' }}
                  >
                    <Check size={22} color={accentColor} />
                  </span>
                ) : (
                  <span
                    className="absolute top-1 left-1 rounded-full flex items-center justify-center"
                    style={{
                      width: 18,
                      height: 18,
                      background: accentColor,
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* flyers */}
      {flyers.map((f) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 1, x: f.fromX, y: f.fromY, scale: 0.9 }}
          animate={{ opacity: [1, 1, 0], x: f.toX, y: f.toY, scale: 0.3 }}
          transition={{ duration: 0.65, ease: 'easeIn' }}
          onAnimationComplete={() => setFlyers((prev) => prev.filter((x) => x.id !== f.id))}
          className="fixed z-[95] pointer-events-none rounded-full"
          style={{
            width: 12,
            height: 12,
            marginLeft: -6,
            marginTop: -6,
            background: accentColor,
            boxShadow: `0 0 18px 5px ${accentColor}`,
          }}
        />
      ))}

      <style>{`
        .twinkle {
          animation: twinkle 2.6s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.12; transform: scale(0.8); }
          50% { opacity: 0.85; transform: scale(1.3); }
        }
        .star-pulse {
          animation: starPulse 2.2s ease-in-out infinite;
        }
        @keyframes starPulse {
          0%, 100% { box-shadow: 0 0 14px 3px ${accentColor}77, inset 0 0 0 2px ${accentColor}88; }
          50% { box-shadow: 0 0 26px 8px ${accentColor}bb, inset 0 0 0 2px ${accentColor}aa; }
        }
        .constellation-strip {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .constellation-strip::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  )
}
