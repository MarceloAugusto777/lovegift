"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause } from "lucide-react"

interface MusicPlayerProps {
  musicUrl: string
  accentColor?: string
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function MusicPlayer({ musicUrl, accentColor = "#e11d48" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const playerRef = useRef<HTMLIFrameElement | null>(null)
  const ytId = extractYouTubeId(musicUrl)

  const sendCommand = useCallback((command: string) => {
    if (playerRef.current?.contentWindow) {
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      )
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!loaded) {
      setLoaded(true)
      return
    }
    if (isPlaying) {
      sendCommand("pauseVideo")
      setIsPlaying(false)
    } else {
      sendCommand("playVideo")
      setIsPlaying(true)
    }
  }, [loaded, isPlaying, sendCommand])

  useEffect(() => {
    if (!loaded) return
    const timer = setTimeout(() => {
      sendCommand("playVideo")
      setIsPlaying(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [loaded, sendCommand])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data
        if (data.event === "onStateChange") {
          if (data.info === 1) setIsPlaying(true)
          else if (data.info === 2 || data.info === 0) setIsPlaying(false)
        }
      } catch {}
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  if (!ytId) return null

  return (
    <>
      {loaded && (
        <iframe
          ref={playerRef}
          src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}&rel=0&modestbranding=1`}
          style={{
            position: "fixed",
            width: 0,
            height: 0,
            border: "none",
            opacity: 0,
            pointerEvents: "none",
          }}
          allow="autoplay"
        />
      )}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: accentColor,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 20px ${accentColor}60`,
          color: "#fff",
        }}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: "2px" }} />}
      </motion.button>
    </>
  )
}
