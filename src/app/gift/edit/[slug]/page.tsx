"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Lock,
  ImageIcon,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Palette,
  Layout,
  Calendar,
  MessageCircle,
  Clock,
  Quote,
  Sparkles,
  Upload,
  X,
  FileText,
  MapPin,
  Music,
  PenLine,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

interface StorySection {
  title: string
  text: string
  photo: string
}

interface TimelineEvent {
  date: string
  title: string
  description: string
  photo: string
}

interface GiftData {
  id: string
  slug: string
  coupleName: string
  specialDate: string
  message: string
  photos: string[]
  loveQuotes: string[]
  dayCountStart: string
  locationUrl: string
  locationName: string
  musicUrl: string
  accentColor: string
  fontFamily: string
  templateId: string
  isPublished: boolean
  senderName: string
  clientName: string
  storyTitle: string
  storySections: StorySection[]
  timelineEvents: TimelineEvent[]
}

type TabId = "info" | "fotos" | "historia" | "timeline" | "citacoes" | "estilo" | "preview"

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "info", label: "Info", icon: <Type size={18} /> },
  { id: "fotos", label: "Fotos", icon: <ImageIcon size={18} /> },
  { id: "historia", label: "Historia", icon: <BookOpen size={18} /> },
  { id: "timeline", label: "Timeline", icon: <Clock size={18} /> },
  { id: "citacoes", label: "Citacoes", icon: <Quote size={18} /> },
  { id: "estilo", label: "Estilo", icon: <Palette size={18} /> },
  { id: "preview", label: "Preview", icon: <Eye size={18} /> },
]

