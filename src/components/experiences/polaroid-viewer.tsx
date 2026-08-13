'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Shuffle } from 'lucide-react'

interface PolaroidViewerProps {
  photos: string[]
  accentColor: string
  fontFamily?: string
  coupleName?: string
  title?: string
  message?: string
  onClose: () => void
}

interface RainCard {
  id: number
  left: number
  rotate: number
  duration: number
  delay: number
  size: number
}

export default function PolaroidViewer({
  photos,
  accentColor,
  fontFamily,
  coupleName,
  title,
  message,
  onClose,
}: PolaroidViewerProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [shuffleKey, setShuffleKey] = useState(0)

  const cards = useMemo<RainCard[]>(
    () =>
      photos.map((_, i) => ({
        id: i,
        left: 3 + (i * 13 + shuffleKey * 7) % 84,
        rotate: (Math.random() - 0.5) * 18,
        duration: 14 + Math.random() * 10,
        delay: -(Math.random() * 20),
        size: 150 + Math.random() * 70,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [photos.length, shuffleKey]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[90] overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${accentColor}33 0%, #160b20 55%, #0d0714 100%)`,
        fontFamily: fontFamily ? `'${fontFamily}', serif` : 'serif',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex items-center justify-center rounded-full"
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
        <Camera size={20} color={accentColor} style={{ marginTop: 3 }} />
        <div>
          <h2 className="text-white text-xl font-serif" style={{ fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined }}>
            {title || 'Momentos Polaroid'}
          </h2>
          <p className="text-white/40 text-xs mt-1 leading-relaxed">
            {message || `Toque nas fotos ${coupleName ? `de ${coupleName}` : ''} para reviver cada momento`}
          </p>
        </div>
      </div>

      {photos.length > 0 ? (
        <div className="absolute inset-0 overflow-hidden" style={{ touchAction: 'none' }}>
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => setSelected(index)}
              className="polaroid-card cursor-pointer select-none"
              style={{
                left: `${card.left}%`,
                width: card.size,
                animationDuration: `${card.duration}s`,
                animationDelay: `${card.delay}s`,
                background: '#fff',
                borderRadius: 6,
                boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
                padding: 10,
                border: 'none',
                textAlign: 'center',
                ['--r' as string]: `${card.rotate}deg`,
              }}
            >
              <img
                src={photos[index]}
                alt={`Momento ${index + 1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: card.size * 0.9,
                  objectFit: 'cover',
                  borderRadius: 3,
                  display: 'block',
                }}
              />
              <span
                className="block mt-2 text-[11px] tracking-wide"
                style={{ color: '#5b4524', fontFamily: "'Dancing Script', cursive", fontWeight: 600 }}
              >
                {coupleName || 'Nossos momentos'}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/40 text-sm">Nenhuma foto adicionada ainda — adicione no editor 📷</p>
        </div>
      )}

      <AnimatePresence>
        {selected !== null && photos[selected] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -4, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="polaroid-open"
              style={{ background: '#fff', borderRadius: 8, padding: 12, boxShadow: '0 25px 80px rgba(0,0,0,0.7)' }}
            >
              <img
                src={photos[selected]}
                alt={`Momento ${selected + 1}`}
                style={{
                  maxWidth: 'min(78vw, 560px)',
                  maxHeight: '62vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: 4,
                  display: 'block',
                }}
              />
              <div className="text-center mt-3">
                <span
                  style={{ color: '#5b4524', fontFamily: "'Dancing Script', cursive", fontSize: 20, fontWeight: 600 }}
                >
                  {coupleName || 'Nossos momentos'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setShuffleKey((k) => k + 1)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.3)',
          cursor: 'pointer',
        }}
      >
        <Shuffle size={15} /> Misturar de novo
      </button>

      <style>{`
        .polaroid-card {
          position: absolute;
          top: -160px;
          animation-name: polaroidFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes polaroidFall {
          0% { transform: translateY(0) rotate(var(--r, 0deg)); }
          100% { transform: translateY(110vh) rotate(var(--r, 0deg)); }
        }
      `}</style>
    </motion.div>
  )
}
