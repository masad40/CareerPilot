"use client"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"

type Mode = "focus" | "short" | "long"

const MODES: Record<Mode, { label: string; seconds: number; hex: string; hexBg: string; gradient?: string }> = {
  focus: { label: "Pomodoro",    seconds: 1500, hex: "#ED8936", hexBg: "rgba(237,137,54,0.08)" },
  short: { label: "Short Break", seconds: 300,  hex: "#38BDF8", hexBg: "rgba(56,189,248,0.08)" },
  long:  { label: "Long Break",  seconds: 900,  hex: "#ED8936", hexBg: "rgba(237,137,54,0.06)", gradient: "linear-gradient(135deg, rgba(237,137,54,0.12), rgba(56,189,248,0.12))" },
}

const RADIUS = 110
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface Quote { text: string; author: string }

export default function Promodoro() {
  const [mode, setMode] = useState<Mode>("focus")
  const [second, setSecond] = useState(MODES.focus.seconds)
  const [active, setActive] = useState(false)
  const [quote, setQuote] = useState<Quote>({ text: "", author: "" })
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [fadeQuote, setFadeQuote] = useState(true)

  const total = MODES[mode].seconds
  const progress = second / total
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const m = MODES[mode]

  const fetchQuote = useCallback(async () => {
    setQuoteLoading(true)
    setFadeQuote(false)
    try {
      const { data } = await axios.get<Quote>("/api/quote")
      setTimeout(() => { setQuote(data); setFadeQuote(true) }, 300)
    } catch {
      setFadeQuote(true)
    } finally {
      setQuoteLoading(false)
    }
  }, [])

  useEffect(() => { fetchQuote() }, [])

  useEffect(() => {
    if (!active) return
    let elapsed = 0
    const id = setInterval(() => {
      elapsed += 1
      setSecond(prev => {
        if (prev <= 1) { clearInterval(id); setActive(false); return 0 }
        return prev - 1
      })
      if (elapsed % 30 === 0) fetchQuote()
    }, 1000)
    return () => clearInterval(id)
  }, [active, fetchQuote])

  const changeMode = (mo: Mode) => {
    setActive(false); setMode(mo); setSecond(MODES[mo].seconds)
  }

  const mins = String(Math.floor(second / 60)).padStart(2, "0")
  const secs = String(second % 60).padStart(2, "0")

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* LEFT — Timer */}
        <div className="flex flex-col items-center gap-8">

          {/* Mode tabs */}
          <div className="flex gap-2 bg-card-bg border border-card-border rounded-2xl p-1.5">
            {(Object.keys(MODES) as Mode[]).map(mo => (
              <button key={mo} onClick={() => changeMode(mo)}
                style={mode === mo ? { backgroundColor: MODES[mo].hex, color: "#fff" } : {}}
                className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  mode === mo ? "" : "text-muted hover:text-foreground"
                }`}>
                {MODES[mo].label}
              </button>
            ))}
          </div>

          {/* SVG Ring */}
          <div className="relative flex items-center justify-center">
            <svg width="280" height="280" className="-rotate-90">
              <defs>
                <linearGradient id="longGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ED8936" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
              <circle cx="140" cy="140" r={RADIUS} fill="none" stroke="var(--card-border)" strokeWidth="10" />
              <circle
                cx="140" cy="140" r={RADIUS} fill="none"
                stroke={mode === "long" ? "url(#longGradient)" : m.hex}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s ease" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span
                className="text-6xl sm:text-7xl font-bold tabular-nums"
                style={mode === "long"
                  ? { background: "linear-gradient(135deg, #ED8936, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
                  : { color: m.hex }}
              >
                {mins}:{secs}
              </span>
              <span className="text-muted text-xs mt-1 uppercase tracking-widest">{m.label}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => setActive(a => !a)}
              style={{ backgroundColor: m.hex }}
              className="px-10 sm:px-12 py-3.5 text-white font-bold text-lg rounded-xl transition-all active:scale-95 hover:opacity-90"
            >
              {active ? "PAUSE" : "START"}
            </button>
            <button
              onClick={() => changeMode(mode)}
              className="px-6 sm:px-8 py-3.5 bg-card-bg hover:bg-body-bg border border-card-border text-foreground/70 font-bold text-lg rounded-xl transition-all active:scale-95"
            >
              RESET
            </button>
          </div>

          {/* Duration cards */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {(Object.keys(MODES) as Mode[]).map(mo => (
              <div key={mo}
                style={mode === mo ? { backgroundColor: MODES[mo].hexBg, borderColor: MODES[mo].hex + "40" } : {}}
                className="border border-card-border rounded-xl p-3 text-center transition-all bg-card-bg">
                <p className="text-sm font-bold" style={{ color: MODES[mo].hex }}>{MODES[mo].seconds / 60} min</p>
                <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">{MODES[mo].label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Quote */}
        <div
          style={mode === "long"
            ? { background: m.gradient, borderColor: "rgba(237,137,54,0.25)" }
            : { backgroundColor: m.hexBg, borderColor: m.hex + "30" }}
          className="flex flex-col justify-center gap-6 border rounded-2xl p-6 sm:p-8 transition-all duration-500"
        >
          <div className="flex items-center justify-between">
            <span
              style={mode === "long"
                ? { background: "linear-gradient(135deg, #ED8936, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", borderColor: "rgba(237,137,54,0.4)", backgroundColor: "transparent" }
                : { color: m.hex, borderColor: m.hex + "40", backgroundColor: m.hexBg }}
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border">
              Daily Inspiration
            </span>
            <button
              onClick={fetchQuote}
              disabled={quoteLoading}
              className="p-2 rounded-xl bg-card-bg hover:bg-body-bg border border-card-border text-muted hover:text-foreground transition-all disabled:opacity-40"
              title="New quote"
            >
              <span className={`material-symbols-outlined text-lg ${quoteLoading ? "animate-spin" : ""}`}>
                {quoteLoading ? "progress_activity" : "refresh"}
              </span>
            </button>
          </div>

          <div className={`transition-opacity duration-300 ${fadeQuote ? "opacity-100" : "opacity-0"}`}>
            <div className="text-5xl font-serif mb-4 opacity-40" style={{ color: m.hex }}>"</div>
            <p className="text-lg sm:text-xl font-light italic text-foreground/80 leading-relaxed">
              {quote.text}
            </p>
            <p className="text-sm text-muted mt-4 uppercase tracking-widest">— {quote.author}</p>
          </div>

          <div className="h-px bg-card-border my-2" />

          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted uppercase tracking-wider">Session tips</p>
            {["Silence notifications", "Keep water nearby", "Take deep breaths on breaks"].map(tip => (
              <div key={tip} className="flex items-center gap-2 text-sm text-foreground/60">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.hex }} />
                {tip}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
