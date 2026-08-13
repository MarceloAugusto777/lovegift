'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import type { IntroProps } from './types'

const DODGE_LINES = [
  'Tenta de novo 😝',
  'Quase! Tá fugindo de você 😆',
  'Não adianta, o amor sempre vence 💘',
  'Desiste? Tenta de novo! 😜',
  'O coração manda: aperte o SIM 💗',
  'Esse botão é tímido 😳',
]

export default function DodgeIntro({
  senderName,
  welcomeMessage,
  coupleName,
  accentColor,
  fontFamily,
  onOpen,
}: IntroProps) {
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null)
  const [tries, setTries] = useState(0)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const dodge = () => {
    setTries((t) => t + 1)
    const x = 20 + Math.random() * 60
    const y = 20 + Math.random() * 60
    setNoPos({ x, y })
  }

  const sayYes = () => {
    if (burst) return
    setBurst(true)
    setTimeout(onOpen, 900)
  }

  const line = DODGE_LINES[Math.min(tries, DODGE_LINES.length - 1)]

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${accentColor} 0%, #1a1024 75%, #0d0714 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 30%, ${accentColor}55 0, transparent 40%), radial-gradient(circle at 75% 70%, ${accentColor}44 0, transparent 40%)`,
        }}
      />

      <div className="relative z-10 text-center px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <p className="text-white/70 text-sm tracking-[0.3em] uppercase mb-6">
            {coupleName || 'Uma pergunta importante'}
          </p>
          <h1
            className="text-3xl md:text-5xl text-white font-serif leading-tight max-w-2xl mx-auto mb-3"
            style={{ fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined }}
          >
            Você ainda me ama?
          </h1>
          {senderName && (
            <p className="text-white/50 text-sm tracking-widest uppercase mb-10">— com carinho, {senderName}</p>
          )}
          {!senderName && <div className="h-10" />}
        </motion.div>

        <motion.p
          key={tries}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/60 text-sm mb-10"
        >
          {line}
        </motion.p>

        <div className="relative h-[200px] max-w-md mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={sayYes}
              className="px-14 py-5 rounded-full text-lg font-bold text-white shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
            >
              <span className="inline-flex items-center gap-2">
                <Heart size={20} fill="#fff" /> SIM
              </span>
            </motion.button>
          </div>

          <motion.button
            className="absolute px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg"
            style={{
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.4)',
              left: noPos ? `${noPos.x}%` : '12%',
              top: noPos ? `${noPos.y}%` : '12%',
              transition: 'left 0.25s ease, top 0.25s ease',
            }}
            onPointerEnter={dodge}
            onPointerDown={dodge}
            onClick={dodge}
          >
            Não
          </motion.button>
        </div>
      </div>

      {burst && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
          {Array.from({ length: 24 }, (_, i) => (
            <motion.span
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 500,
                y: (Math.random() - 0.5) * 500,
                scale: [0.3, 1.4, 0.6],
                rotate: (Math.random() - 0.5) * 180,
              }}
              transition={{ duration: 1, delay: Math.random() * 0.25, ease: 'easeOut' }}
            >
              <Sparkles size={26} fill="#fecdd3" stroke="#f43f5e" />
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
