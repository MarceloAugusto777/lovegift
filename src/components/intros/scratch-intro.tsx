'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { IntroProps } from './types'
import { getIntroMessage } from './types'

const GRID = 24

export default function ScratchIntro({
  senderName,
  welcomeMessage,
  coupleName,
  accentColor,
  fontFamily,
  onOpen,
}: IntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scratchingRef = useRef(false)
  const lastRef = useRef({ x: 0, y: 0 })
  const clearedCells = useRef(new Set<number>())
  const [revealed, setRevealed] = useState(false)

  const message = getIntroMessage(senderName, welcomeMessage)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, '#e6c15c')
    grad.addColorStop(0.5, '#d9a943')
    grad.addColorStop(1, '#c9953a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = 'rgba(120,80,20,0.25)'
    ctx.fillRect(0, 0, w, 5)
    ctx.fillRect(0, h - 5, w, 5)
    ctx.fillRect(0, 0, 5, h)
    ctx.fillRect(w - 5, 0, 5, h)

    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = `600 16px 'Poppins', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('💗', w / 2, h / 2 - 10)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = `600 15px 'Poppins', sans-serif`
    ctx.fillText('RASPE AQUI', w / 2, h / 2 + 22)
  }, [])

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const erase = (x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 26, 0, Math.PI * 2)
    ctx.fill()
    const rect = canvas.getBoundingClientRect()
    const col = Math.floor((x / rect.width) * GRID)
    const row = Math.floor((y / rect.height) * GRID)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const c = col + dx
        const r = row + dy
        if (c >= 0 && c < GRID && r >= 0 && r < GRID) {
          clearedCells.current.add(r * GRID + c)
        }
      }
    }
    const progress = clearedCells.current.size / (GRID * GRID)
    if (progress >= 0.5 && !revealed) {
      setRevealed(true)
      setTimeout(onOpen, 1100)
    }
  }

  const handleDown = (e: React.PointerEvent) => {
    scratchingRef.current = true
    const p = getPos(e)
    if (p) {
      lastRef.current = p
      erase(p.x, p.y)
    }
  }

  const handleMove = (e: React.PointerEvent) => {
    if (!scratchingRef.current) return
    const p = getPos(e)
    if (!p) return
    const last = lastRef.current
    const dist = Math.hypot(p.x - last.x, p.y - last.y)
    const steps = Math.max(1, Math.floor(dist / 8))
    for (let i = 1; i <= steps; i++) {
      const ix = last.x + ((p.x - last.x) * i) / steps
      const iy = last.y + ((p.y - last.y) * i) / steps
      erase(ix, iy)
    }
    lastRef.current = p
  }

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${accentColor} 0%, #1a1024 75%, #0d0714 100%)`,
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-[10vh] left-0 right-0 text-center text-white/80 text-lg tracking-[0.25em] uppercase"
      >
        Uma surpresa escondida
      </motion.p>

      <div className="relative w-[320px] max-w-[86vw]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(150deg, #fffef9 0%, #fff4e0 100%)',
            border: `3px solid ${accentColor}55`,
            minHeight: 420,
          }}
        >
          <div className="p-6 flex flex-col items-center justify-center text-center" style={{ minHeight: 420 }}>
            {coupleName && (
              <p
                className="text-[11px] tracking-[0.35em] uppercase mb-3"
                style={{ color: accentColor, fontWeight: 700 }}
              >
                Para você
              </p>
            )}
            {coupleName && (
              <h2
                className="text-2xl font-serif mb-4"
                style={{ fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined, color: '#3b2b17' }}
              >
                {coupleName}
              </h2>
            )}
            <Heart size={40} fill={accentColor} stroke={accentColor} className="mb-4" />
            <p className="text-sm leading-relaxed text-[#5b4524] font-light max-w-[240px]">
              {message}
            </p>
          </div>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ cursor: 'crosshair', touchAction: 'none' }}
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerUp={() => (scratchingRef.current = false)}
            onPointerLeave={() => (scratchingRef.current = false)}
          />
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40"
            >
              <span className="text-white font-semibold text-lg tracking-widest">Abrindo...</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-[8vh] left-0 right-0 text-center text-white/50 text-sm"
      >
        Arraste o dedo para raspar e revelar
      </motion.p>
    </motion.div>
  )
}
