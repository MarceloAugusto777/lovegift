'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Heart, Gift, Sparkles, ArrowRight, Check, Star, Shield, Zap, Globe, Smartphone, ChevronDown } from 'lucide-react'

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const router = useRouter()

  const features = [
    { icon: Heart, title: 'Templates Incríveis', desc: '6 layouts profissionais e responsivos' },
    { icon: Sparkles, title: 'Personalização Total', desc: 'Fotos, história, música e timeline' },
    { icon: Zap, title: 'Fácil de Usar', desc: 'Editor visual, sem complicação' },
    { icon: Globe, title: 'Link Único', desc: 'URL exclusiva para a tag NFC' },
    { icon: Shield, title: 'Seguro', desc: 'Acesso protegido por senha' },
    { icon: Smartphone, title: 'Mobile First', desc: 'Perfeito no celular' },
  ]

  const steps = [
    { num: '01', title: 'Compre a Tag NFC', desc: 'Ursinho, rosa eterna, quadro — qualquer presente' },
    { num: '02', title: 'Crie sua Página', desc: 'Escolha template, adicione fotos e escreva sua história' },
    { num: '03', title: 'Surpreenda', desc: 'Aproxima o celular da tag e a página abre sozinha' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={22} className="text-rose-500" fill="currentColor" />
            <span className="text-lg font-bold text-gray-900">LoveGift</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Funcionalidades</a>
            <a href="#how" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Como Funciona</a>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Preços</a>
          </nav>
            <button
              onClick={() => router.push('/login')}
              className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Começar
            </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium mb-8">
              <Sparkles size={14} />
              Tags NFC + Páginas Personalizadas
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Presentes que<br />
              <span className="text-rose-500">emocionam</span> de verdade
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Crie páginas web interativas para seus presentes. A pessoa aproxima o celular da tag NFC e uma história de amor se revela.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-3.5 bg-rose-500 text-white rounded-full font-semibold text-base hover:bg-rose-600 transition-colors inline-flex items-center gap-2 justify-center"
              >
                Criar Meu Presente
                <ArrowRight size={18} />
              </button>
              <button
                className="px-8 py-3.5 border border-gray-200 text-gray-700 rounded-full font-semibold text-base hover:bg-gray-50 transition-colors"
              >
                Ver Demonstração
              </button>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.4}>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-14 pt-10 border-t border-gray-100">
              {[
                { value: '500+', label: 'Presentes criados' },
                { value: '98%', label: 'Satisfação' },
                { value: '6', label: 'Templates' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Funcionalidades</h2>
              <p className="text-gray-500">Tudo que você precisa em um só lugar</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="p-7 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-gray-100 transition-shadow duration-300 h-full">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                    <f.icon size={20} className="text-rose-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Como Funciona</h2>
              <p className="text-gray-500">3 passos simples</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold mx-auto mb-5">
                    {s.num}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Simples e Acessível</h2>
              <p className="text-gray-500">Comece gratuitamente</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Plano Básico</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-gray-900">R$0</span>
                  <span className="text-gray-400">/mês</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 max-w-sm mx-auto">
                {[
                  '6 templates premium',
                  'Personalização completa',
                  'URL única para tag NFC',
                  'Suporte por email',
                  'Até 10 fotos por presente',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={18} className="text-rose-500 shrink-0" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <button
                  onClick={() => router.push('/login')}
                  className="px-8 py-3.5 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-600 transition-colors"
                >
                  Começar Agora
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-rose-500" fill="currentColor" />
            <span className="font-semibold text-gray-900 text-sm">LoveGift</span>
            <span className="text-xs text-gray-300">© 2026</span>
          </div>
          <div className="flex items-center gap-6">
            {['Termos', 'Privacidade', 'Contato'].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
