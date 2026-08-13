'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { IntroProps } from './types'

const MAX_TAPS = 7

export default function HeartbeatIntro({
  senderName,
  welcomeMessage,
  coupleName,
  accentColor,
  fontFamily,
  onOpen,
}: IntroProps) {
  const [taps, setTaps] = useState(0)
  const [burst, setBurst] = useState(false)
  const [beat, setBeat] = useState(1)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (burst) return
    setBeat(1)
    const interval = setInterval(() => {
      setBeat((b) => (b >= 2 ? 1 : 2))
    }, Math.max(900 - taps * 110, 280))
    return () => clearInterval(interval)
  }, [taps, burst])

  const tap = () => {
    if (burst) return
    const next = taps + 1
    setTaps(next)
    if (next >= MAX_TAPS) {
      setBurst(true)
      setTimeout(onOpen, 1000)
    }
  }

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden text-center"
      style={{
        background: `radial-gradient(circle at 50% 40%, ${accentColor}33 0%, #140a18 60%, #0d0714 100%)`,
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-white/70 text-sm tracking-[0.3em] uppercase mb-12"
      >
        {coupleName || 'Toque com o coração'}
      </motion.p>

      <motion.button
        onClick={tap}
        whileTap={{ scale: 0.9 }}
        animate={{ scale: burst ? 2.2 : beat, rotate: burst ? 30 : 0 }}
        transition={{ duration: burst ? 0.5 : 0.25, ease: burst ? 'easeOut' : 'easeInOut' }}
        className="relative cursor-pointer outline-none"
        style={{ background: 'transparent', border: 'none' }}
      >
        <Heart
          size={taps >= 3 ? 120 : 90}
          fill={accentColor}
          stroke={accentColor}
          style={{
            filter: `drop-shadow(0 0 ${20 + taps * 8}px ${accentColor})`,
            transition: 'width 0.3s, height 0.3s',
          }}
        />
        {burst && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Heart size={140} fill="rgba(255,255,255,0.9)" stroke="none" />
          </span>
        )}
      </motion.button>

      <motion.p
        key={taps}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white/60 text-sm mt-12 mb-6"
      >
        {burst
          ? 'TE AMO! ❤'
          : taps === 0
            ? 'Toque no coração para fazer o amor bater'
            : taps === MAX_TAPS - 1
              ? 'Quase lá... ele está explodindo de amor!'
              : `Batendo cada vez mais forte... (${taps}/${MAX_TAPS})`}
      </motion.p>

      {burst && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 30 }, (_, i) => (
            <motion.span
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 600,
                scale: [0.3, 1.5, 0.5],
                rotate: (Math.random() - 0.5) * 220,
              }}
              transition={{ duration: 1.2, delay: Math.random() * 0.3, ease: 'easeOut' }}
            >
              <Heart size={30} fill="#fecdd3" stroke="#f43f5e" />
            </motion.span>
          ))}
        </div>
      )}

      {senderName && !burst && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-[8vh] text-white/40 text-xs tracking-widest uppercase"
        >
          {welcomeMessage?.trim() ? '' : `De ${senderName}, com amor`}
        </motion.p>
      )}
    </motion.div>
  )
}
