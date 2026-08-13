'use client'

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, RotateCcw, Trophy } from 'lucide-react'

interface HeartCatchGameProps {
  accentColor: string
  fontFamily?: string
  coupleName?: string
  durationSec: number
  target: number
  message?: string
  onClose: () => void
}

interface FallingHeart {
  id: number
  x: number
  y: number
  speed: number
  size: number
  rot: number
  drift: number
}

interface Popup {
  id: number
  x: number
  y: number
}

type Phase = 'intro' | 'playing' | 'done'

export default function HeartCatchGame({
  accentColor,
  fontFamily,
  coupleName,
  durationSec,
  target,
  message,
  onClose,
}: HeartCatchGameProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [hearts, setHearts] = useState<FallingHeart[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(durationSec)
  const [popups, setPopups] = useState<Popup[]>([])
  const [won, setWon] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const heartsRef = useRef<FallingHeart[]>([])
  const scoreRef = useRef(0)
  const timeLeftRef = useRef(durationSec)
  const rafRef = useRef(0)
  const frameRef = useRef(0)
  const endRef = useRef(0)
  const idRef = useRef(0)
  const popupIdRef = useRef(0)
  const phaseRef = useRef<Phase>('intro')

  const startGame = () => {
    phaseRef.current = 'playing'
    heartsRef.current = []
    scoreRef.current = 0
    timeLeftRef.current = durationSec
    endRef.current = Date.now() + durationSec * 1000
    frameRef.current = 0
    idRef.current = 0
    popupIdRef.current = 0
    setHearts([])
    setScore(0)
    setTimeLeft(durationSec)
    setPopups([])
    setWon(false)
    setPhase('playing')
  }

  const finish = useCallback((win: boolean) => {
    phaseRef.current = 'done'
    setWon(win)
    setPhase('done')
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return

    const w = window.innerWidth
    const h = window.innerHeight

    for (let i = 0; i < 4; i++) {
      heartsRef.current.push({
        id: idRef.current++,
        x: Math.random() * (w - 80),
        y: -60 - Math.random() * 200,
        speed: 1.2 + Math.random() * 1.4,
        size: 40 + Math.random() * 22,
        rot: (Math.random() - 0.5) * 30,
        drift: (Math.random() - 0.5) * 0.5,
      })
    }
    setHearts([...heartsRef.current])

    const step = () => {
      frameRef.current += 1
      const now = Date.now()
      const remaining = Math.max(0, (endRef.current - now) / 1000)
      timeLeftRef.current = remaining

      if (frameRef.current % 24 === 0) {
        const size = 36 + Math.random() * 22
        heartsRef.current.push({
          id: idRef.current++,
          x: Math.random() * (w - 80),
          y: -60,
          speed: 1.2 + Math.random() * 1.6,
          size,
          rot: (Math.random() - 0.5) * 30,
          drift: (Math.random() - 0.5) * 0.5,
        })
      }

      heartsRef.current = heartsRef.current.filter((hrt) => {
        hrt.y += hrt.speed * 1.5
        hrt.x += hrt.drift * 1.5
        hrt.rot += 0.5
        return hrt.y < h + 90
      })

      setHearts(heartsRef.current.length ? [...heartsRef.current] : [])

      if (frameRef.current % 10 === 0) {
        setTimeLeft(remaining)
      }

      if (remaining <= 0) {
        finish(scoreRef.current >= target)
        return
      }
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase, finish, target])

  const catchHeart = (id: number, e?: SyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (phaseRef.current !== 'playing') return
    const heart = heartsRef.current.find((hrt) => hrt.id === id)
    if (!heart) return
    heartsRef.current = heartsRef.current.filter((hrt) => hrt.id !== id)
    setHearts(heartsRef.current.length ? [...heartsRef.current] : [])

    scoreRef.current += 1
    setScore(scoreRef.current)
    setPopups((prev) => [
      ...prev,
      { id: popupIdRef.current++, x: heart.x, y: Math.max(10, heart.y - 20) },
    ])
    setTimeout(() => {
      setPopups((prev) => prev.slice(1))
    }, 700)

    if (scoreRef.current >= target) {
      finish(true)
    }
  }

  const progress = durationSec > 0 ? Math.min(1, timeLeft / durationSec) : 0

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

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            exit={{ opacity: 0, y: -30 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={80} fill={accentColor} stroke={accentColor} className="mx-auto mb-8" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl text-white font-serif mb-3">Jogo do Amor</h2>
            <p className="text-white/60 text-sm max-w-sm mb-8 leading-relaxed">
              Pegue <strong style={{ color: accentColor }}>{target} corações</strong> em até{' '}
              <strong style={{ color: accentColor }}>{durationSec} segundos</strong>
              {coupleName ? `, ${coupleName}` : ''}! Toque neles antes que caiam. 💘
            </p>
            <button
              onClick={startGame}
              className="px-12 py-4 rounded-full text-base font-bold text-white shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
            >
              Começar 💓
            </button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute top-4 left-4 right-16 z-20">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div
                  className="rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
                >
                  ❤ {score} / {target}
                </div>
                <div
                  className="rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
                >
                  ⏱ {Math.ceil(timeLeft)}s
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-150"
                  style={{ width: `${progress * 100}%`, background: accentColor }}
                />
              </div>
            </div>

            <div
              ref={containerRef}
              className="absolute inset-0 overflow-hidden"
              style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
            >
              {hearts.map((hrt) => (
                <button
                  key={hrt.id}
                  type="button"
                  onPointerDown={(e) => catchHeart(hrt.id, e)}
                  onClick={(e) => catchHeart(hrt.id, e)}
                  className="absolute cursor-pointer select-none"
                  style={{
                    left: hrt.x,
                    top: hrt.y,
                    background: 'transparent',
                    border: 'none',
                    padding: 8,
                    transform: `rotate(${hrt.rot}deg)`,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <Heart
                    size={hrt.size}
                    fill={accentColor}
                    stroke="#fff"
                    strokeWidth={1.5}
                    style={{ filter: `drop-shadow(0 3px 8px rgba(0,0,0,0.45))` }}
                  />
                </button>
              ))}
            </div>

            {popups.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, scale: 0.6, y: 0 }}
                animate={{ opacity: 0, scale: 1.3, y: -46 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute z-30 font-bold pointer-events-none"
                style={{ left: p.x, top: p.y, color: '#fff', fontSize: 20, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                +1 💘
              </motion.span>
            ))}
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
              style={{ background: `${accentColor}22`, border: `2px solid ${accentColor}` }}
            >
              <Trophy size={36} color={accentColor} />
            </div>
            <h2 className="text-3xl text-white font-serif mb-3">
              {won ? 'Você me conhece demais! 🎉' : 'Quase... 💘'}
            </h2>
            <p className="text-white/70 text-base mb-2">
              Você pegou <strong style={{ color: accentColor }}>{score}</strong> corações!
            </p>
            {(message?.trim() || won) && (
              <p className="text-white/50 text-sm max-w-sm mb-10 leading-relaxed">
                {message?.trim() || 'Mas o amor aqui é imenso, e cada coração é seu.'}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <RotateCcw size={16} /> Jogar de novo
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3.5 rounded-full text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}
              >
                Continuar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
