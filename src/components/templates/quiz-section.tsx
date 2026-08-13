'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Sparkles, RotateCcw, Heart } from 'lucide-react'

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  feedback?: string
}

interface QuizSectionProps {
  quiz: string
  quizEnabled: boolean
  quizFinalMessage?: string
  accentColor: string
  fontFamily?: string
  title?: string
}

export default function QuizSection({
  quiz,
  quizEnabled,
  quizFinalMessage,
  accentColor,
  fontFamily,
  title,
}: QuizSectionProps) {
  const questions = useMemo<QuizQuestion[]>(() => {
    if (!quiz) return []
    try {
      const parsed = JSON.parse(quiz)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [quiz])

  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  if (!quizEnabled || questions.length === 0) return null

  const q = questions[current]
  const isLast = current === questions.length - 1
  const allCorrect = score === questions.length

  const chooseOption = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    if (index === q.correctIndex) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    if (isLast) {
      setFinished(true)
      return
    }
    setCurrent((c) => c + 1)
    setSelected(null)
  }

  const restart = () => {
    setStarted(true)
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  const confettiColors = ['#e11d48', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', accentColor]
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.5,
        color: confettiColors[i % confettiColors.length],
        rotate: (Math.random() - 0.5) * 720,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allCorrect]
  )

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-[680px] mx-auto px-5">
        <div className="rounded-3xl shadow-2xl overflow-hidden bg-white border-t-4"
          style={{ borderTopColor: accentColor }}>
          <div className="px-6 py-10 md:px-10 md:py-12 text-center">
            <Heart className="mx-auto mb-4" size={34} style={{ color: accentColor }} />
            <h2
              className="text-2xl md:text-3xl font-serif mb-3"
              style={{
                fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined,
                color: '#1f2937',
              }}
            >
              {title || "Nosso Quiz"}
            </h2>

            {!started && (
              <>
                <p className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed">
                  Você acha que me conhece bem? Responda as perguntas e descubra
                  quanto você sabe sobre a gente.
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStarted(true)}
                  className="px-8 py-3 rounded-full text-white font-medium shadow-lg transition"
                  style={{ backgroundColor: accentColor }}
                >
                  Começar
                </motion.button>
              </>
            )}

            {started && !finished && q && (
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ color: accentColor, backgroundColor: `${accentColor}1a` }}
                  >
                    Pergunta {current + 1} de {questions.length}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {score} {score === 1 ? "acerto" : "acertos"}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-6 leading-snug">
                  {q.question}
                </h3>

                <div className="grid gap-3 text-left">
                  {q.options.map((opt, i) => {
                    let styles: React.CSSProperties = {
                      border: `1.5px solid ${selected === null ? '#e5e7eb' : '#f3f4f6'}`,
                      color: '#374151',
                    }
                    let Icon: React.ReactNode = null
                    if (selected !== null) {
                      if (i === q.correctIndex) {
                        styles = {
                          border: `1.5px solid ${accentColor}`,
                          backgroundColor: `${accentColor}14`,
                          color: '#1f2937',
                        }
                        Icon = <Check size={18} style={{ color: accentColor }} />
                      } else if (i === selected) {
                        styles = {
                          border: '1.5px solid #ef4444',
                          backgroundColor: '#fef2f2',
                          color: '#991b1b',
                        }
                        Icon = <X size={18} className="text-red-500" />
                      } else {
                        styles.opacity = 0.55
                      }
                    }
                    return (
                      <motion.button
                        key={i}
                        whileTap={selected === null ? { scale: 0.98 } : undefined}
                        onClick={() => chooseOption(i)}
                        disabled={selected !== null}
                        className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl text-sm md:text-base font-medium transition"
                        style={styles}
                      >
                        <span>{opt}</span>
                        {Icon}
                      </motion.button>
                    )
                  })}
                </div>

                {selected !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    {q.feedback ? (
                      <p
                        className="text-sm md:text-base italic mb-5"
                        style={{ color: '#6b7280' }}
                      >
                        {q.feedback}
                      </p>
                    ) : (
                      <p
                        className="text-sm md:text-base italic mb-5"
                        style={{ color: '#6b7280' }}
                      >
                        {selected === q.correctIndex
                          ? "Acertou! Você me conhece mesmo."
                          : "Quase! A resposta certa está em destaque."}
                      </p>
                    )}
                    <button
                      onClick={nextQuestion}
                      className="px-8 py-3 rounded-full text-white font-medium shadow-lg transition"
                      style={{ backgroundColor: accentColor }}
                    >
                      {isLast ? "Ver resultado" : "Próxima pergunta"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {finished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                {allCorrect && (
                  <div className="pointer-events-none absolute inset-0">
                    {particles.map((p) => (
                      <motion.span
                        key={p.id}
                        className="absolute top-0 block w-2 h-2 rounded-sm"
                        style={{
                          left: `${p.left}%`,
                          backgroundColor: p.color,
                        }}
                        initial={{ y: -20, opacity: 1 }}
                        animate={{
                          y: 420,
                          opacity: 0,
                          rotate: p.rotate,
                        }}
                        transition={{
                          duration: p.duration,
                          delay: p.delay,
                          ease: 'easeIn',
                        }}
                      />
                    ))}
                  </div>
                )}

                <Sparkles className="mx-auto mb-4" size={32} style={{ color: accentColor }} />
                <div
                  className="text-5xl md:text-6xl font-bold mb-2"
                  style={{ color: accentColor }}
                >
                  {score}
                  <span className="text-2xl text-gray-400 font-semibold">
                    /{questions.length}
                  </span>
                </div>
                <p className="text-gray-500 mb-6">
                  {allCorrect
                    ? "PERFEITO! Você me conhece demais."
                    : score >= questions.length / 2
                      ? "Muito bem! Você quase acertou tudo."
                      : "Que bom que você tentou... agora sabe um pouco mais de mim."}
                </p>

                {allCorrect && quizFinalMessage ? (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-base md:text-lg italic font-serif mb-6 leading-relaxed"
                    style={{
                      color: '#1f2937',
                      fontFamily: fontFamily ? `'${fontFamily}', serif` : undefined,
                    }}
                  >
                    {quizFinalMessage}
                  </motion.p>
                ) : !allCorrect && quizFinalMessage ? (
                  <p
                    className="text-sm md:text-base italic text-gray-500 mb-6 leading-relaxed"
                  >
                    {quizFinalMessage}
                  </p>
                ) : null}

                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-gray-500 border border-gray-200 hover:border-gray-300 transition"
                >
                  <RotateCcw size={16} />
                  Refazer quiz
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
