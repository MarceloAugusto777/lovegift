"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Music,
  BookOpen,
  ChevronDown,
  Star,
} from "lucide-react"

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
  title?: string
  text?: string
  image?: string
}

interface TimelineEvent {
  date?: string
  title?: string
  description?: string
  icon?: string
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string")
    return []
  } catch {
    return []
  }
}

function parseStorySections(value: string): StorySection[] {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

function parseTimelineEvents(value: string): TimelineEvent[] {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

function AnimatedCounter({ target, color }: { target: number; color: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const step = Math.max(1, Math.ceil(target / (duration / 16)))
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref} style={{ color }} className="text-6xl md:text-8xl font-extralight tabular-nums">
      {count}
    </span>
  )
}

function SectionDivider({ color }: { color: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="flex items-center justify-center gap-4 py-12"
    >
      <div className="h-px w-24" style={{ background: `linear-gradient(to right, transparent, ${color}40)` }} />
      <Heart size={12} style={{ color }} fill={color} />
      <div className="h-px w-24" style={{ background: `linear-gradient(to left, transparent, ${color}40)` }} />
    </motion.div>
  )
}

export default function GenericTemplate({ gift }: TemplateProps) {
  const photos = parseJsonArray(gift.photos)
  const loveQuotes = parseJsonArray(gift.loveQuotes)
  const storySections = parseStorySections(gift.storySections)
  const timelineEvents = parseTimelineEvents(gift.timelineEvents)

  const daysTogether = Math.floor(
    (Date.now() - new Date(gift.dayCountStart).getTime()) / (1000 * 60 * 60 * 24)
  )

  const formattedDate = new Date(gift.specialDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const color = gift.accentColor

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#0a0a0a" }}>
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${color}18 0%, transparent 70%)`,
        }}
      />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6"
      >
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                width: 300 + i * 100,
                height: 300 + i * 100,
                left: `${15 + i * 18}%`,
                top: `${10 + (i % 3) * 25}%`,
              }}
              animate={{
                x: [0, 20, -20, 0],
                y: [0, -15, 15, 0],
                scale: [1, 1.05, 0.95, 1],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Sparkles size={20} style={{ color }} className="mx-auto mb-8 opacity-60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-6 leading-tight"
          >
            {gift.coupleName}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="h-px w-32 mx-auto mb-8"
            style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-lg md:text-xl tracking-widest uppercase opacity-50 text-white"
            style={{ letterSpacing: "0.3em" }}
          >
            {formattedDate}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={24} className="text-white opacity-50" />
          </motion.div>
        </motion.div>
      </motion.section>

      <SectionDivider color={color} />

      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-xs tracking-widest uppercase mb-8 opacity-50 text-center"
              style={{ color, letterSpacing: "0.25em" }}
            >
              Uma mensagem para você
            </p>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl font-extralight leading-relaxed text-center text-white/90"
            style={{ lineHeight: 1.8 }}
          >
            &ldquo;{gift.message}&rdquo;
          </motion.blockquote>
        </div>
      </section>

      {photos.length > 0 && (
        <>
          <SectionDivider color={color} />
          <section className="relative px-6 py-16 md:py-24">
            <div className="max-w-5xl mx-auto">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-xs tracking-widest uppercase mb-12 text-center opacity-50 text-white"
                style={{ letterSpacing: "0.25em" }}
              >
                Momentos
              </motion.p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className={`overflow-hidden rounded-lg ${
                      index === 0 && photos.length > 3 ? "md:col-span-2 md:row-span-2" : ""
                    }`}
                    style={{ aspectRatio: index === 0 && photos.length > 3 ? "16/9" : "1" }}
                  >
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {loveQuotes.length > 0 && (
        <>
          <SectionDivider color={color} />
          <section className="relative px-6 py-16 md:py-24">
            <div className="max-w-2xl mx-auto">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-xs tracking-widest uppercase mb-12 text-center opacity-50 text-white"
                style={{ letterSpacing: "0.25em" }}
              >
                Palavras que ficam
              </motion.p>

              <div className="space-y-8">
                {loveQuotes.map((quote, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="relative pl-8 py-4"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-px"
                      style={{ background: `linear-gradient(to bottom, transparent, ${color}60, transparent)` }}
                    />
                    <Star size={8} style={{ color }} className="absolute left-[-3px] top-4" fill={color} />
                    <p className="text-white/70 text-lg italic font-light leading-relaxed">
                      {quote}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {storySections.length > 0 && (
        <>
          <SectionDivider color={color} />
          <section className="relative px-6 py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-xs tracking-widest uppercase mb-4 text-center opacity-50 text-white"
                style={{ letterSpacing: "0.25em" }}
              >
                <BookOpen size={14} className="inline mr-2 -mt-1" />
                {gift.storyTitle || "Nossa História"}
              </motion.p>

              <div className="space-y-16 mt-12">
                {storySections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    {section.image && (
                      <div className="overflow-hidden rounded-lg mb-6">
                        <motion.img
                          src={section.image}
                          alt={section.title || `Capítulo ${index + 1}`}
                          className="w-full h-64 md:h-80 object-cover"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.6 }}
                          loading="lazy"
                        />
                      </div>
                    )}
                    {section.title && (
                      <h3
                        className="text-lg md:text-xl font-light mb-3"
                        style={{ color }}
                      >
                        {section.title}
                      </h3>
                    )}
                    {section.text && (
                      <p className="text-white/60 leading-relaxed font-light text-base md:text-lg">
                        {section.text}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {timelineEvents.length > 0 && (
        <>
          <SectionDivider color={color} />
          <section className="relative px-6 py-16 md:py-24">
            <div className="max-w-2xl mx-auto">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-xs tracking-widest uppercase mb-12 text-center opacity-50 text-white"
                style={{ letterSpacing: "0.25em" }}
              >
                Marcos
              </motion.p>

              <div className="relative">
                <div
                  className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                  style={{ background: `linear-gradient(to bottom, transparent, ${color}30, transparent)` }}
                />

                <div className="space-y-12">
                  {timelineEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                      className={`relative flex items-start gap-8 ${
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      <div className="hidden md:block md:w-1/2" />

                      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-2 h-2 rounded-full mt-2 z-10" style={{ background: color }} />

                      <div className="pl-12 md:pl-0 md:w-1/2">
                        {event.date && (
                          <p
                            className="text-xs tracking-widest uppercase mb-2 opacity-60"
                            style={{ color }}
                          >
                            {event.date}
                          </p>
                        )}
                        {event.title && (
                          <h4 className="text-white text-base md:text-lg font-light mb-1">
                            {event.title}
                          </h4>
                        )}
                        {event.description && (
                          <p className="text-white/50 text-sm font-light leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <SectionDivider color={color} />

      <section className="relative px-6 py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-widest uppercase mb-12 opacity-50 text-white"
            style={{ letterSpacing: "0.25em" }}
          >
            Tempo ao seu lado
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1 }}
          >
            <AnimatedCounter target={daysTogether} color={color} />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/40 text-sm tracking-widest uppercase mt-4"
              style={{ letterSpacing: "0.2em" }}
            >
              dias
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-6 text-sm text-white/30"
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color }} className="opacity-60" />
              <span>{formattedDate}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color }} className="opacity-60" />
              <span>{daysTogether} dias</span>
            </div>
          </motion.div>
        </div>
      </section>

      {gift.locationUrl && (
        <>
          <SectionDivider color={color} />
          <section className="relative px-6 py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-xs tracking-widest uppercase mb-8 text-center opacity-50 text-white"
                style={{ letterSpacing: "0.25em" }}
              >
                <MapPin size={14} className="inline mr-2 -mt-1" />
                {gift.locationName || "Local"}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="overflow-hidden rounded-lg"
              >
                <iframe
                  src={gift.locationUrl}
                  width="100%"
                  height="350"
                  style={{ border: 0, filter: "grayscale(0.6) contrast(1.1)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </div>
          </section>
        </>
      )}

      {gift.musicUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="px-6 py-8"
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 text-white/30 text-sm">
              <Music size={14} style={{ color }} className="opacity-60" />
              <span>Ouvir música</span>
            </div>
            <div className="mt-4 rounded-lg overflow-hidden opacity-80">
              <iframe
                src={gift.musicUrl}
                width="100%"
                height="80"
                style={{ border: 0 }}
                allow="autoplay; encrypted-media"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      )}

      <footer className="relative px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="h-px w-16 mx-auto mb-8"
            style={{ background: `linear-gradient(to right, transparent, ${color}40, transparent)` }}
          />

          <Heart size={16} style={{ color }} className="mx-auto mb-6 opacity-40" fill={color} />

          {gift.clientName && (
            <p className="text-white/30 text-sm tracking-widest uppercase" style={{ letterSpacing: "0.2em" }}>
              Com amor, {gift.clientName}
            </p>
          )}

          {!gift.clientName && (
            <p className="text-white/20 text-xs tracking-widest uppercase" style={{ letterSpacing: "0.2em" }}>
              Feito com amor
            </p>
          )}
        </motion.div>
      </footer>
    </div>
  )
}