function BookOpen({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

const fontOptions = [
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond" },
  { value: "Great Vibes", label: "Great Vibes" },
  { value: "Dancing Script", label: "Dancing Script" },
  { value: "Lora", label: "Lora" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Poppins", label: "Poppins" },
  { value: "Inter", label: "Inter" },
]

const templateOptions = [
  { value: "romantic", label: "Romantico" },
  { value: "minimal", label: "Minimalista" },
  { value: "classic", label: "Classico" },
  { value: "modern", label: "Moderno" },
]

export default function GiftEditPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  const [gift, setGift] = useState<GiftData | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>("info")
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [coupleName, setCoupleName] = useState("")
  const [specialDate, setSpecialDate] = useState("")
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [clientName, setClientName] = useState("")
  const [storyTitle, setStoryTitle] = useState("")
  const [locationName, setLocationName] = useState("")
  const [locationUrl, setLocationUrl] = useState("")
  const [musicUrl, setMusicUrl] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [loveQuotes, setLoveQuotes] = useState<string[]>([])
  const [storySections, setStorySections] = useState<StorySection[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [accentColor, setAccentColor] = useState("#e11d48")
  const [fontFamily, setFontFamily] = useState("Playfair Display")
  const [templateId, setTemplateId] = useState("romantic")
  const [dayCountStart, setDayCountStart] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/editor')
        const data = await res.json()
        if (!res.ok || !data.success || data.gift?.slug !== slug) {
          router.push(`/gift/edit/${slug}/auth`)
          return
        }
        setIsAuthenticated(true)
      } catch {
        router.push(`/gift/edit/${slug}/auth`)
      } finally {
        setAuthLoading(false)
      }
    }
    checkAuth()
  }, [slug, router])

  useEffect(() => {
    if (isAuthenticated) {
      const hasSeenWelcome = localStorage.getItem(`welcome-${slug}`)
      if (!hasSeenWelcome) {
        setShowWelcome(true)
      }
      loadGift()
    }
  }, [isAuthenticated, slug])

  const loadGift = async () => {
    try {
      const res = await fetch(`/api/gifts?slug=${slug}`)
      const data = await res.json()
      if (!res.ok || !data.gift) {
        return
      }
      const g = data.gift
      setGift(g)
      setCoupleName(g.coupleName || "")
      setSpecialDate(g.specialDate || "")
      setMessage(g.message || "")
      setSenderName(g.senderName || "")
      setClientName(g.clientName || "")
      setStoryTitle(g.storyTitle || "")
      setLocationName(g.locationName || "")
      setLocationUrl(g.locationUrl || "")
      setMusicUrl(g.musicUrl || "")
      setAccentColor(g.accentColor || "#e11d48")
      setFontFamily(g.fontFamily || "Playfair Display")
      setTemplateId(g.templateId || "romantic")
      setDayCountStart(g.dayCountStart || g.specialDate || "")

      try {
        setPhotos(typeof g.photos === "string" ? JSON.parse(g.photos) : g.photos || [])
      } catch { setPhotos([]) }
      try {
        setLoveQuotes(typeof g.loveQuotes === "string" ? JSON.parse(g.loveQuotes) : g.loveQuotes || [])
      } catch { setLoveQuotes([]) }
      try {
        setStorySections(typeof g.storySections === "string" ? JSON.parse(g.storySections) : g.storySections || [])
      } catch { setStorySections([]) }
      try {
        setTimelineEvents(typeof g.timelineEvents === "string" ? JSON.parse(g.timelineEvents) : g.timelineEvents || [])
      } catch { setTimelineEvents([]) }
    } catch {
      console.error("Erro ao carregar gift")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        coupleName,
        specialDate,
        message,
        senderName,
        clientName,
        storyTitle,
        locationName,
        locationUrl,
        musicUrl,
        photos,
        loveQuotes,
        storySections,
        timelineEvents,
        accentColor,
        fontFamily,
        templateId,
        dayCountStart,
      }
      const res = await fetch(`/api/gifts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      setHasChanges(false)
    } catch {
      alert("Erro ao salvar. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await handleSave()
      const res = await fetch(`/api/gifts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: true }),
      })
      if (!res.ok) throw new Error("Erro ao publicar")
      setGift((prev) => prev ? { ...prev, isPublished: true } : prev)
    } catch {
      alert("Erro ao publicar.")
    } finally {
      setPublishing(false)
    }
  }

  const markChanged = () => setHasChanges(true)

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.success && data.url) return data.url
    } catch {}
    return null
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #e11d48",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }} />
          <p style={{ color: "#999", fontSize: "14px" }}>Verificando acesso...</p>
        </div>
      </div>
    )
  }

  const addPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const url = await uploadPhoto(files[i])
      if (url) {
        setPhotos((prev) => [...prev, url])
        markChanged()
      }
    }
    e.target.value = ""
  }

  const removePhoto = (index: number) => {
    if (!confirm("Tem certeza que deseja remover esta foto?")) return
    setPhotos((prev) => prev.filter((_, i) => i !== index))
    markChanged()
  }

  const addStorySection = () => {
    setStorySections((prev) => [...prev, { title: "", text: "", photo: "" }])
    markChanged()
  }

  const updateStorySection = (index: number, field: keyof StorySection, value: string) => {
    setStorySections((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
    markChanged()
  }

  const removeStorySection = (index: number) => {
    if (!confirm("Tem certeza que deseja remover esta seção?")) return
    setStorySections((prev) => prev.filter((_, i) => i !== index))
    markChanged()
  }

  const moveStorySection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= storySections.length) return
    setStorySections((prev) => {
      const arr = [...prev]
      const temp = arr[index]
      arr[index] = arr[newIndex]
      arr[newIndex] = temp
      return arr
    })
    markChanged()
  }

  const uploadStoryPhoto = async (index: number, file: File) => {
    const url = await uploadPhoto(file)
    if (url) {
      updateStorySection(index, "photo", url)
    }
  }

  const addTimelineEvent = () => {
    setTimelineEvents((prev) => [...prev, { date: "", title: "", description: "", photo: "" }])
    markChanged()
  }

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    setTimelineEvents((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)))
    markChanged()
  }

  const removeTimelineEvent = (index: number) => {
    if (!confirm("Tem certeza que deseja remover este evento?")) return
    setTimelineEvents((prev) => prev.filter((_, i) => i !== index))
    markChanged()
  }

  const moveTimelineEvent = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= timelineEvents.length) return
    setTimelineEvents((prev) => {
      const arr = [...prev]
      const temp = arr[index]
      arr[index] = arr[newIndex]
      arr[newIndex] = temp
      return arr
    })
    markChanged()
  }

  const uploadTimelinePhoto = async (index: number, file: File) => {
    const url = await uploadPhoto(file)
    if (url) {
      updateTimelineEvent(index, "photo", url)
    }
  }

  const addQuote = () => {
    setLoveQuotes((prev) => [...prev, ""])
    markChanged()
  }

  const updateQuote = (index: number, value: string) => {
    setLoveQuotes((prev) => prev.map((q, i) => (i === index ? value : q)))
    markChanged()
  }

  const removeQuote = (index: number) => {
    if (!confirm("Tem certeza que deseja remover esta citação?")) return
    setLoveQuotes((prev) => prev.filter((_, i) => i !== index))
    markChanged()
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "16px",
  }

  const renderInfoTab = () => {
    const daysCount = dayCountStart
      ? Math.floor((Date.now() - new Date(dayCountStart).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Sparkles size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Casal</h3>
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Nomes do Casal</label>
          <input
            style={inputStyle}
            value={coupleName}
            onChange={(e) => { setCoupleName(e.target.value); markChanged() }}
            placeholder="Ana & Pedro"
          />
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Data Especial</label>
          <input
            style={inputStyle}
            type="date"
            value={specialDate}
            onChange={(e) => { setSpecialDate(e.target.value); markChanged() }}
          />
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Nome do Remetente</label>
          <input
            style={inputStyle}
            value={senderName}
            onChange={(e) => { setSenderName(e.target.value); markChanged() }}
            placeholder="Com amor de..."
          />
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Nome do Cliente</label>
          <input
            style={inputStyle}
            value={clientName}
            onChange={(e) => { setClientName(e.target.value); markChanged() }}
            placeholder="Aparece no rodape como 'Com amor, XXXX'"
          />
        </div>
        <div>
          <label style={labelStyle}>Titulo da Historia</label>
          <input
            style={inputStyle}
            value={storyTitle}
            onChange={(e) => { setStoryTitle(e.target.value); markChanged() }}
            placeholder="Nossa Historia de Amor"
          />
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Calendar size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Contador de Dias</h3>
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "14px", lineHeight: "1.5" }}>
          Selecione a data de inicio do relacionamento. O contador sera exibido no site.
        </p>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Data de Inicio</label>
          <input
            style={inputStyle}
            type="date"
            value={dayCountStart}
            onChange={(e) => { setDayCountStart(e.target.value); markChanged() }}
          />
        </div>
        {dayCountStart && (
          <div style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}30`,
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center" as const,
          }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "4px" }}>
              Tempo juntos
            </div>
            <div style={{ color: accentColor, fontSize: "36px", fontWeight: "bold", lineHeight: 1 }}>
              {daysCount > 0 ? daysCount : 0}
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "4px" }}>
              {daysCount === 1 ? "dia" : "dias"}
            </div>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <MessageCircle size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Mensagem</h3>
        </div>
        <textarea
          style={{ ...inputStyle, minHeight: "120px", resize: "vertical" as const }}
          value={message}
          onChange={(e) => { setMessage(e.target.value); markChanged() }}
          placeholder="Escreva uma mensagem especial..."
        />
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <MapPin size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Localizacao</h3>
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Nome do Local</label>
          <input
            style={inputStyle}
            value={locationName}
            onChange={(e) => { setLocationName(e.target.value); markChanged() }}
            placeholder="Parque do Ibirapuera"
          />
        </div>
        <div>
          <label style={labelStyle}>URL do Google Maps</label>
          <input
            style={inputStyle}
            value={locationUrl}
            onChange={(e) => { setLocationUrl(e.target.value); markChanged() }}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Music size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Musica</h3>
        </div>
        <div>
          <label style={labelStyle}>URL da Musica (YouTube/Spotify)</label>
          <input
            style={inputStyle}
            value={musicUrl}
            onChange={(e) => { setMusicUrl(e.target.value); markChanged() }}
            placeholder="https://open.spotify.com/..."
          />
        </div>
      </div>
    </div>
    )
  }

  const renderFotosTab = () => (
    <div>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <ImageIcon size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Fotos ({photos.length})</h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "12px",
          }}
        >
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                aspectRatio: "1",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <img
                src={photo}
                alt={`Foto ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={() => removePhoto(index)}
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
          <label
            style={{
              borderRadius: "12px",
              border: "2px dashed rgba(255,255,255,0.15)",
              aspectRatio: "1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "border-color 0.2s",
              gap: "8px",
            }}
          >
            <Upload size={24} color="rgba(255,255,255,0.4)" />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>Adicionar</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={addPhoto}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
    </div>
  )

  const renderHistoriaTab = () => (
    <div>
      {storySections.map((section, index) => (
        <motion.div
          key={index}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={cardStyle}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <GripVertical size={16} color="rgba(255,255,255,0.3)" />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "600" }}>
                Secao {index + 1}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => moveStorySection(index, -1)}
                disabled={index === 0}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  color: index === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)",
                  cursor: index === 0 ? "default" : "pointer",
                  display: "flex",
                }}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => moveStorySection(index, 1)}
                disabled={index === storySections.length - 1}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  color: index === storySections.length - 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)",
                  cursor: index === storySections.length - 1 ? "default" : "pointer",
                  display: "flex",
                }}
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => removeStorySection(index)}
                style={{
                  background: "rgba(248,113,113,0.15)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  color: "#f87171",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                }}
              >
                <Trash2 size={14} /> Remover
              </button>
            </div>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Titulo</label>
            <input
              style={inputStyle}
              value={section.title}
              onChange={(e) => updateStorySection(index, "title", e.target.value)}
              placeholder="Titulo da secao..."
            />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Texto</label>
            <textarea
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" as const }}
              value={section.text}
              onChange={(e) => updateStorySection(index, "text", e.target.value)}
              placeholder="Escreva sobre este momento..."
            />
          </div>
          <div>
            <label style={labelStyle}>Foto</label>
            {section.photo ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={section.photo}
                  alt={section.title}
                  style={{ width: "200px", height: "130px", objectFit: "cover", borderRadius: "10px" }}
                />
                <button
                  onClick={() => updateStorySection(index, "photo", "")}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "2px dashed rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                <Upload size={16} /> Enviar foto
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) uploadStoryPhoto(index, e.target.files[0])
                  }}
                />
              </label>
            )}
          </div>
        </motion.div>
      ))}
      <button
        onClick={addStorySection}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "2px dashed rgba(255,255,255,0.15)",
          background: "transparent",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.2s",
        }}
      >
        <Plus size={18} /> Adicionar Secao
      </button>
    </div>
  )

  const renderTimelineTab = () => (
    <div>
      {timelineEvents.map((event, index) => (
        <motion.div
          key={index}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={cardStyle}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={16} color={accentColor} />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "600" }}>
                Evento {index + 1}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => moveTimelineEvent(index, -1)}
                disabled={index === 0}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  color: index === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)",
                  cursor: index === 0 ? "default" : "pointer",
                  display: "flex",
                }}
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => moveTimelineEvent(index, 1)}
                disabled={index === timelineEvents.length - 1}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  color: index === timelineEvents.length - 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)",
                  cursor: index === timelineEvents.length - 1 ? "default" : "pointer",
                  display: "flex",
                }}
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => removeTimelineEvent(index)}
                style={{
                  background: "rgba(248,113,113,0.15)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  color: "#f87171",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                }}
              >
                <Trash2 size={14} /> Remover
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={labelStyle}>Data</label>
              <input
                style={inputStyle}
                type="date"
                value={event.date}
                onChange={(e) => updateTimelineEvent(index, "date", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Titulo</label>
              <input
                style={inputStyle}
                value={event.title}
                onChange={(e) => updateTimelineEvent(index, "title", e.target.value)}
                placeholder="Nosso primeiro encontro..."
              />
            </div>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Descricao</label>
            <textarea
              style={{ ...inputStyle, minHeight: "60px", resize: "vertical" as const }}
              value={event.description}
              onChange={(e) => updateTimelineEvent(index, "description", e.target.value)}
              placeholder="Conte sobre este momento..."
            />
          </div>
          <div>
            <label style={labelStyle}>Foto</label>
            {event.photo ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={event.photo}
                  alt={event.title}
                  style={{ width: "200px", height: "130px", objectFit: "cover", borderRadius: "10px" }}
                />
                <button
                  onClick={() => updateTimelineEvent(index, "photo", "")}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "2px dashed rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                <Upload size={16} /> Enviar foto
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) uploadTimelinePhoto(index, e.target.files[0])
                  }}
                />
              </label>
            )}
          </div>
        </motion.div>
      ))}
      <button
        onClick={addTimelineEvent}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "2px dashed rgba(255,255,255,0.15)",
          background: "transparent",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <Plus size={18} /> Adicionar Evento
      </button>
    </div>
  )

  const renderCitacoesTab = () => (
    <div>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Quote size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Citacoes de Amor ({loveQuotes.length})</h3>
        </div>
        {loveQuotes.map((quote, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "10px",
                  color: "rgba(255,255,255,0.2)",
                  fontSize: "18px",
                  fontStyle: "italic",
                }}
              >
                &ldquo;
              </span>
              <input
                style={{ ...inputStyle, paddingLeft: "28px", fontStyle: "italic" }}
                value={quote}
                onChange={(e) => updateQuote(index, e.target.value)}
                placeholder="Escreva uma citacao..."
              />
            </div>
            <button
              onClick={() => removeQuote(index)}
              style={{
                background: "rgba(248,113,113,0.15)",
                border: "none",
                borderRadius: "8px",
                padding: "8px",
                color: "#f87171",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>
      <button
        onClick={addQuote}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "2px dashed rgba(255,255,255,0.15)",
          background: "transparent",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <Plus size={18} /> Adicionar Citacao
      </button>
    </div>
  )

  const renderEstiloTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Palette size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Cor de Destaque</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          {["#e11d48", "#9333ea", "#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2"].map((color) => (
            <button
              key={color}
              onClick={() => { setAccentColor(color); markChanged() }}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: accentColor === color ? "3px solid #fff" : "3px solid transparent",
                background: color,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            />
          ))}
          <div style={{ position: "relative" }}>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => { setAccentColor(e.target.value); markChanged() }}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
                padding: 0,
              }}
            />
          </div>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontFamily: "monospace" }}>
            {accentColor}
          </span>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Type size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Fonte</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {fontOptions.map((font) => (
            <button
              key={font.value}
              onClick={() => { setFontFamily(font.value); markChanged() }}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: fontFamily === font.value
                  ? `2px solid ${accentColor}`
                  : "2px solid rgba(255,255,255,0.08)",
                background: fontFamily === font.value
                  ? `${accentColor}15`
                  : "rgba(255,255,255,0.03)",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: font.value,
                fontSize: "16px",
                transition: "all 0.2s",
              }}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Layout size={18} color={accentColor} />
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Template</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {templateOptions.map((tmpl) => (
            <button
              key={tmpl.value}
              onClick={() => { setTemplateId(tmpl.value); markChanged() }}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: templateId === tmpl.value
                  ? `2px solid ${accentColor}`
                  : "2px solid rgba(255,255,255,0.08)",
                background: templateId === tmpl.value
                  ? `${accentColor}15`
                  : "rgba(255,255,255,0.03)",
                color: "#fff",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPreviewTab = () => (
    <div style={{ textAlign: "center" }}>
      <div style={cardStyle}>
        <Eye size={40} color={accentColor} style={{ marginBottom: "16px" }} />
        <h3 style={{ color: "#fff", margin: "0 0 8px 0", fontSize: "18px" }}>Preview do Gift</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 24px 0", fontSize: "14px" }}>
          Veja como o gift ficara para quem recebe
        </p>
        <button
          onClick={() => window.open(`/gift/${slug}`, "_blank")}
          style={{
            padding: "14px 32px",
            borderRadius: "12px",
            border: "none",
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            color: "#fff",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Eye size={18} /> Abrir Preview
        </button>
      </div>

      {gift && (
        <div style={cardStyle}>
          <h3 style={{ color: "#fff", margin: "0 0 16px 0", fontSize: "16px", textAlign: "left" }}>Resumo</h3>
          <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Status</span>
              <span style={{
                color: gift.isPublished ? "#4ade80" : "#fbbf24",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                {gift.isPublished ? "Publicado" : "Rascunho"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Slug</span>
              <span style={{ color: "#fff", fontSize: "14px", fontFamily: "monospace" }}>{slug}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Fotos</span>
              <span style={{ color: "#fff", fontSize: "14px" }}>{photos.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Secoes</span>
              <span style={{ color: "#fff", fontSize: "14px" }}>{storySections.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Eventos</span>
              <span style={{ color: "#fff", fontSize: "14px" }}>{timelineEvents.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Citacoes</span>
              <span style={{ color: "#fff", fontSize: "14px" }}>{loveQuotes.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderTab = () => {
    switch (activeTab) {
      case "info": return renderInfoTab()
      case "fotos": return renderFotosTab()
      case "historia": return renderHistoriaTab()
      case "timeline": return renderTimelineTab()
      case "citacoes": return renderCitacoesTab()
      case "estilo": return renderEstiloTab()
      case "preview": return renderPreviewTab()
      default: return null
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(15,15,26,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "12px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => router.back()}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "10px",
                padding: "8px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 style={{ color: "#fff", fontSize: "16px", margin: 0, fontWeight: "600" }}>
                {coupleName || slug}
              </h1>
              {hasChanges && (
                <span style={{ color: "#fbbf24", fontSize: "11px" }}>Nao salvo</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={() => window.open(`/gift/${slug}`, "_blank")}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "10px",
                padding: "8px 10px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0",
                fontSize: "13px",
              }}
            >
              <Eye size={15} />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "10px",
                padding: "8px 10px",
                color: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0",
                fontSize: "13px",
                opacity: saving ? 0.6 : 1,
              }}
            >
              <Save size={15} />
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                border: "none",
                borderRadius: "10px",
                padding: "8px 12px",
                color: "#fff",
                cursor: publishing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: "600",
                opacity: publishing ? 0.6 : 1,
              }}
            >
              <Globe size={15} /> <span style={{whiteSpace: "nowrap"}}>{publishing ? "Publicando..." : "Publicar"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          position: "sticky",
          top: "57px",
          zIndex: 40,
          background: "rgba(15,15,26,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            overflowX: "auto",
            gap: "4px",
            padding: "8px 0",
            scrollbarWidth: "none",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: "0 0 auto",
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                background: activeTab === tab.id ? `${accentColor}20` : "transparent",
                color: activeTab === tab.id ? accentColor : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? "600" : "400",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 20px 100px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              style={{
                background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "32px 28px",
                maxWidth: "480px",
                width: "100%",
                position: "relative",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              }}
            >
              <button
                onClick={() => {
                  localStorage.setItem(`welcome-${slug}`, "1")
                  setShowWelcome(false)
                }}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <X size={16} />
              </button>

              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <Sparkles size={28} color="#fff" />
                </div>
                <h2 style={{ color: "#fff", fontSize: "22px", margin: "0 0 8px 0", fontWeight: "700" }}>
                  Bem-vindo ao Editor!
                </h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                  Aqui voce vai montar o site do seu presente personalizado.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                {[
                  { icon: <PenLine size={18} />, title: "Tudo e editavel", desc: "Altere textos, fotos, cores, fontes e template como quiser." },
                  { icon: <FileText size={18} />, title: "Modelos prontos", desc: "Ja deixamos secoes de exemplo e citacoes famosas. Use como base e adapte a sua historia." },
                  { icon: <Eye size={18} />, title: "Preview em tempo real", desc: "Clique em Preview para ver como o site fica antes de publicar." },
                  { icon: <Globe size={18} />, title: "Publique quando pronto", desc: "Clique em Publicar e o link sera enviado por email pra voce programar a tag NFC." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: `${accentColor}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: accentColor,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontSize: "14px", margin: "0 0 2px 0", fontWeight: "600" }}>{item.title}</p>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.2)",
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "20px",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "16px", lineHeight: 1 }}>&#9888;</span>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>
                  Nao se esqueca de <strong style={{ color: "#fbbf24" }}>salvar</strong> antes de ver o preview e antes de publicar!
                </p>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem(`welcome-${slug}`, "1")
                  setShowWelcome(false)
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
              >
                Comecar a editar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
