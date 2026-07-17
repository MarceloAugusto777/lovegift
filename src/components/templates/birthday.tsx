"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  }
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

interface BirthdayTemplateProps {
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

function ConfettiBackground() {
  const colors = ['#eab308', '#f59e0b', '#fbbf24', '#fcd34d', '#fef08a', '#ffffff']

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {Array.from({ length: 40 }, (_, i) => {
        const size = 4 + Math.random() * 8
        const isCircle = Math.random() > 0.5
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-3%',
              width: size,
              height: isCircle ? size : size * 2,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              borderRadius: isCircle ? '50%' : '2px',
              opacity: 0.6 + Math.random() * 0.4,
            }}
            animate={{
              y: [0, (typeof window !== 'undefined' ? window.innerHeight : 900) + 100],
              x: [0, (Math.random() - 0.5) * 300],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
              opacity: [0.8, 0.8, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              delay: Math.random() * 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )
      })}
    </div>
  )
}

function HeroSection({ gift, daysCount }: { gift: BirthdayTemplateProps['gift']; daysCount: number }) {
  const photos = JSON.parse(gift.photos) as string[]
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    if (photos.length <= 1) return
    const timer = setInterval(() => {
      setHeroIdx((p) => (p + 1) % photos.length)
    }, 6000)
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
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <img
                src={photos[heroIdx]}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-yellow-950 via-amber-950 to-yellow-950" />
        )}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(234, 179, 8, ${Math.random() * 0.4 + 0.1})`,
            }}
            animate={{
              y: [0, -60 - Math.random() * 40],
              x: [0, (Math.random() - 0.5) * 40],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeUp}>
            <motion.div
              className="w-px h-16 bg-gradient-to-b from-transparent via-yellow-400 to-transparent mx-auto mb-8"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-2">
            <motion.span
              className="text-4xl md:text-5xl"
              animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🎂
            </motion.span>
            <motion.span
              className="text-4xl md:text-5xl"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
            >
              🎉
            </motion.span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight"
            style={{ textShadow: '0 0 60px rgba(234, 179, 8, 0.3)' }}
          >
            {gift.coupleName.split('&').map((name, i) => (
              <span key={i}>
                {i === 1 && (
                  <motion.span
                    className="block text-3xl md:text-4xl lg:text-5xl text-yellow-300 my-2 font-light italic"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    &
                  </motion.span>
                )}
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i === 0 ? 0.3 : 0.8, duration: 0.8 }}
                >
                  {name.trim()}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-2xl md:text-4xl text-yellow-300 tracking-wide"
          >
            Feliz Aniversário
          </motion.h2>

          {gift.storyTitle && (
            <motion.p
              variants={fadeUp}
              className="font-serif text-xl md:text-2xl text-yellow-200/80 italic tracking-wide"
            >
              {gift.storyTitle}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 text-yellow-300/70">
            <div className="h-px w-12 bg-yellow-400/40" />
            <span className="text-sm tracking-[0.3em] uppercase font-light">
              {new Date(gift.specialDate).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <div className="h-px w-12 bg-yellow-400/40" />
          </motion.div>

          <motion.div variants={fadeUp} className="pt-8">
            <motion.div
              className="inline-block"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-yellow-300 text-sm tracking-widest mb-2">CELEBRANDO NOSSA HISTÓRIA</div>
              <svg className="w-6 h-6 mx-auto text-yellow-300/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function MessageSection({ message, accentColor }: { message: string; accentColor: string }) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-950 via-amber-950/50 to-yellow-950" />
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${accentColor}22, transparent 50%),
                              radial-gradient(circle at 80% 50%, ${accentColor}22, transparent 50%)`,
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
            <h2 className="font-serif text-3xl md:text-4xl text-white/90 italic mb-2">
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
            <h2 className="font-serif text-3xl md:text-4xl text-white/90 italic">
              &rdquo;
            </h2>
            <div
              className="w-16 h-px mx-auto mt-8"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function StorySection({ sections, accentColor }: { sections: StorySection[]; accentColor: string }) {
  if (sections.length === 0) return null

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-950 to-black/90" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="space-y-24"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-white/90">
              Nossa História
            </h2>
            <div
              className="w-20 h-px mx-auto mt-4"
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
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
            >
              {section.photo && (
                <motion.div
                  className="w-full md:w-1/2"
                  variants={scaleIn}
                >
                  <div className="relative group">
                    <div
                      className="absolute -inset-3 rounded-2xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500"
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
                <div className="space-y-4">
                  <h3
                    className="font-serif text-2xl md:text-3xl"
                    style={{ color: accentColor }}
                  >
                    {section.title}
                  </h3>
                  <div className="w-12 h-0.5 bg-white/20" />
                  <p className="font-serif text-lg text-white/70 leading-relaxed">
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

function PhotosSection({ photos, accentColor }: { photos: string[]; accentColor: string }) {
  if (photos.length === 0) return null

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-950/50 to-black/90" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-white/90">
              Nossos Momentos
            </h2>
            <div
              className="w-20 h-px mx-auto mt-4"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                className="break-inside-avoid"
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative group overflow-hidden rounded-xl">
                  <div
                    className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"
                    style={{ background: accentColor }}
                  />
                  <img
                    src={photo}
                    alt={`Momento ${i + 1}`}
                    className="relative w-full object-cover rounded-xl shadow-lg transition-transform duration-700 group-hover:scale-105"
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

function LoveQuotesSection({ quotes, accentColor }: { quotes: string[]; accentColor: string }) {
  if (quotes.length === 0) return null

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-yellow-950/20 to-black/90" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="space-y-16"
        >
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-white/90">
              Palavras do Coração
            </h2>
            <div
              className="w-20 h-px mx-auto mt-4"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="text-center"
            >
              <motion.div
                className="inline-block mb-4 text-3xl"
                style={{ color: accentColor }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              >
                &ldquo;
              </motion.div>
              <p className="font-serif text-lg md:text-xl text-white/60 italic leading-relaxed max-w-2xl mx-auto">
                {quote}
              </p>
              <motion.div
                className="inline-block mt-4 text-3xl"
                style={{ color: accentColor }}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 + 2 }}
              >
                &rdquo;
              </motion.div>
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
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-yellow-950/20 to-black/90" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="space-y-16"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-white/90">
              Marcos do Nosso Amor
            </h2>
            <div
              className="w-20 h-px mx-auto mt-4"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          <div className="relative">
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-px h-full hidden md:block"
              style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}66, transparent)` }}
            />

            <div className="space-y-12 md:space-y-0">
              {events.map((event, i) => (
                <motion.div
                  key={i}
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className={`relative flex items-center md:even:flex-row-reverse ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  <div className="hidden md:block w-1/2" />

                  <motion.div
                    className="relative z-10 w-4 h-4 rounded-full border-2 md:mx-0 mx-auto mb-4 md:mb-0"
                    style={{ borderColor: accentColor, background: `${accentColor}33` }}
                    whileInView={{ scale: [0, 1.3, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />

                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                    <motion.div
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-300"
                      whileHover={{ y: -4 }}
                    >
                      {event.photo && (
                        <img
                          src={event.photo}
                          alt={event.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div
                        className="text-sm font-mono tracking-wider mb-2"
                        style={{ color: accentColor }}
                      >
                        {new Date(event.date).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="font-serif text-xl text-white mb-2">{event.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{event.description}</p>
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
          const duration = 2000
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
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [daysCount])

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-yellow-950/50" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center space-y-8"
        >
          <motion.div variants={fadeUp}>
            <div className="text-7xl md:text-9xl font-bold font-mono tabular-nums" style={{ color: accentColor }}>
              {count}
            </div>
            <div className="text-white/50 text-lg tracking-[0.3em] uppercase mt-4">
              Dias Juntos
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div
              className="w-32 h-px mx-auto"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          <motion.p variants={fadeUp} className="font-serif text-xl text-white/60 italic max-w-xl mx-auto">
            Cada dia ao seu lado é uma bênção que agradeço ao universo
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

function LocationSection({ locationUrl, locationName, accentColor }: { locationUrl?: string; locationName?: string; accentColor: string }) {
  if (!locationUrl && !locationName) return null

  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-yellow-950/30" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center space-y-8"
        >
          <motion.div variants={fadeUp} className="text-5xl">📍</motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl text-white/90">
              Nosso Lugar Especial
            </h2>
            <div
              className="w-20 h-px mx-auto"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          {locationName && (
            <motion.p variants={fadeUp} className="font-serif text-xl text-white/70 italic">
              {locationName}
            </motion.p>
          )}

          {locationUrl && (
            <motion.a
              variants={fadeUp}
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 font-serif text-lg transition-all duration-300 hover:scale-105"
              style={{
                borderColor: accentColor,
                color: accentColor,
              }}
              whileHover={{ boxShadow: `0 0 30px ${accentColor}44` }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Ver no Mapa
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function FooterSection({ clientName, accentColor }: { clientName?: string; accentColor: string }) {
  return (
    <footer className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-950/30 to-yellow-950" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center space-y-8"
        >
          <motion.div variants={fadeUp}>
            <motion.div
              className="text-6xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🎂
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            <p className="font-serif text-xl text-white/70 italic">
              Feito com todo carinho para você
            </p>
            {clientName && (
              <p className="font-serif text-lg" style={{ color: accentColor }}>
                Com amor, {clientName}
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeUp}>
            <div
              className="w-32 h-px mx-auto"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2">
            <p className="text-white/30 text-sm tracking-widest uppercase">
              LoveGift
            </p>
            <p className="text-white/20 text-xs">
              Cada momento merece ser celebrado
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default function BirthdayTemplate({ gift }: BirthdayTemplateProps) {
  const [daysCount, setDaysCount] = useState(0)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const photos = JSON.parse(gift.photos) as string[]
  const loveQuotes = JSON.parse(gift.loveQuotes) as string[]
  const storySections = JSON.parse(gift.storySections) as StorySection[]
  const timelineEvents = JSON.parse(gift.timelineEvents) as TimelineEvent[]
  const accentColor = gift.accentColor || '#eab308'

  useEffect(() => {
    const start = new Date(gift.dayCountStart || gift.specialDate)
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    setDaysCount(diff)
  }, [gift.dayCountStart, gift.specialDate])

  return (
    <div className="min-h-screen bg-black text-white">
      <ConfettiBackground />

      <motion.div style={{ y: backgroundY }}>
        <HeroSection gift={gift} daysCount={daysCount} />
      </motion.div>

      <MessageSection message={gift.message} accentColor={accentColor} />

      {photos.length > 0 && (
        <PhotosSection photos={photos} accentColor={accentColor} />
      )}

      {loveQuotes.length > 0 && (
        <LoveQuotesSection quotes={loveQuotes} accentColor={accentColor} />
      )}

      {storySections.length > 0 && (
        <StorySection sections={storySections} accentColor={accentColor} />
      )}

      <CounterSection daysCount={daysCount} accentColor={accentColor} />

      {timelineEvents.length > 0 && (
        <TimelineSection events={timelineEvents} accentColor={accentColor} />
      )}

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
      `}</style>
    </div>
  )
}
