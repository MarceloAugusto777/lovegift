"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion"

interface TemplateProps {
  gift: {
    coupleName: string
    specialDate: string
    message: string
    photos: string
    loveQuotes: string
    locationUrl?: string
    locationName?: string
    musicUrl?: string
    accentColor: string
    dayCountStart: string
    senderName?: string
    clientName?: string
    storyTitle?: string
    storySections: string
    timelineEvents: string
  }
}

interface StorySection {
  title: string
  text: string
  photo?: string
}

interface TimelineEvent {
  date: string
  title: string
  description: string
  photo?: string
}

const ACCENT = "#e11d48"
const ACCENT_LIGHT = "#fda4af"
const ACCENT_DARK = "#9f1239"

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 18,
        duration: 7 + Math.random() * 6,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 80,
      })),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: `${h.left}%`, bottom: "-5%" }}
          animate={{
            y: [0, -1100],
            x: [0, h.drift],
            rotate: [0, 360],
            opacity: [0, 0.5, 0.4, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={ACCENT}
            opacity="0.35"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

function HeartDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div
        className="h-px w-16"
        style={{
          background: `linear-gradient(to right, transparent, ${ACCENT}88)`,
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={ACCENT}
          opacity="0.7"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>
      <div
        className="h-px w-16"
        style={{
          background: `linear-gradient(to left, transparent, ${ACCENT}88)`,
        }}
      />
    </div>
  )
}

function HeroSection({
  coupleName,
  specialDate,
  storyTitle,
  photos,
}: {
  coupleName: string
  specialDate: string
  storyTitle?: string
  photos: string[]
}) {
  const [heroIdx, setHeroIdx] = useState(0)
  const { scrollYProgress } = useScroll()
  const bgY = useTransform(scrollYProgress, [0, 0.3], ["0%", "40%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.25], [0, -80])

  useEffect(() => {
    if (photos.length <= 1) return
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % photos.length), 5000)
    return () => clearInterval(t)
  }, [photos.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {photos.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIdx}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8 }}
            >
              <img
                src={photos[heroIdx]}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${ACCENT_DARK}, #1a0a12 70%, #0a0507)`,
            }}
          />
        )}
      </motion.div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(253, 164, 175, ${Math.random() * 0.3 + 0.1})`,
            }}
            animate={{
              y: [0, -40 - Math.random() * 30],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ opacity: textOpacity, y: textY }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeUp} className="flex justify-center">
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <svg
                width="90"
                height="90"
                viewBox="0 0 24 24"
                fill={ACCENT}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
              >
                <svg width="45" height="45" viewBox="0 0 24 24" fill="white">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <motion.div
              className="w-px h-14 mx-auto mb-6"
              style={{
                background: `linear-gradient(to bottom, transparent, ${ACCENT_LIGHT}, transparent)`,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              textShadow: `0 0 80px ${ACCENT}44`,
            }}
          >
            {coupleName.split("&").map((name, i) => (
              <span key={i}>
                {i === 1 && (
                  <motion.span
                    className="block text-3xl md:text-4xl lg:text-5xl my-3 font-light italic"
                    style={{ color: ACCENT_LIGHT }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    &amp;
                  </motion.span>
                )}
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i === 0 ? 0.4 : 1,
                    duration: 0.9,
                  }}
                >
                  {name.trim()}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {storyTitle && (
            <motion.p
              variants={fadeUp}
              className="font-serif text-xl md:text-2xl italic tracking-wide"
              style={{ color: ACCENT_LIGHT, fontFamily: "Georgia, serif" }}
            >
              {storyTitle}
            </motion.p>
          )}

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-4"
            style={{ color: `${ACCENT_LIGHT}cc` }}
          >
            <div className="h-px w-12" style={{ background: `${ACCENT}66` }} />
            <span
              className="text-sm tracking-[0.3em] uppercase font-light"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {new Date(specialDate).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <div className="h-px w-12" style={{ background: `${ACCENT}66` }} />
          </motion.div>

          <motion.div variants={fadeUp} className="pt-8">
            <motion.div
              className="inline-block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p
                className="text-xs tracking-[0.4em] uppercase mb-3"
                style={{ color: `${ACCENT_LIGHT}99` }}
              >
                Deslize para baixo
              </p>
              <svg
                className="w-5 h-5 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke={ACCENT_LIGHT}
                opacity="0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function MessageSection({ message }: { message: string }) {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${ACCENT_DARK}33, #0a0507 70%)`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center space-y-10"
        >
          <motion.div variants={fadeUp}>
            <HeartDivider />
          </motion.div>

          <motion.div variants={fadeUp}>
            <p
              className="font-serif text-4xl md:text-5xl italic"
              style={{ color: `${ACCENT}88` }}
            >
              &ldquo;
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-serif text-xl md:text-2xl text-white/80 leading-relaxed italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {message}
          </motion.p>

          <motion.div variants={fadeUp}>
            <p
              className="font-serif text-4xl md:text-5xl italic"
              style={{ color: `${ACCENT}88` }}
            >
              &rdquo;
            </p>
            <HeartDivider />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function LoveQuotesSection({ quotes }: { quotes: string[] }) {
  if (quotes.length === 0) return null

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/90" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="space-y-14"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2
              className="font-serif text-3xl md:text-4xl text-white/90"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Palavras de Amor
            </h2>
            <div
              className="w-24 h-px mx-auto mt-4"
              style={{
                background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
              }}
            />
          </motion.div>

          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div
                className="relative max-w-lg rounded-2xl p-6 md:p-8 border"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}11, ${ACCENT}08)`,
                  borderColor: `${ACCENT}22`,
                }}
              >
                <svg
                  className="absolute -top-3 -left-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={ACCENT}
                  opacity="0.4"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <p
                  className="font-serif text-base md:text-lg text-white/70 italic leading-relaxed pl-4"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function PhotosSection({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/95" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2
              className="font-serif text-3xl md:text-4xl text-white/90"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Nossos Momentos
            </h2>
            <div
              className="w-24 h-px mx-auto mt-4"
              style={{
                background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
              }}
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                className="break-inside-avoid"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative group overflow-hidden rounded-2xl">
                  <div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-700"
                    style={{ background: ACCENT }}
                  />
                  <img
                    src={photo}
                    alt={`Momento ${i + 1}`}
                    className="relative w-full object-cover rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-105 border border-white/10"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background: `linear-gradient(to top, ${ACCENT_DARK}88, transparent 50%)`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function LoveStorySection({
  sections,
  title,
}: {
  sections: StorySection[]
  title?: string
}) {
  if (sections.length === 0) return null

  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${ACCENT_DARK}22, transparent 50%),
                         radial-gradient(ellipse at 70% 80%, ${ACCENT_DARK}15, transparent 50%),
                         #0a0507`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="space-y-24"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2
              className="font-serif text-3xl md:text-4xl text-white/90"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {title || "Nossa História"}
            </h2>
            <div
              className="w-24 h-px mx-auto mt-4"
              style={{
                background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
              }}
            />
          </motion.div>

          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 md:gap-16 items-center`}
            >
              {section.photo && (
                <div className="w-full md:w-1/2">
                  <div className="relative group">
                    <div
                      className="absolute -inset-3 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700"
                      style={{ background: ACCENT }}
                    />
                    <img
                      src={section.photo}
                      alt={section.title}
                      className="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl border border-white/10"
                    />
                  </div>
                </div>
              )}

              <div
                className={`w-full ${
                  section.photo ? "md:w-1/2" : "max-w-2xl mx-auto"
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={ACCENT}
                      opacity="0.7"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <h3
                      className="font-serif text-2xl md:text-3xl"
                      style={{ color: ACCENT_LIGHT, fontFamily: "Georgia, serif" }}
                    >
                      {section.title}
                    </h3>
                  </div>
                  <div
                    className="w-12 h-0.5"
                    style={{ background: `${ACCENT}44` }}
                  />
                  <p
                    className="font-serif text-lg text-white/65 leading-relaxed"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {section.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TimelineSection({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return null

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="space-y-16"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2
              className="font-serif text-3xl md:text-4xl text-white/90"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Marcos do Nosso Amor
            </h2>
            <div
              className="w-24 h-px mx-auto mt-4"
              style={{
                background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
              }}
            />
          </motion.div>

          <div className="relative">
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-px h-full hidden md:block"
              style={{
                background: `linear-gradient(to bottom, transparent, ${ACCENT}55, transparent)`,
              }}
            />

            <div className="space-y-12 md:space-y-0">
              {events.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className={`relative flex items-center ${
                    i % 2 === 0 ? "" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden md:block w-1/2" />

                  <motion.div
                    className="relative z-10 w-5 h-5 rounded-full border-2 md:mx-0 mx-auto mb-4 md:mb-0"
                    style={{
                      borderColor: ACCENT,
                      background: `${ACCENT}33`,
                      boxShadow: `0 0 20px ${ACCENT}44`,
                    }}
                    whileInView={{ scale: [0, 1.3, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />

                  <div
                    className={`md:w-1/2 ${
                      i % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"
                    }`}
                  >
                    <motion.div
                      className="rounded-2xl p-6 border transition-colors duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${ACCENT}0a, ${ACCENT}05)`,
                        borderColor: `${ACCENT}18`,
                      }}
                      whileHover={{
                        borderColor: `${ACCENT}44`,
                        y: -4,
                      }}
                    >
                      {event.photo && (
                        <img
                          src={event.photo}
                          alt={event.title}
                          className="w-full h-40 object-cover rounded-xl mb-4 border border-white/10"
                        />
                      )}
                      <div
                        className="text-sm font-mono tracking-wider mb-2"
                        style={{ color: ACCENT_LIGHT }}
                      >
                        {new Date(event.date).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <h3
                        className="font-serif text-xl text-white mb-2"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {event.title}
                      </h3>
                      <p
                        className="text-white/55 text-sm leading-relaxed"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {event.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function DayCounterSection({
  dayCountStart,
  specialDate,
}: {
  dayCountStart: string
  specialDate: string
}) {
  const [daysCount, setDaysCount] = useState(0)
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const start = new Date(dayCountStart || specialDate)
    const now = new Date()
    const diff = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    setDaysCount(diff)
  }, [dayCountStart, specialDate])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let startTs = 0
          const duration = 2200
          const step = (ts: number) => {
            if (!startTs) startTs = ts
            const progress = Math.min((ts - startTs) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * daysCount))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [daysCount])

  return (
    <section ref={ref} className="relative py-28 md:py-36 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${ACCENT_DARK}22, #0a0507 70%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center space-y-10"
        >
          <motion.div variants={fadeUp}>
            <motion.div
              className="text-8xl md:text-[10rem] font-bold font-mono tabular-nums leading-none"
              style={{
                color: ACCENT,
                textShadow: `0 0 60px ${ACCENT}44, 0 0 120px ${ACCENT}22`,
                fontFamily: "'Georgia', serif",
              }}
            >
              {count}
            </motion.div>
            <p className="text-white/40 text-sm tracking-[0.4em] uppercase mt-6">
              Dias de Amor
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div
              className="w-40 h-px mx-auto"
              style={{
                background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
              }}
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-serif text-xl text-white/50 italic max-w-xl mx-auto"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Cada dia ao seu lado é uma bênção que agradeço ao universo
          </motion.p>

          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-6 max-w-md mx-auto pt-6">
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: `${ACCENT}0a`,
                borderColor: `${ACCENT}18`,
              }}
            >
              <p className="text-white/40 text-xs tracking-wider uppercase mb-1">
                Desde
              </p>
              <p
                className="text-white/80 text-sm"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {new Date(specialDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                })}
              </p>
            </div>
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: `${ACCENT}0a`,
                borderColor: `${ACCENT}18`,
              }}
            >
              <p className="text-white/40 text-xs tracking-wider uppercase mb-1">
                Total
              </p>
              <p
                className="text-2xl font-light"
                style={{ color: ACCENT_LIGHT, fontFamily: "Georgia, serif" }}
              >
                {daysCount}
              </p>
              <p className="text-white/40 text-xs">dias</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function LocationSection({
  locationUrl,
  locationName,
}: {
  locationUrl?: string
  locationName?: string
}) {
  if (!locationUrl && !locationName) return null

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 to-black/90" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center space-y-8"
        >
          <motion.div variants={fadeUp}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke={ACCENT}
              strokeWidth="1.5"
              className="mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            <h2
              className="font-serif text-3xl md:text-4xl text-white/90"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Nosso Lugar Especial
            </h2>
            <div
              className="w-24 h-px mx-auto"
              style={{
                background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
              }}
            />
          </motion.div>

          {locationName && (
            <motion.p
              variants={fadeUp}
              className="font-serif text-xl text-white/60 italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {locationName}
            </motion.p>
          )}

          {locationUrl && (
            <motion.a
              variants={fadeUp}
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 font-serif text-lg transition-all duration-500 hover:scale-105"
              style={{
                borderColor: ACCENT,
                color: ACCENT_LIGHT,
                fontFamily: "Georgia, serif",
              }}
              whileHover={{
                boxShadow: `0 0 40px ${ACCENT}44`,
                borderColor: ACCENT_LIGHT,
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              Ver no Mapa
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function FooterSection({ clientName }: { clientName?: string }) {
  return (
    <footer className="relative py-28 md:py-36 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, ${ACCENT_DARK}22, #0a0507)`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center space-y-10"
        >
          <motion.div variants={fadeUp}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill={ACCENT}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-5">
            <p
              className="font-serif text-xl text-white/60 italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Feito com todo amor do mundo
            </p>
            {clientName && (
              <p
                className="font-serif text-lg"
                style={{ color: ACCENT_LIGHT, fontFamily: "Georgia, serif" }}
              >
                Com amor, {clientName}
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeUp}>
            <div
              className="w-32 h-px mx-auto"
              style={{
                background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
              }}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2">
            <p className="text-white/25 text-sm tracking-widest uppercase">
              LoveGift
            </p>
            <p className="text-white/15 text-xs">
              Cada amor merece ser celebrado
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default function ValentineTemplate({ gift }: TemplateProps) {
  const photos = useMemo(() => {
    try {
      return JSON.parse(gift.photos) as string[]
    } catch {
      return []
    }
  }, [gift.photos])

  const loveQuotes = useMemo(() => {
    try {
      return JSON.parse(gift.loveQuotes) as string[]
    } catch {
      return []
    }
  }, [gift.loveQuotes])

  const storySections = useMemo(() => {
    try {
      return JSON.parse(gift.storySections) as StorySection[]
    } catch {
      return []
    }
  }, [gift.storySections])

  const timelineEvents = useMemo(() => {
    try {
      return JSON.parse(gift.timelineEvents) as TimelineEvent[]
    } catch {
      return []
    }
  }, [gift.timelineEvents])

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(to bottom, #0a0507, #0f0609 30%, #0a0507 70%, #0a0507)",
      }}
    >
      <FloatingHearts />

      <HeroSection
        coupleName={gift.coupleName}
        specialDate={gift.specialDate}
        storyTitle={gift.storyTitle}
        photos={photos}
      />

      <MessageSection message={gift.message} />

      {loveQuotes.length > 0 && (
        <LoveQuotesSection quotes={loveQuotes} />
      )}

      <PhotosSection photos={photos} />

      {storySections.length > 0 && (
        <LoveStorySection
          sections={storySections}
          title={gift.storyTitle}
        />
      )}

      <DayCounterSection
        dayCountStart={gift.dayCountStart}
        specialDate={gift.specialDate}
      />

      {timelineEvents.length > 0 && (
        <TimelineSection events={timelineEvents} />
      )}

      <LocationSection
        locationUrl={gift.locationUrl}
        locationName={gift.locationName}
      />

      <FooterSection clientName={gift.clientName} />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
