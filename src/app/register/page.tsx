'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff, Loader2, ArrowRight, Copy, Check } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ editorPassword: string; slug: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...form })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao criar conta'); return }
      setSuccess({ editorPassword: data.gift.editorPassword, slug: data.gift.slug })
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const copyPassword = () => {
    if (!success) return
    navigator.clipboard.writeText(success.editorPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-pink-500/6 rounded-full blur-[100px]" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center relative z-10">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-white mb-2">Conta criada!</h1>
          <p className="text-sm text-white/30 mb-8">Guarde sua senha única do editor. Ela é necessária para acessar e editar seu presente.</p>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-6">
            <p className="text-xs text-amber-400/80 mb-3 uppercase tracking-wide font-medium">Senha Única do Editor</p>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <code className="flex-1 text-sm font-mono font-bold text-white text-left break-all">{success.editorPassword}</code>
              <button onClick={copyPassword} className="shrink-0 p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-white/30" />}
              </button>
            </div>
            <p className="text-xs text-amber-400/60 mt-3">⚠️ Anote em um lugar seguro. Você precisará dela para editar.</p>
          </div>

          <button
            onClick={() => {
              if (success) {
                navigator.clipboard.writeText(success.editorPassword)
                router.push(`/gift/edit/${success.slug}/auth`)
              }
            }}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium text-sm hover:from-rose-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
          >
            Copiar senha e ir pro Editor
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-pink-500/6 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <Heart size={28} className="text-rose-500" fill="currentColor" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">LoveGift</span>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white mb-1 text-center">Crie sua conta</h1>
          <p className="text-sm text-white/30 mb-8 text-center">Preencha para começar a personalizar</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wide">Nome</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/30 transition-all"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wide">Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/30 transition-all"
                placeholder="voce@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wide">Senha</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/30 transition-all"
                  placeholder="Mínimo 6 caracteres" minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium text-sm hover:from-rose-600 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 mt-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Criar Conta</span><ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p className="text-sm text-white/20 mt-6 text-center">
          Já tem conta?{' '}
          <button onClick={() => router.push('/login')} className="text-rose-400 font-medium hover:text-rose-300 transition-colors">
            Entrar
          </button>
        </p>
      </motion.div>
    </div>
  )
}
