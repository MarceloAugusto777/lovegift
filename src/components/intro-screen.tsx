'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

interface IntroScreenProps {
  senderName?: string
  welcomeMessage?: string
  coupleName?: string
  accentColor: string
  fontFamily?: string
  onOpen: () => void
}

export default function IntroScreen({
  senderName,
  welcomeMessage,
  coupleName,
  accentColor,
  fontFamily,
  onOpen,
}: IntroScreenProps) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const message = welcomeMessage?.trim()
    ? welcomeMessage
    : senderName?.trim()
      ? `Olha o que ${senderName} preparou para você`
      : 'Um presente muito especial preparado com carinho para você'

  const hearts = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 360,
        y: -(120 + Math.random() * 260),
        scale: 0.6 + Math.random() * 0.9,
        delay: Math.random() * 0.7,
        duration: 1.6 + Math.random() * 1.2,
        rotate: (Math.random() - 0.5) * 90,
      })),
    [opened]
  )

  const openEnvelope = () => {
    if (opened) return
    setOpened(true)
    setTimeout(() => {
      onOpen()
    }, 2000)
  }

  const bg = {
    background: `linear-gradient(160deg, ${accentColor} 0%, #1a1024 75%, #0d0714 100%)`,
  }

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={bg}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${accentColor}44 0, transparent 40%), radial-gradient(circle at 80% 70%, ${accentColor}33 0, transparent 40%)`,
        }}
      />

      <div className="relative px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/70 text-sm tracking-[0.3em] uppercase mb-8"
        >
          {coupleName || 'Você tem uma surpresa'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative mx-auto mb-10"
          style={{ width: 300, height: 200 }}
        >
          {opened && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {hearts.map((h) => (
                <motion.span
                  key={h.id}
                  className="absolute"
                  initial={{ opacity: 0, x: 0, y: 40, rotate: 0, scale: 0.4 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: h.x,
                    y: h.y,
                    rotate: h.rotate,
                    scale: h.scale,
                  }}
                  transition={{
                    duration: h.duration,
                    delay: h.delay,
                    ease: 'easeOut',
                  }}
                >
                  <Heart size={26} fill="#fecdd3" stroke="#f43f5e" />
                </motion.span>
              ))}
            </div>
          )}

          <div className="envelope-wrap">
            <div className="envelope-back" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <motion.div
              className="envelope-letter"
              initial={false}
              animate={{ y: opened ? -95 : 0, opacity: opened ? 1 : 0.6 }}
              transition={{ duration: 0.7, delay: opened ? 0.5 : 0 }}
            >
              <Heart size={44} fill={accentColor} stroke={accentColor} className="mx-auto" />
            </motion.div>
            <div className="envelope-front" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <motion.div
              className="envelope-flap"
              style={{
                borderTopColor: 'rgba(255,255,255,0.2)',
                borderLeftColor: 'rgba(255,255,255,0.12)',
                borderRightColor: 'rgba(255,255,255,0.12)',
              }}
              initial={false}
              animate={{ rotateX: opened ? 180 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl md:text-3xl text-white font-serif leading-snug max-w-xl mx-auto mb-10"
          style={{ fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined }}
        >
          {message}
        </motion.h1>

        {!opened && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            whileTap={{ scale: 0.95 }}
            onClick={openEnvelope}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-semibold text-white shadow-2xl transition"
            style={{
              backgroundColor: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={18} />
            Abrir presente
          </motion.button>
        )}
      </div>

      <style>{`
        .envelope-wrap {
          position: absolute;
          inset: 0;
          width: 300px;
          height: 200px;
          margin: auto;
          perspective: 900px;
        }
        .envelope-back {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .envelope-front {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          clip-path: polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%);
        }
        .envelope-letter {
          position: absolute;
          left: 24px;
          right: 24px;
          top: 22px;
          height: 130px;
          background: #fffdf9;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: 150px solid transparent;
          border-right: 150px solid transparent;
          border-top: 105px solid rgba(255,255,255,0.2);
          transform-origin: top center;
          z-index: 3;
        }
      `}</style>
    </motion.div>
  )
}
