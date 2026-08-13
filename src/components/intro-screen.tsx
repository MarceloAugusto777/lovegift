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
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 380,
        y: -(130 + Math.random() * 280),
        scale: 0.5 + Math.random() * 0.9,
        delay: Math.random() * 0.35,
        duration: 1.1 + Math.random() * 0.8,
        rotate: (Math.random() - 0.5) * 90,
      })),
    [opened]
  )

  const openEnvelope = () => {
    if (opened) return
    setOpened(true)
    setTimeout(() => {
      onOpen()
    }, 1000)
  }

  const bg = {
    background: `linear-gradient(160deg, ${accentColor} 0%, #1a1024 75%, #0d0714 100%)`,
  }

  const sealGradient = `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 60%, ${accentColor}80 100%)`

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={bg}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${accentColor}44 0, transparent 40%), radial-gradient(circle at 80% 70%, ${accentColor}33 0, transparent 40%)`,
        }}
      />

      <div className="pointer-events-none absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-30 blur-[100px]"
        style={{ background: accentColor }}
      />

      <div className="relative px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-white/70 text-sm tracking-[0.3em] uppercase mb-8"
        >
          {coupleName || 'Você tem uma surpresa'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
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
              animate={{ y: opened ? -112 : 0, opacity: opened ? 1 : 0.85, scale: opened ? 1.02 : 1 }}
              transition={{ duration: 0.5, delay: opened ? 0.12 : 0 }}
            >
              <motion.div
                className="letter-seal"
                style={{ background: sealGradient }}
                animate={opened ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart size={16} fill="#fff" stroke="#fff" />
              </motion.div>
              <span className="letter-to">Para você</span>
              {coupleName ? (
                <span className="letter-name" style={{ fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined }}>
                  {coupleName}
                </span>
              ) : (
                <span className="letter-name" style={{ fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined }}>
                  {senderName ? `Com amor, ${senderName}` : 'Com muito amor'}
                </span>
              )}
              <span className="letter-ornament">✦ ❤ ✦</span>
            </motion.div>

            <div className="envelope-front" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <div className="envelope-shine" />
            </div>

            <motion.div
              className="envelope-flap"
              style={{
                borderTopColor: 'rgba(255,255,255,0.2)',
                borderLeftColor: 'rgba(255,255,255,0.12)',
                borderRightColor: 'rgba(255,255,255,0.12)',
              }}
              initial={false}
              animate={{ rotateX: opened ? 180 : 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            />

            <motion.div
              className="envelope-seal"
              style={{ background: sealGradient }}
              initial={false}
              animate={opened ? { scale: 0.3, opacity: 0, y: -26 } : { scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Heart size={14} fill="#fff" stroke="#fff" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-2xl md:text-3xl text-white font-serif leading-snug max-w-xl mx-auto mb-10"
          style={{ fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined }}
        >
          {message}
        </motion.h1>

        {!opened && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
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
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%);
        }
        .envelope-front {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          clip-path: polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%);
          background: linear-gradient(160deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%);
          overflow: hidden;
        }
        .envelope-shine {
          position: absolute;
          top: -60%;
          bottom: 40%;
          left: -30%;
          width: 60%;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
          transform: rotate(18deg);
          animation: envelopeShine 3.2s ease-in-out infinite;
        }
        @keyframes envelopeShine {
          0%, 55% { transform: translateX(0) rotate(18deg); }
          80%, 100% { transform: translateX(340px) rotate(18deg); }
        }
        .envelope-letter {
          position: absolute;
          left: 20px;
          right: 20px;
          top: 20px;
          height: 165px;
          background: linear-gradient(150deg, #fffef9 0%, #fff7e9 55%, #fdecd4 100%);
          border-radius: 12px;
          border: 1px solid rgba(206,151,74,0.55);
          box-shadow: 0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 5px #fffef9, inset 0 0 0 6px rgba(206,151,74,0.28);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 26px 12px 14px;
        }
        .letter-seal {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(255,255,255,0.35);
          z-index: 2;
        }
        .letter-to {
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #b8862d;
          font-weight: 600;
        }
        .letter-name {
          font-size: 17px;
          line-height: 1.25;
          color: #3b2b17;
          font-weight: 600;
          text-align: center;
        }
        .letter-ornament {
          font-size: 11px;
          color: #c98f36;
          letter-spacing: 0.4em;
          margin-top: 2px;
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
        .envelope-seal {
          position: absolute;
          top: 78px;
          left: 50%;
          margin-left: -19px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(255,255,255,0.4);
          z-index: 4;
        }
      `}</style>
    </motion.div>
  )
}
