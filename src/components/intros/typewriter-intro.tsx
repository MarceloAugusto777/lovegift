'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { IntroProps } from './types'
import { getIntroMessage } from './types'

export default function TypewriterIntro({
  senderName,
  welcomeMessage,
  coupleName,
  accentColor,
  fontFamily,
  onOpen,
}: IntroProps) {
  const message = getIntroMessage(senderName, welcomeMessage)
  const [typed, setTyped] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (typed >= message.length) {
      const t = setTimeout(() => setDone(true), 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTyped((c) => c + 1), 42)
    return () => clearTimeout(t)
  }, [typed, message.length])

  const shown = useMemo(() => message.slice(0, typed), [typed, message])

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${accentColor}22 0%, #160b20 55%, #0d0714 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${accentColor}44 0, transparent 40%), radial-gradient(circle at 80% 70%, ${accentColor}33 0, transparent 40%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative w-[340px] max-w-[88vw] rounded-2xl shadow-2xl"
        style={{
          background: 'linear-gradient(150deg, #fffef9 0%, #fff6e7 100%)',
          border: `1px solid ${accentColor}55`,
          padding: '34px 28px 28px',
          fontFamily: fontFamily ? `'${fontFamily}', serif` : 'serif',
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Heart size={16} fill={accentColor} stroke={accentColor} />
          <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: accentColor, fontWeight: 700 }}>
            Uma carta para você
          </span>
        </div>

        <p className="text-lg leading-relaxed min-h-[120px]" style={{ color: '#3b2b17' }}>
          {shown}
          {!done && <span className="ml-0.5 inline-block w-[2px] h-[1.1em] align-middle" style={{ background: accentColor }} />}
        </p>

        {coupleName && (
          <p className="text-right text-sm mt-4 font-medium" style={{ color: '#8a6a2f' }}>
            — {coupleName}
          </p>
        )}

        {done && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={onOpen}
            className="mt-6 w-full py-3.5 rounded-full text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
          >
            Abrir presente ❤
          </motion.button>
        )}
      </motion.div>

      {!done && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-[8vh] text-white/40 text-xs tracking-widest uppercase"
        >
          {senderName ? `Escrito com carinho por ${senderName}` : 'Escrito com carinho'}
        </motion.p>
      )}
    </motion.div>
  )
}
