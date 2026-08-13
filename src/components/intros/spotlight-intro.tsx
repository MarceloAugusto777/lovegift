'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Flashlight, Heart } from 'lucide-react'
import type { IntroProps } from './types'
import { getIntroMessage } from './types'

const GRID = 18
const NEEDED = 0.6

export default function SpotlightIntro({
  senderName,
  welcomeMessage,
  coupleName,
  accentColor,
  fontFamily,
  onOpen,
}: IntroProps) {
  const [light, setLight] = useState<{ x: number; y: number } | null>(null)
  const [progress, setProgress] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const covered = useRef(new Set<number>())

  const message = getIntroMessage(senderName, welcomeMessage)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setLight({ x, y })
    const col = Math.floor((x / rect.width) * GRID)
    const row = Math.floor((y / rect.height) * GRID)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const c = col + dx
        const r = row + dy
        if (c >= 0 && c < GRID && r >= 0 && r < GRID) covered.current.add(r * GRID + c)
      }
    }
    const pct = covered.current.size / (GRID * GRID)
    setProgress(pct)
    if (pct >= NEEDED && !revealed) {
      setRevealed(true)
    }
  }

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: '#07040c' }}
      onPointerMove={handleMove}
    >
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: revealed ? 1 : 0.45,
        }}
      >
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Heart size={44} fill={accentColor} stroke={accentColor} className="mx-auto mb-6" />
            {coupleName && (
              <h1
                className="text-3xl md:text-5xl text-white font-serif mb-4"
                style={{ fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined }}
              >
                {coupleName}
              </h1>
            )}
            <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-lg mx-auto">
              {message}
            </p>
          </motion.div>
        </div>
      </div>

      {light && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle 130px at ${light.x}px ${light.y}px, transparent 20%, rgba(7,4,12,0.98) 55%, #07040c 75%)`,
          }}
        />
      )}

      {!revealed && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <Flashlight size={40} color={accentColor} className="opacity-80 animate-pulse" />
            <p className="text-white/50 text-sm tracking-widest uppercase">Arrraste a lanterna</p>
            <p className="text-white/30 text-xs">ilumine a escuridão para revelar o presente</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 px-6">
        <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${Math.min(progress * 100, 100)}%`, background: accentColor }}
          />
        </div>
        {revealed ? (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onOpen}
            className="px-10 py-3.5 rounded-full text-sm font-semibold text-white shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
          >
            Entrar no presente ❤
          </motion.button>
        ) : (
          <p className="text-white/25 text-[11px] tracking-widest uppercase">
            {Math.floor(progress * 100)}% revelado
          </p>
        )}
      </div>
    </motion.div>
  )
}
