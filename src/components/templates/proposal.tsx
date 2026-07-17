"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const sectionVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

interface TimelineEvent {
  date: string
  title: string
  description: string
  photo?: string
}

interface StorySection {
  title: string
  text: string
  photo?: string
}

interface ProposalTemplateProps {
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

function HeroSection({ gift, daysCount }: { gift: ProposalTemplateProps['gift']; daysCount: number }) {
  const photos = JSON.parse(gift.photos) as string[]
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    if (photos.length <= 1) return
    const timer = setInterval(() => {
      setHeroIdx((p) => (p + 1) % photos.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [photos.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {photos.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIdx}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8 }}
            >
              <img
                src={photos[heroIdx]}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-950 via-rose-900 to-neutral-950" />
        )}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 5 + 1,
              height: Math.random() * 5 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(225, 29, 72, ${Math.random() * 0.3 + 0.05})`,
            }}
            animate={{
              y: [0, -80 - Math.random() * 60],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeUp}>
            <motion.div
              className="w-0.5 h-20 bg-gradient-to-b from-transparent via-rose-400 to-transparent mx-auto mb-10"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight leading-tight"
            style={{ textShadow: '0 0 80px rgba(0,0,0,0.6)' }}
          >
            {gift.coupleName}
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-4"
          >
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
            <motion.span
              className="text-rose-300 text-sm tracking-[0.3em] uppercase font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              {new Date(gift.specialDate).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </motion.span>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="pt-12 space-y-6"
          >
            <motion.p
              className="text-rose-200/90 text-lg md:text-xl font-serif italic tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              {gift.storyTitle || 'Nossa História de Amor'}
            </motion.p>

            <motion.div
              className="inline-block"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-rose-400/70 text-xs tracking-[0.4em] uppercase mb-3">Role para continuar</div>
              <svg className="w-5 h-5 mx-auto text-rose-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function RingMoment({ accentColor }: { accentColor: string }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950 via-neutral-950 to-rose-950" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <motion.div
              className="w-1 h-1 bg-rose-300/20 rounded-full"
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-10"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <motion.div
              className="relative inline-block"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 200 160" className="w-40 h-32 md:w-56 md:h-44 mx-auto">
                <motion.path
                  d="M100 140 C100 140 20 100 20 55 C20 30 45 15 65 25 C80 32 90 50 100 70 C110 50 120 32 135 25 C155 15 180 30 180 55 C180 100 100 140 100 140Z"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />

                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2, duration: 1, type: 'spring', stiffness: 100 }}
                >
                  <polygon
                    points="100,40 106,55 122,55 109,64 114,80 100,71 86,80 91,64 78,55 94,55"
                    fill={accentColor}
                    opacity="0.9"
                  />
                </motion.g>
              </svg>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            <motion.h2
              className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2.5, duration: 1.2 }}
            >
              Will You Be Mine?
            </motion.h2>

            <motion.p
              className="font-serif text-lg md:text-xl text-rose-300/70 italic max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 3.5, duration: 1 }}
            >
              Forever starts with a single yes
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function MessageSection({ message, accentColor, senderName }: { message: string; accentColor: string; senderName?: string }) {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950 via-rose-900/30 to-rose-950" />
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, ${accentColor}44, transparent 50%),
                              radial-gradient(circle at 70% 60%, ${accentColor}22, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center space-y-12"
        >
          <motion.div variants={fadeUp}>
            <div
              className="w-16 h-px mx-auto mb-8"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
            <h2 className="font-serif text-4xl md:text-5xl text-white/90 italic leading-relaxed">
              &ldquo;
            </h2>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-serif text-xl md:text-2xl text-white/80 leading-relaxed italic"
          >
            {message}
          </motion.p>

          <motion.div variants={fadeUp}>
            <h2 className="font-serif text-4xl md:text-5xl text-white/90 italic">
              &rdquo;
            </h2>
            <div
              className="w-16 h-px mx-auto mt-8"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
            {senderName && (
              <motion.p
                className="font-serif text-lg text-rose-300/60 mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                &mdash; {senderName}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function StorySection({ sections, accentColor }: { sections: StorySection[]; accentColor: string }) {
  if (sections.length === 0) return null

  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950 to-neutral-950" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="space-y-28"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white/90">Nossa Jornada</h2>
            <div
              className="w-24 h-px mx-auto mt-6"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          {sections.map((section, i) => (
            <motion.div
              key={i}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-20 items-center`}
            >
              {section.photo && (
                <motion.div className="w-full md:w-1/2" variants={scaleIn}>
                  <div className="relative group">
                    <div
                      className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700"
                      style={{ background: accentColor }}
                    />
                    <img
                      src={section.photo}
                      alt={section.title}
                      className="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                </motion.div>
              )}

