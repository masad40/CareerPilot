'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
}


function stripMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')   // bold
    .replace(/\*(.*?)\*/g, '$1')        // italic
    .replace(/#{1,6}\s+/g, '')          // headings
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // code
    .replace(/^\s*[-*+]\s+/gm, '• ')   // bullets → •
    .replace(/^\s*\d+\.\s+/gm, (m) => m.trimStart()) // numbered lists
    .trim()
}

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const SUGGESTIONS = [
  "How do I stay consistent with learning?",
  "Give me a study tip for today",
  "How do I prepare for a technical interview?",
  "What skills should I focus on for web development?",
]

export default function AiMentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your CareerPilot AI Mentor. Ask me anything about your career, learning journey, or skill development.",
      time: getTime(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [input])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = { role: 'user', content: trimmed, time: getTime() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setIsLoading(true)

    try {
      // Skip the initial greeting when building history for the API
      const history = updated.filter((m, idx) => !(idx === 0 && m.role === 'assistant'))
      const apiMessages = history.map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: stripMarkdown(data.reply), time: getTime() }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Something went wrong. Please try again.", time: getTime() },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col bg-card-bg" style={{ height: 'calc(100vh - 3.5rem)' }}>

      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-card-border bg-card-bg">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>smart_toy</span>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-body-bg" />
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">CareerPilot Mentor</p>
          <p className="text-xs font-medium text-green-500">Online · Ready to help</p>
        </div>
      </div>

      {/* Messages — takes all remaining space and scrolls */}
      <div className="flex-1 overflow-y-auto px-4 py-5 min-h-0 bg-card-bg">
        <div className="max-w-2xl mx-auto space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center self-end mb-5">
                    <span className="material-symbols-outlined text-primary text-[17px]">smart_toy</span>
                  </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-card-bg border border-card-border text-foreground'
                    }`}
                    style={{ borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted px-1">{msg.time}</span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-primary/20 shrink-0 flex items-center justify-center self-end mb-5">
                    <span className="material-symbols-outlined text-primary text-[17px]">person</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[17px]">smart_toy</span>
              </div>
              <div className="px-4 py-3 bg-card-bg border border-card-border flex items-center gap-1.5" style={{ borderRadius: '18px 18px 18px 4px' }}>
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input — always pinned to bottom */}
      <div className="shrink-0 bg-card-bg border-t border-card-border px-4 py-3">
        <div className="max-w-2xl mx-auto space-y-2">

          {/* Suggestion chips — only on fresh chat */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-card-border text-muted hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 px-4 py-3 rounded-2xl border border-card-border bg-body-bg focus-within:border-primary/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder="Ask me anything..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted leading-relaxed"
              style={{ minHeight: 36, maxHeight: 120 }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-white text-[18px]">send</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
