'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Unlock, Gift, Image as ImageIcon, MessageSquareHeart, Heart } from 'lucide-react'

interface SurpriseSectionProps {
  surpriseEnabled: boolean
  surpriseQuestion?: string
  surpriseAnswer?: string
  surpriseType?: string
  surpriseTitle?: string
  surpriseText?: string
  surprisePhoto?: string
  accentColor: string
  fontFamily?: string
}

const normalize = (s: string) =>
  s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function SurpriseSection({
  surpriseEnabled,
  surpriseQuestion,
  surpriseAnswer,
  surpriseType,
  surpriseTitle,
  surpriseText,
  surprisePhoto,
  accentColor,
  fontFamily,
}: SurpriseSectionProps) {
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const type = surpriseType || 'text'

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.4 + Math.random() * 1.6,
        color: ['#e11d48', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', accentColor][i % 6],
        rotate: (Math.random() - 0.5) * 720,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unlocked]
  )

  if (!surpriseEnabled) return null

  const checkAnswer = () => {
    if (normalize(answer) === normalize(surpriseAnswer || '')) {
      setUnlocked(true)
      return
    }
    setWrong(true)
    setAttempts((a) => a + 1)
    setTimeout(() => setWrong(false), 600)
  }

  const typeLabel = type === 'photo' ? 'uma foto' : type === 'brincadeira' ? 'uma brincadeira' : 'uma mensagem'
  const typeIcon =
    type === 'photo' ? (
      <ImageIcon size={34} style={{ color: accentColor }} />
    ) : type === 'brincadeira' ? (
      <Gift size={34} style={{ color: accentColor }} />
    ) : (
      <MessageSquareHeart size={34} style={{ color: accentColor }} />
    )

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-[680px] mx-auto px-5">
        <div
          className="rounded-3xl shadow-2xl overflow-hidden bg-white border-t-4"
          style={{ borderTopColor: accentColor }}
        >
          <div className="px-6 py-10 md:px-10 md:py-12 text-center">
            <motion.div
              animate={wrong ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Lock className="mx-auto mb-4" size={34} style={{ color: accentColor }} />
              <h2
                className="text-2xl md:text-3xl font-serif mb-3"
                style={{
                  fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined,
                  color: '#1f2937',
                }}
              >
                Surpresa Especial
              </h2>

              {!unlocked ? (
                <>
                  <p className="text-gray-500 text-sm md:text-base mb-2 leading-relaxed">
                    Deixei uma surpresa guardada pra voce: {typeLabel}.
                  </p>
                  <p className="text-gray-500 text-sm md:text-base mb-6 leading-relaxed">
                    Responda a pergunta para desbloquear:
                  </p>

                  <p
                    className="text-lg md:text-xl font-semibold text-gray-900 mb-5 leading-snug"
                  >
                    {surpriseQuestion}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                      placeholder="Digite sua resposta..."
                      className="flex-1 px-5 py-3 rounded-full text-sm md:text-base text-gray-900 outline-none border transition"
                      style={{
                        borderColor: wrong ? '#ef4444' : '#e5e7eb',
                        boxShadow: wrong ? '0 0 0 3px rgba(239,68,68,0.15)' : 'none',
                      }}
                    />
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={checkAnswer}
                      className="px-8 py-3 rounded-full text-white font-medium shadow-lg transition"
                      style={{ backgroundColor: accentColor }}
                    >
                      Desbloquear
                    </motion.button>
                  </div>

                  {wrong && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-4 font-medium"
                    >
                      Hmm, nao e essa. Tente de novo!
                    </motion.p>
                  )}
                  {!wrong && attempts > 0 && (
                    <p className="text-gray-400 text-xs mt-4">
                      Dica: voce so vai acertar se lembrar bem de nos.
                    </p>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="pointer-events-none absolute inset-0">
                    {particles.map((p) => (
                      <motion.span
                        key={p.id}
                        className="absolute top-0 block w-2 h-2 rounded-sm"
                        style={{ left: `${p.left}%`, backgroundColor: p.color }}
                        initial={{ y: -20, opacity: 1 }}
                        animate={{ y: 460, opacity: 0, rotate: p.rotate }}
                        transition={{
                          duration: p.duration,
                          delay: p.delay,
                          ease: 'easeIn',
                        }}
                      />
                    ))}
                  </div>

                  <Unlock className="mx-auto mb-4" size={34} style={{ color: accentColor }} />
                  <h3
                    className="text-xl md:text-2xl font-serif mb-4"
                    style={{
                      fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined,
                      color: '#1f2937',
                    }}
                  >
                    {surpriseTitle || "Para voce"}
                  </h3>

                  {type === 'photo' && surprisePhoto ? (
                    <div className="mb-4 overflow-hidden rounded-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={surprisePhoto}
                        alt="Surpresa"
                        className="w-full object-cover max-h-[420px]"
                      />
                    </div>
                  ) : (
                    <p
                      className="text-base md:text-lg leading-relaxed font-serif"
                      style={{
                        color: '#374151',
                        fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined,
                      }}
                    >
                      {surpriseText || "Voce ganhou! Te amo."}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm" style={{ color: accentColor }}>
                    <Heart size={16} fill="currentColor" />
                    <span className="font-medium">Feito com amor, so pra voce</span>
                    <Heart size={16} fill="currentColor" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
