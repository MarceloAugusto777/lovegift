'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Gamepad2, Camera, Sparkles } from 'lucide-react'
import HeartCatchGame from './heart-catch-game'
import PolaroidViewer from './polaroid-viewer'

export interface ExperiencesHubGift {
  coupleName: string
  accentColor: string
  fontFamily?: string
  photos: string
  miniGameEnabled: boolean
  miniGameDuration: number
  miniGameTarget: number
  miniGameMessage: string
  polaroidEnabled: boolean
  polaroidTitle: string
  polaroidMessage: string
}

export default function ExperiencesHub({ gift }: { gift: ExperiencesHubGift }) {
  const [active, setActive] = useState<'game' | 'polaroid' | null>(null)

  const gameOn = gift.miniGameEnabled
  const polaroidOn = gift.polaroidEnabled && gift.photos

  if (!gameOn && !polaroidOn) return null

  let photos: string[] = []
  try {
    const parsed = JSON.parse(gift.photos)
    if (Array.isArray(parsed)) photos = parsed.filter((p): p is string => typeof p === 'string')
  } catch {
    photos = []
  }

  const color = gift.accentColor
  const fontFamily = gift.fontFamily || 'serif'

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20"
      style={{ background: `linear-gradient(180deg, #120a18 0%, #0d0714 100%)`, fontFamily }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, ${color}33 0, transparent 45%), radial-gradient(circle at 75% 80%, ${color}22 0, transparent 45%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl w-full text-center"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px w-24 mx-auto mb-8"
          style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
        />
        <Heart size={18} fill={color} stroke={color} className="mx-auto mb-6" />
        <h2
          className="text-3xl md:text-5xl text-white font-serif mb-3"
          style={{ fontFamily: fontFamily }}
        >
          Capítulos do amor
        </h2>
        <p className="text-white/45 text-sm tracking-widest uppercase mb-12" style={{ letterSpacing: '0.25em' }}>
          {gift.coupleName ? `${gift.coupleName} — experiências para você` : 'Experiências para você'}
        </p>

        <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {gameOn && (
            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive('game')}
              className="rounded-2xl p-8 text-left cursor-pointer"
              style={{
                background: `linear-gradient(150deg, ${color}22 0%, rgba(255,255,255,0.04) 100%)`,
                border: `1px solid ${color}44`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${color}33` }}
              >
                <Gamepad2 size={24} color={color} />
              </div>
              <h3 className="text-white text-xl font-serif mb-2">Jogo do Amor</h3>
              <p className="text-white/45 text-sm leading-relaxed">
                Pegue corações antes que caiam e descubra o quanto o amor é grande. 💘
              </p>
              <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold" style={{ color }}>
                Jogar agora <span>→</span>
              </span>
            </motion.button>
          )}

          {polaroidOn && (
            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive('polaroid')}
              className="rounded-2xl p-8 text-left cursor-pointer"
              style={{
                background: `linear-gradient(150deg, ${color}22 0%, rgba(255,255,255,0.04) 100%)`,
                border: `1px solid ${color}44`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${color}33` }}
              >
                <Camera size={24} color={color} />
              </div>
              <h3 className="text-white text-xl font-serif mb-2">
                {gift.polaroidTitle || 'Momentos Polaroid'}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed">
                {gift.polaroidMessage || 'Fotos que caem como lembranças — toque para reviver cada uma. 📸'}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold" style={{ color }}>
                Reviver <span>→</span>
              </span>
            </motion.button>
          )}
        </div>

        <p className="text-white/25 text-xs mt-12 flex items-center justify-center gap-1.5">
          <Sparkles size={12} /> Feito com muito amor para você
        </p>
      </motion.div>

      <AnimatePresence>
        {active === 'game' && (
          <HeartCatchGame
            accentColor={color}
            fontFamily={gift.fontFamily}
            coupleName={gift.coupleName}
            durationSec={Math.max(5, gift.miniGameDuration || 20)}
            target={Math.max(1, gift.miniGameTarget || 12)}
            message={gift.miniGameMessage}
            onClose={() => setActive(null)}
          />
        )}
        {active === 'polaroid' && (
          <PolaroidViewer
            photos={photos}
            accentColor={color}
            fontFamily={gift.fontFamily}
            coupleName={gift.coupleName}
            title={gift.polaroidTitle}
            message={gift.polaroidMessage}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