              <div className={`w-full ${section.photo ? 'md:w-1/2' : 'max-w-2xl mx-auto'}`}>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-mono"
                      style={{ color: accentColor }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="h-px w-8 bg-white/10" />
                  </div>
                  <h3
                    className="font-serif text-2xl md:text-3xl text-white"
                  >
                    {section.title}
                  </h3>
                  <div
                    className="w-12 h-0.5"
                    style={{ background: accentColor }}
                  />
                  <p className="font-serif text-lg text-white/60 leading-relaxed">
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

function TimelineSection({ events, accentColor }: { events: TimelineEvent[]; accentColor: string }) {
  if (events.length === 0) return null

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-rose-950/20 to-neutral-950" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="space-y-16"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white/90">Nossos Marcos</h2>
            <div
              className="w-24 h-px mx-auto mt-6"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          <div className="relative">
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-px h-full hidden md:block"
              style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}88, transparent)` }}
            />

            <div className="space-y-16 md:space-y-0">
              {events.map((event, i) => (
                <motion.div
                  key={i}
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className={`relative flex items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  <div className="hidden md:block w-1/2" />

                  <motion.div
                    className="relative z-10 w-5 h-5 rounded-full border-2 md:mx-0 mx-auto mb-6 md:mb-0 shrink-0"
                    style={{ borderColor: accentColor, background: `${accentColor}33` }}
                    whileInView={{ scale: [0, 1.4, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />

                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pl-16' : 'md:pr-16 md:text-right'}`}>
                    <motion.div
                      className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-7 border border-white/5 hover:border-white/20 transition-all duration-500"
                      whileHover={{ y: -6, boxShadow: `0 20px 60px ${accentColor}11` }}
                    >
                      {event.photo && (
                        <img
                          src={event.photo}
                          alt={event.title}
                          className="w-full h-44 object-cover rounded-xl mb-5"
                        />
                      )}
                      <div
                        className="text-xs font-mono tracking-wider mb-3"
                        style={{ color: accentColor }}
                      >
                        {new Date(event.date).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl text-white mb-2">{event.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{event.description}</p>
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

function CounterSection({ daysCount, accentColor }: { daysCount: number; accentColor: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 2500
          const step = (timestamp: number) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * daysCount))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [daysCount])

  return (
    <section ref={ref} className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 to-rose-950/30" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 60%)`,
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
            <p className="text-white/30 text-sm tracking-[0.4em] uppercase mb-6">Desde que tudo começou</p>
            <div
              className="text-7xl md:text-9xl font-bold font-mono tabular-nums"
              style={{ color: accentColor }}
            >
              {count}
            </div>
            <div className="text-white/40 text-lg tracking-[0.3em] uppercase mt-4">
              Dias Inesquecíveis
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div
              className="w-32 h-px mx-auto"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          <motion.p variants={fadeUp} className="font-serif text-lg md:text-xl text-white/50 italic max-w-xl mx-auto">
            E eu quero passar todos os dias que ainda virão ao seu lado
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

function PhotosSection({ photos, accentColor }: { photos: string[]; accentColor: string }) {
  if (photos.length === 0) return null

  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/30 to-neutral-950" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-white/90">Nossos Momentos</h2>
            <div
              className="w-24 h-px mx-auto mt-6"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                className="break-inside-avoid"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative group overflow-hidden rounded-2xl">
                  <div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
                    style={{ background: accentColor }}
                  />
                  <img
                    src={photo}
                    alt={`Momento ${i + 1}`}
                    className="relative w-full object-cover rounded-2xl shadow-lg transition-transform duration-700 group-hover:scale-105"
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

function QuotesSection({ quotes, accentColor }: { quotes: string[]; accentColor: string }) {
  if (quotes.length === 0) return null

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-rose-950/20 to-neutral-950" />
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-12"
        >
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="text-center"
            >
              <p className="font-serif text-lg md:text-xl text-white/40 italic leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              {i < quotes.length - 1 && (
                <div
                  className="w-12 h-px mx-auto mt-8"
                  style={{ background: `linear-gradient(to right, transparent, ${accentColor}44, transparent)` }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function LocationSection({ locationUrl, locationName, accentColor }: { locationUrl?: string; locationName?: string; accentColor: string }) {
  if (!locationUrl && !locationName) return null

  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 to-rose-950/20" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center space-y-10"
        >
          <motion.div variants={fadeUp}>
            <svg viewBox="0 0 24 24" className="w-12 h-12 mx-auto" fill="none" stroke={accentColor} strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl text-white/90">
              O Lugar do Pedido
            </h2>
            <div
              className="w-20 h-px mx-auto"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          {locationName && (
            <motion.p variants={fadeUp} className="font-serif text-xl text-white/60 italic">
              {locationName}
            </motion.p>
          )}

          {locationUrl && (
            <motion.a
              variants={fadeUp}
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border font-serif text-lg transition-all duration-300 hover:scale-105"
              style={{
                borderColor: `${accentColor}66`,
                color: accentColor,
              }}
              whileHover={{ boxShadow: `0 0 40px ${accentColor}33` }}
            >
              Ver Localização
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function FooterSection({ clientName, accentColor }: { clientName?: string; accentColor: string }) {
  return (
    <footer className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/20 to-rose-950" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center space-y-10"
        >
          <motion.div variants={fadeUp}>
            <svg viewBox="0 0 200 160" className="w-24 h-20 md:w-32 md:h-24 mx-auto">
              <path
                d="M100 140 C100 140 20 100 20 55 C20 30 45 15 65 25 C80 32 90 50 100 70 C110 50 120 32 135 25 C155 15 180 30 180 55 C180 100 100 140 100 140Z"
                fill={accentColor}
                opacity="0.6"
              />
            </svg>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-5">
            <p className="font-serif text-2xl text-white/70 italic">
              Para sempre, se você quiser
            </p>
            {clientName && (
              <p className="font-serif text-lg" style={{ color: accentColor }}>
                Com todo o meu amor, {clientName}
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeUp}>
            <div
              className="w-32 h-px mx-auto"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            <p className="text-white/20 text-sm tracking-widest uppercase">
              LoveGift
            </p>
            <p className="text-white/10 text-xs">
              Feito com amor
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default function ProposalTemplate({ gift }: ProposalTemplateProps) {
  const [daysCount, setDaysCount] = useState(0)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  const photos = JSON.parse(gift.photos) as string[]
  const loveQuotes = JSON.parse(gift.loveQuotes) as string[]
  const storySections = JSON.parse(gift.storySections) as StorySection[]
  const timelineEvents = JSON.parse(gift.timelineEvents) as TimelineEvent[]
  const accentColor = gift.accentColor || '#e11d48'

  useEffect(() => {
    const start = new Date(gift.dayCountStart || gift.specialDate)
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    setDaysCount(diff)
  }, [gift.dayCountStart, gift.specialDate])

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-rose-500/30">
      <motion.div style={{ y: backgroundY }}>
        <HeroSection gift={gift} daysCount={daysCount} />
      </motion.div>

      <MessageSection message={gift.message} accentColor={accentColor} senderName={gift.senderName} />

      <QuotesSection quotes={loveQuotes} accentColor={accentColor} />

      {storySections.length > 0 && (
        <StorySection sections={storySections} accentColor={accentColor} />
      )}

      {timelineEvents.length > 0 && (
        <TimelineSection events={timelineEvents} accentColor={accentColor} />
      )}

      <CounterSection daysCount={daysCount} accentColor={accentColor} />

      <RingMoment accentColor={accentColor} />

      <PhotosSection photos={photos} accentColor={accentColor} />

      <LocationSection
        locationUrl={gift.locationUrl}
        locationName={gift.locationName}
        accentColor={accentColor}
      />

      <FooterSection clientName={gift.clientName} accentColor={accentColor} />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
          background: #e11d48;
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}
