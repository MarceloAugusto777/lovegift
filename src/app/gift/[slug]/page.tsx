'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle } from 'lucide-react'
import { templates, type TemplateId } from '@/components/templates'
import MusicPlayer from '@/components/music-player'
import IntroRouter from '@/components/intros'
import ExperiencesHub from '@/components/experiences/experiences-hub'

interface GiftData {
  coupleName: string
  specialDate: string
  message: string
  photos: string
  loveQuotes: string
  dayCountStart: string
  locationUrl: string
  locationName: string
  musicUrl: string
  accentColor: string
  fontFamily: string
  dayCountMessage?: string
  quiz: string
  quizEnabled: boolean
  quizFinalMessage: string
  surpriseEnabled: boolean
  surpriseQuestion: string
  surpriseAnswer: string
  surpriseType: string
  surpriseTitle: string
  surpriseText: string
  surprisePhoto: string
  welcomeEnabled: boolean
  welcomeMessage: string
  introStyle?: string
  miniGameEnabled: boolean
  miniGameDuration: number
  miniGameTarget: number
  miniGameMessage: string
  polaroidEnabled: boolean
  polaroidTitle: string
  polaroidMessage: string
  constellationEnabled: boolean
  constellationTitle: string
  constellationMessage: string
  templateId: string
  senderName?: string
  clientName?: string
  storyTitle?: string
  storySections: string
  timelineEvents: string
  template?: {
    slug: string
    name: string
  }
}

export default function GiftPage() {
  const params = useParams()
  const slug = params.slug as string

  const [gift, setGift] = useState<GiftData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [introDone, setIntroDone] = useState(false)

  const loadGift = useCallback(async () => {
    try {
      const response = await fetch(`/api/gifts?slug=${slug}`)
      const data = await response.json()

      if (data.success && data.gift) {
        const giftData = data.gift
        setGift({
          ...giftData,
          specialDate: giftData.specialDate || '',
          dayCountStart: giftData.dayCountStart || '',
          template: giftData.template
        })
      } else {
        setError('Presente não encontrado')
      }
    } catch {
      setError('Erro ao carregar presente')
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadGift()
  }, [loadGift])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-rose-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando presente...</p>
        </div>
      </div>
    )
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
        >
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ops!</h1>
          <p className="text-gray-600">{error || 'Presente não encontrado'}</p>
        </motion.div>
      </div>
    )
  }

  const TemplateComponent = templates[gift.template?.slug as TemplateId]?.component

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Template não encontrado</h1>
          <p className="text-gray-600">Este template não está disponível</p>
        </div>
      </div>
    )
  }

  return (
    <main>
      {gift.musicUrl && (
        <MusicPlayer musicUrl={gift.musicUrl} accentColor={gift.accentColor} />
      )}

      <AnimatePresence>
        {gift.welcomeEnabled && !introDone && (
          <IntroRouter
            style={gift.introStyle || 'envelope'}
            senderName={gift.senderName}
            welcomeMessage={gift.welcomeMessage}
            coupleName={gift.coupleName}
            accentColor={gift.accentColor}
            fontFamily={gift.fontFamily}
            onOpen={() => setIntroDone(true)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: gift.welcomeEnabled ? 0.5 : 0 }}
      >
        <TemplateComponent gift={gift} />
        <ExperiencesHub
          gift={{
            coupleName: gift.coupleName,
            accentColor: gift.accentColor,
            fontFamily: gift.fontFamily,
            photos: gift.photos,
            storySections: gift.storySections,
            timelineEvents: gift.timelineEvents,
            miniGameEnabled: !!gift.miniGameEnabled,
            miniGameDuration: gift.miniGameDuration || 20,
            miniGameTarget: gift.miniGameTarget || 12,
            miniGameMessage: gift.miniGameMessage || '',
            polaroidEnabled: !!gift.polaroidEnabled,
            polaroidTitle: gift.polaroidTitle || '',
            polaroidMessage: gift.polaroidMessage || '',
            constellationEnabled: !!gift.constellationEnabled,
            constellationTitle: gift.constellationTitle || '',
            constellationMessage: gift.constellationMessage || '',
          }}
        />
      </motion.div>
    </main>
  )
}
