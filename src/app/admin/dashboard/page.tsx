'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Shield, LogOut, Eye, Gift, Globe, Users, Loader2,
  ExternalLink, Search, ChevronDown, ChevronUp
} from 'lucide-react'

interface GiftData {
  slug: string
  coupleName: string
  clientName: string
  isPublished: boolean
  viewCount: number
  createdAt: string
  templateName: string
  userName: string
  userEmail: string
}

interface Stats {
  totalGifts: number
  publishedGifts: number
  totalViews: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [gifts, setGifts] = useState<GiftData[]>([])
  const [stats, setStats] = useState<Stats>({ totalGifts: 0, publishedGifts: 0, totalViews: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<'createdAt' | 'viewCount'>('createdAt')
  const [sortAsc, setSortAsc] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin')
      const data = await res.json()
      if (!res.ok || !data.success) { router.push('/admin'); return }
      setUserName(data.user.name)
      setGifts(data.gifts)
      setStats(data.stats)
    } catch {
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin', { method: 'DELETE' })
    router.push('/admin')
  }

  const toggleSort = (field: 'createdAt' | 'viewCount') => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const filteredGifts = gifts
    .filter(g =>
      g.coupleName.toLowerCase().includes(search.toLowerCase()) ||
      g.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      g.userName.toLowerCase().includes(search.toLowerCase()) ||
      g.slug.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'viewCount') {
        return sortAsc ? a.viewCount - b.viewCount : b.viewCount - a.viewCount
      }
      return sortAsc
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 size={24} className="text-violet-500/40 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-violet-500" fill="currentColor" />
            <span className="text-base font-bold text-white">LoveGift</span>
            <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40 hidden sm:inline">{userName}</span>
            <button onClick={handleLogout} className="p-2 text-white/30 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-colors" title="Sair">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Painel Administrativo</h1>
          <p className="text-white/30 text-sm">Gerencie todos os presents e acompanhe métricas</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3"><Gift size={16} className="text-violet-400" /><span className="text-xs text-white/40 uppercase tracking-wide font-medium">Total de Gifts</span></div>
            <span className="text-3xl font-bold text-white">{stats.totalGifts}</span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3"><Globe size={16} className="text-green-400" /><span className="text-xs text-white/40 uppercase tracking-wide font-medium">Publicados</span></div>
            <span className="text-3xl font-bold text-white">{stats.publishedGifts}</span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3"><Eye size={16} className="text-amber-400" /><span className="text-xs text-white/40 uppercase tracking-wide font-medium">Total de Views</span></div>
            <span className="text-3xl font-bold text-white">{stats.totalViews}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-white">Todos os Gifts</h2>
            <div className="relative w-full sm:w-auto">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, email ou slug..."
                className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              />
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filteredGifts.map((gift) => (
              <div key={gift.slug} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{gift.coupleName}</h3>
                    <p className="text-xs text-white/30">{gift.userName} · {gift.userEmail}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${gift.isPublished ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/[0.06] text-white/40 border border-white/[0.08]'}`}>
                    {gift.isPublished ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/30">
                  <span className="flex items-center gap-1"><Eye size={12} />{gift.viewCount}</span>
                  <span>{gift.templateName}</span>
                  <span>{new Date(gift.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <a href={`/gift/${gift.slug}`} target="_blank" rel="noopener noreferrer"
                  className="mt-3 w-full py-2 bg-white/[0.04] border border-white/[0.08] text-white/50 rounded-lg text-xs font-medium hover:bg-white/[0.06] transition-colors flex items-center justify-center gap-1.5">
                  <ExternalLink size={12} /> Ver Gift
                </a>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Casal</th>
                    <th className="px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Cliente</th>
                    <th className="px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Template</th>
                    <th className="px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3">
                      <button onClick={() => toggleSort('viewCount')} className="flex items-center gap-1 text-xs font-medium text-white/40 uppercase tracking-wide hover:text-white/60 transition-colors">
                        Views
                        {sortField === 'viewCount' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                      </button>
                    </th>
                    <th className="px-5 py-3">
                      <button onClick={() => toggleSort('createdAt')} className="flex items-center gap-1 text-xs font-medium text-white/40 uppercase tracking-wide hover:text-white/60 transition-colors">
                        Criado
                        {sortField === 'createdAt' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                      </button>
                    </th>
                    <th className="px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGifts.map((gift) => (
                    <tr key={gift.slug} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-white">{gift.coupleName}</div>
                        <div className="text-xs text-white/30">{gift.userEmail}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white/50">{gift.clientName || '-'}</td>
                      <td className="px-5 py-3.5 text-sm text-white/50">{gift.templateName}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${gift.isPublished ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/[0.06] text-white/40 border border-white/[0.08]'}`}>
                          {gift.isPublished ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white/50">{gift.viewCount}</td>
                      <td className="px-5 py-3.5 text-sm text-white/50">{new Date(gift.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="px-5 py-3.5">
                        <a href={`/gift/${gift.slug}`} target="_blank" rel="noopener noreferrer"
                          className="text-violet-400 hover:text-violet-300 transition-colors">
                          <ExternalLink size={16} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredGifts.length === 0 && (
              <div className="py-12 text-center text-white/30 text-sm">Nenhum gift encontrado</div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
