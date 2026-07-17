'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Heart, Edit, ExternalLink, Copy, LogOut,
  Eye, Loader2, Globe, KeyRound, Check, RefreshCw, Sparkles, Shield
} from 'lucide-react'

interface GiftData {
  slug: string
  coupleName: string
  isPublished: boolean
  viewCount: number
  createdAt: string
  templateName: string
}

interface UserData {
  name: string
  isAdmin?: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [gift, setGift] = useState<GiftData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedLink, setCopiedLink] = useState(false)
  const [editorPassword, setEditorPassword] = useState<string | null>(null)
  const [copiedPw, setCopiedPw] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/auth')
      const data = await res.json()
      if (!res.ok || !data.success) { router.push('/login'); return }
      setUser(data.user)
      setGift(data.gift)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
  }

  const copyLink = () => {
    if (!gift) return
    navigator.clipboard.writeText(`${window.location.origin}/gift/${gift.slug}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const regeneratePassword = async () => {
    setRegenerating(true)
    try {
      const res = await fetch('/api/editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'regenerate' })
      })
      const data = await res.json()
      if (data.success) {
        setEditorPassword(data.editorPassword)
        setCopiedPw(false)
      }
    } catch {
      console.error('Erro ao regenerar senha')
    } finally {
      setRegenerating(false)
    }
  }

  const copyPassword = () => {
    if (!editorPassword) return
    navigator.clipboard.writeText(editorPassword)
    setCopiedPw(true)
    setTimeout(() => setCopiedPw(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 size={24} className="text-rose-500/40 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-rose-500" fill="currentColor" />
            <span className="text-base font-bold text-white">LoveGift</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40 hidden sm:inline">{user?.name}</span>
            {user?.isAdmin && (
              <button onClick={() => router.push('/admin/dashboard')} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg text-xs font-medium hover:bg-violet-500/20 transition-colors" title="Painel Admin">
                <Shield size={14} /> Admin
              </button>
            )}
            <button onClick={handleLogout} className="p-2 text-white/30 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-colors" title="Sair">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {gift ? (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">Olá, {user?.name}</h1>
              <p className="text-white/30 text-sm">Gerencie seu presente personalizado</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 sm:p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎁</span>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{gift.coupleName}</h2>
                    <p className="text-xs text-white/30">Criado em {new Date(gift.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ml-3 ${gift.isPublished ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/[0.06] text-white/40 border border-white/[0.08]'}`}>
                  {gift.isPublished ? 'Publicado' : 'Rascunho'}
                </span>
              </div>

              {/* Editor Password Section */}
              <div className="bg-amber-500/[0.06] border border-amber-500/[0.12] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound size={14} className="text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400/80 uppercase tracking-wide">Senha Única do Editor</span>
                </div>
                <p className="text-xs text-amber-400/40 mb-3">
                  Use esta senha para acessar e editar seu presente.
                </p>

                {editorPassword ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg border border-white/[0.08] p-3">
                      <code className="flex-1 text-sm font-mono font-bold text-white break-all">{editorPassword}</code>
                      <button onClick={copyPassword}
                        className="shrink-0 p-1.5 hover:bg-white/[0.06] rounded-md transition-colors">
                        {copiedPw ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white/30" />}
                      </button>
                    </div>
                    <p className="text-xs text-green-400/70">✓ Nova senha gerada! Copie e guarde em local seguro.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-amber-400/50">
                      Se você não anotou a senha no cadastro, gere uma nova abaixo.
                    </p>
                    <button
                      onClick={regeneratePassword}
                      disabled={regenerating}
                      className="w-full py-2.5 bg-white/[0.04] border border-white/[0.08] text-amber-400/80 rounded-lg text-sm font-medium hover:bg-white/[0.06] transition-colors flex items-center justify-center gap-2"
                    >
                      {regenerating ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <RefreshCw size={14} />
                      )}
                      {regenerating ? 'Gerando...' : 'Gerar Nova Senha do Editor'}
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2"><Eye size={14} className="text-white/30" /><span className="text-xs text-white/30">Visualizações</span></div>
                  <span className="text-xl font-bold text-white">{gift.viewCount}</span>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2"><Globe size={14} className="text-white/30" /><span className="text-xs text-white/30">Link</span></div>
                  <span className="text-sm font-medium text-white/70 truncate block">/{gift.slug}</span>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2"><Sparkles size={14} className="text-white/30" /><span className="text-xs text-white/30">Template</span></div>
                  <span className="text-sm font-medium text-white/70">{gift.templateName}</span>
                </div>
              </div>

              {/* Public Link */}
              <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl border border-white/[0.06] p-3 mb-6">
                <Globe size={16} className="text-white/20 shrink-0" />
                <span className="text-sm text-white/30 truncate flex-1">{typeof window !== 'undefined' ? window.location.origin : ''}/gift/{gift.slug}</span>
                <button onClick={copyLink} className="px-3 py-1.5 text-xs font-medium bg-white/[0.06] hover:bg-white/[0.10] text-white/50 rounded-lg transition-colors shrink-0">
                  {copiedLink ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => router.push(`/gift/edit/${gift.slug}/auth`)}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium text-sm hover:from-rose-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20">
                  <Edit size={16} /> Editar Página
                </button>
                <button onClick={() => window.open(`/gift/${gift.slug}`, '_blank')}
                  className="px-5 py-3 border border-white/[0.08] text-white/60 rounded-xl font-medium text-sm hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-2">
                  <ExternalLink size={16} /> Visualizar
                </button>
              </div>
            </motion.div>

            {/* How it works */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-rose-500/[0.04] border border-rose-500/[0.08] rounded-2xl p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-white/60 mb-2">Como funciona?</h3>
              <ul className="text-sm text-white/30 space-y-1.5">
                <li>1. Clique em <strong className="text-white/50">Gerar Nova Senha</strong> (se ainda não tem)</li>
                <li>2. Copie a senha e clique em <strong className="text-white/50">Editar Página</strong></li>
                <li>3. Cole a senha no campo e acesse o editor</li>
                <li>4. Personalize com fotos, história e música</li>
                <li>5. Clique em <strong className="text-white/50">Publicar</strong></li>
              </ul>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-xl font-bold text-white mb-2">Nenhum presente encontrado</h2>
            <p className="text-white/30 text-sm">Adquira uma tag NFC para começar.</p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
