'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Heart, Calendar, MapPin, Music, Clock, Sparkles, ChevronDown, BookOpen, Film } from 'lucide-react'

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
  content: string
  image?: string
}

interface TimelineEvent {
  date: string
  title: string
  description: string
  image?: string
}

function parseJsonSafe<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T
  } catch {
    return fallback
  }
}

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  return { ref, isInView }
}

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 4 + Math.random() * 8,
        duration: 12 + Math.random() * 10,
        delay: Math.random() * 8,
        opacity: 0.08 + Math.random() * 0.12,
      })),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, #9333ea33, #9333ea00)',
          }}
          animate={{
            y: ['110vh', '-10vh'],
            x: [0, Math.sin(p.id) * 40],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 6,
            repeat: Infinity,
          }}
        >
          <Sparkles size={8 + Math.random() * 10} className="text-purple-300" />
        </motion.div>
      ))}
    </div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, #9333ea, #c084fc, #9333ea)',
      }}
    />
  )
}

function OrnamentDivider({ inverted }: { inverted?: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-4 my-12 ${inverted ? 'rotate-180' : ''}`}>
      <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-300" />
      <Heart size={14} className="text-purple-400 fill-purple-200" />
      <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-300" />
    </div>
  )
}

function HeroSection({ coupleName, specialDate, dayCountStart }: { coupleName: string; specialDate: string; dayCountStart: string }) {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 600], [1, 0])
  const scale = useTransform(scrollY, [0, 600], [1, 1.1])
  const y = useTransform(scrollY, [0, 600], [0, 80])

  const daysTogether = Math.floor(
    (Date.now() - new Date(dayCountStart).getTime()) / (1000 * 60 * 60 * 24)
  )

  const formattedDate = useMemo(() => {
    try {
      return new Date(specialDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return specialDate
    }
  }, [specialDate])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale, opacity }}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/80 via-white to-purple-50/60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-purple-100/40 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-50/50 blur-[80px]" />
      </motion.div>

      <motion.div className="relative z-10 text-center px-6" style={{ y }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        >
          <div className="mb-8">
            <motion.div
              className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-purple-300 to-transparent mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
            <p className="text-purple-400 tracking-[0.4em] uppercase text-sm font-light mb-4">
              A Love Story
            </p>
          </div>

          <h1
            className="text-5xl md:text-8xl lg:text-9xl font-extralight tracking-tight text-gray-800 mb-2 leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {coupleName}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-300" />
              <Heart size={12} className="text-purple-400 fill-purple-200" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-300" />
            </div>
            <p className="text-purple-500 tracking-[0.3em] uppercase text-xs font-light">
              {formattedDate}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-200/60 bg-white/50 backdrop-blur-sm"
          >
            <Clock size={14} className="text-purple-400" />
            <span className="text-sm text-purple-600 font-light tracking-wide">
              {daysTogether} days together
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} className="text-purple-300" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function MessageSection({ message }: { message: string }) {
  const { ref, isInView } = useScrollReveal()

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        >
          <BookOpen size={32} className="text-purple-300 mx-auto mb-6" />
          <p className="text-purple-400 tracking-[0.3em] uppercase text-xs mb-8 font-light">
            A Letter To You
          </p>

          <div className="relative">
            <div className="absolute -top-6 -left-4 text-6xl text-purple-200/60 font-serif leading-none select-none">
              &ldquo;
            </div>
            <p
              className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light italic relative z-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {message}
            </p>
            <div className="absolute -bottom-6 -right-4 text-6xl text-purple-200/60 font-serif leading-none select-none rotate-180">
              &ldquo;
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PhotoGallery({ photos }: { photos: string[] }) {
  const { ref, isInView } = useScrollReveal(0.1)

  if (photos.length === 0) return null

  const layouts = [
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-2 row-span-1',
    'col-span-1 row-span-1',
  ]

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Film size={28} className="text-purple-300 mx-auto mb-4" />
          <p className="text-purple-400 tracking-[0.3em] uppercase text-xs font-light">
            Our Moments
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              className={`overflow-hidden rounded-lg shadow-lg ${layouts[index % layouts.length]} cursor-pointer group relative`}
            >
              <img
                src={photo}
                alt={`Moment ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LoveQuotes({ quotes }: { quotes: string[] }) {
  const { ref, isInView } = useScrollReveal(0.15)

  if (quotes.length === 0) return null

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Heart size={28} className="text-purple-300 mx-auto mb-4 fill-purple-100" />
          <p className="text-purple-400 tracking-[0.3em] uppercase text-xs font-light">
            Words Of Love
          </p>
        </motion.div>

        <div className="space-y-8">
          {quotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <div className="relative max-w-md px-8 py-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-100/60 shadow-sm">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-200/50 rounded-tl-2xl -translate-x-2 -translate-y-2" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-200/50 rounded-br-2xl translate-x-2 translate-y-2" />
                <p className="text-gray-600 italic font-light leading-relaxed text-lg">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StoryTimeline({ sections, title }: { sections: StorySection[]; title?: string }) {
  const { ref, isInView } = useScrollReveal(0.1)

  if (sections.length === 0) return null

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <BookOpen size={28} className="text-purple-300 mx-auto mb-4" />
          <p className="text-purple-400 tracking-[0.3em] uppercase text-xs font-light mb-3">
            {title || 'Our Story'}
          </p>
          <h2
            className="text-3xl md:text-4xl font-extralight text-gray-700"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {title || 'The Story of Us'}
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-200 via-purple-300 to-purple-200 md:-translate-x-px" />

          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className={`relative flex items-start gap-8 mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-purple-400 border-4 border-white shadow-md -translate-x-1.5 mt-2 z-10" />

              <div className={`flex-1 pl-14 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50 shadow-sm inline-block text-left md:max-w-md">
                  {section.image && (
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3
                    className="text-lg text-gray-800 font-medium mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {section.title}
                  </h3>
                  <p className="text-gray-500 font-light leading-relaxed text-sm">
                    {section.content}
                  </p>
                </div>
              </div>

              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EventsTimeline({ events }: { events: TimelineEvent[] }) {
  const { ref, isInView } = useScrollReveal(0.1)

  if (events.length === 0) return null

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-b from-purple-50/30 to-transparent">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <Calendar size={28} className="text-purple-300 mx-auto mb-4" />
          <p className="text-purple-400 tracking-[0.3em] uppercase text-xs font-light">
            Milestones
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -4 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50 shadow-sm group"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-36 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                <div>
                  {event.date && (
                    <p className="text-purple-400 text-xs tracking-wider uppercase mb-1">
                      {event.date}
                    </p>
                  )}
                  <h3
                    className="text-gray-800 font-medium mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DayCounter({ dayCountStart }: { dayCountStart: string }) {
  const { ref, isInView } = useScrollReveal(0.2)
  const [days, setDays] = useState(0)

  useEffect(() => {
    const calculate = () =>
      Math.floor((Date.now() - new Date(dayCountStart).getTime()) / (1000 * 60 * 60 * 24))
    setDays(calculate())
    const interval = setInterval(() => setDays(calculate()), 60000)
    return () => clearInterval(interval)
  }, [dayCountStart])

  const digits = String(days).split('')

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Clock size={28} className="text-purple-300 mx-auto mb-4" />
          <p className="text-purple-400 tracking-[0.3em] uppercase text-xs font-light mb-8">
            Days Of Love
          </p>

          <div className="flex items-center justify-center gap-2 md:gap-3">
            {digits.map((digit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="w-14 h-20 md:w-20 md:h-28 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl border border-purple-100/60 shadow-sm"
              >
                <span
                  className="text-4xl md:text-5xl font-extralight text-gray-700"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {digit}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            className="text-gray-400 text-sm mt-6 tracking-wider font-light"
          >
            days since the beginning of forever
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

function LocationSection({ url, name }: { url?: string; name?: string }) {
  const { ref, isInView } = useScrollReveal(0.15)
  if (!url) return null

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <MapPin size={28} className="text-purple-300 mx-auto mb-4" />
          <p className="text-purple-400 tracking-[0.3em] uppercase text-xs font-light">
            {name || 'Our Special Place'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl overflow-hidden border border-purple-100/50 shadow-lg h-72 md:h-96"
        >
          <iframe
            src={url}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  )
}

function MusicPlayer({ musicUrl }: { musicUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  if (!musicUrl) return null

  return (
    <motion.button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border border-purple-200/60 shadow-lg flex items-center justify-center text-purple-500 hover:bg-white transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isOpen ? { rotate: 0 } : {}}
    >
      <Music size={20} />
    </motion.button>
  )
}

function Footer({ clientName }: { clientName?: string }) {
  const { ref, isInView } = useScrollReveal(0.2)

  return (
    <section ref={ref} className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-purple-300 to-transparent mx-auto mb-8" />

        <Heart size={24} className="text-purple-300 mx-auto mb-6 fill-purple-100" />

        <p
          className="text-2xl md:text-3xl font-extralight text-gray-700 mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          With all my love
        </p>

        {clientName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-purple-500 tracking-[0.3em] uppercase text-sm font-light mt-6"
          >
            Com amor, {clientName}
          </motion.p>
        )}

        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-purple-200" />
          <Sparkles size={12} className="text-purple-300" />
          <div className="h-px w-12 bg-purple-200" />
        </div>
      </motion.div>
    </section>
  )
}

export default function WeddingTemplate({ gift }: TemplateProps) {
  const photos = useMemo(() => parseJsonSafe<string[]>(gift.photos, []), [gift.photos])
  const loveQuotes = useMemo(() => parseJsonSafe<string[]>(gift.loveQuotes, []), [gift.loveQuotes])
  const storySections = useMemo(() => parseJsonSafe<StorySection[]>(gift.storySections, []), [gift.storySections])
  const timelineEvents = useMemo(() => parseJsonSafe<TimelineEvent[]>(gift.timelineEvents, []), [gift.timelineEvents])

  const accentColor = gift.accentColor || '#9333ea'

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-purple-50/30 via-white to-purple-50/20 overflow-x-hidden"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      <Particles />
      <ScrollProgress />

      <HeroSection
        coupleName={gift.coupleName}
        specialDate={gift.specialDate}
        dayCountStart={gift.dayCountStart}
      />

      <OrnamentDivider />

      <MessageSection message={gift.message} />

      <OrnamentDivider />

      <PhotoGallery photos={photos} />

      <OrnamentDivider inverted />

      <LoveQuotes quotes={loveQuotes} />

      <OrnamentDivider />

      <StoryTimeline sections={storySections} title={gift.storyTitle} />

      <OrnamentDivider inverted />

      <EventsTimeline events={timelineEvents} />

      <OrnamentDivider />

      <DayCounter dayCountStart={gift.dayCountStart} />

      <LocationSection url={gift.locationUrl} name={gift.locationName} />

      <Footer clientName={gift.clientName} />

      <MusicPlayer musicUrl={gift.musicUrl} />
    </div>
  )
}
