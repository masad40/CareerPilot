"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, X, Clock, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Difficulty = "Easy" | "Medium" | "Hard";

type AIQuestion = {
  question: string;
  difficulty: Difficulty;
  shortAnswer: string;
  detailedAnswer: string;
  followUps: string[];
  commonMistakes: string[];
  tags: string[];
};

type AISet = {
  topic: string;
  level: string;
  questions: AIQuestion[];
};

export default function InterviewBankAIPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AISet | null>(null);
  const [active, setActive] = useState<AIQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const fetchHistory = async () => {
    if (!user?.uid) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/interview-bank/generate?userId=${user.uid}`);
      const json = await res.json();
      if (res.ok && Array.isArray(json)) setHistory(json);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) fetchHistory();
  }, [user?.uid]);

  const generate = async () => {
    if (!topic.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/interview-bank/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          userId: user?.uid,
          userEmail: user?.email,
          role: "Subject Matter Expert",
          level: "Comprehensive (Beginner to Pro)",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to generate content");
      setData(json.questionBank);
      await fetchHistory();
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-foreground pb-20 bg-background">

      {/* ── LOADING OVERLAY ─────────────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl"
          >
            <div className="relative w-64 h-1 bg-card-border rounded-full overflow-hidden mb-8">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-2 tracking-tighter uppercase text-foreground">Interview Bank</h2>
              <p className="text-primary text-sm font-mono uppercase tracking-[0.3em]">Analyzing: {topic}...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-16">

        {/* ── HEADER ──────────────────────────────────────────── */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase"
          >
            CareerPilot Intelligence
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Interview <span className="text-primary">Bank</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Master any subject. Generate professional interview questions, academic deep-dives, or skill assessments instantly.
          </p>
        </div>

        {/* ── INPUT ───────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
          <div className="relative flex flex-col md:flex-row gap-3 bg-card-bg border border-card-border p-2 rounded-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="Enter any topic"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-body-bg border border-card-border text-foreground placeholder:text-muted outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
              />
            </div>
            <button
              onClick={generate}
              disabled={loading || !topic}
              className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all disabled:opacity-50 active:scale-95"
            >
              Generate
            </button>
          </div>
          {error && <p className="text-center mt-4 text-red-400 text-sm">{error}</p>}
        </div>

        {/* ── HISTORY ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-card-border pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Clock size={20} className="text-primary" /> Recent Sessions
            </h2>
            {historyLoading && <Loader2 size={16} className="animate-spin text-muted" />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {history.length > 0 ? (
              history.slice(0, 4).map((item, idx) => (
                <motion.div
                  key={item._id || idx}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    setData(item.questionBank);
                    setTopic(item.topic);
                    resultRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="p-5 rounded-2xl bg-card-bg border border-card-border hover:border-primary/50 cursor-pointer group transition-all"
                >
                  <p className="text-[10px] text-primary font-mono mb-1 uppercase tracking-wider">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                  </p>
                  <h4 className="font-bold truncate group-hover:text-primary transition-colors uppercase text-sm text-foreground">
                    {item.topic}
                  </h4>
                  <div className="mt-4 flex items-center text-[10px] font-bold text-muted uppercase group-hover:text-primary transition-colors">
                    Open Bank <ChevronRight size={12} className="ml-1" />
                  </div>
                </motion.div>
              ))
            ) : (
              !historyLoading && (
                <div className="col-span-full py-10 text-center border border-dashed border-card-border rounded-2xl text-muted">
                  No history found. Explore a new topic to begin!
                </div>
              )
            )}
          </div>
        </section>

        {/* ── RESULTS ─────────────────────────────────────────── */}
        <div ref={resultRef} className="pt-10 scroll-mt-20">
          {data ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-card-bg border border-card-border p-8 rounded-3xl backdrop-blur-md shadow-2xl">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">{data.topic}</h2>
                    <p className="text-primary text-sm font-medium">{data.level} • {data.questions?.length || 0} Key Concepts</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {data.questions?.map((q, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActive(q)}
                      className="p-6 rounded-2xl bg-body-bg border border-card-border hover:border-primary/30 transition-all cursor-pointer shadow-lg group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                          q.difficulty === "Hard" ? "bg-red-500/10 text-red-500" :
                          q.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-green-500/10 text-green-500"
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold leading-tight mb-3 text-foreground group-hover:text-primary transition-colors">{q.question}</h3>
                      <p className="text-sm text-muted line-clamp-2 italic">"{q.shortAnswer}"</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            !loading && (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-card-border rounded-3xl bg-card-bg">
                <Sparkles size={40} className="text-muted mb-4" />
                <p className="text-muted font-medium">Search for a topic to generate your master bank.</p>
              </div>
            )
          )}
        </div>

        {/* ── DETAIL MODAL ────────────────────────────────────── */}
        <AnimatePresence>
          {active && (
            <motion.div
              className="fixed inset-0 z-[150] flex items-center justify-center px-4 sm:px-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setActive(null)} />
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-card-bg border border-card-border shadow-2xl p-6 sm:p-8"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-8 sticky top-0 bg-card-bg pb-4 z-10 border-b border-card-border">
                  <div>
                    <span className="text-primary text-xs font-black tracking-widest uppercase mb-2 block">{active.difficulty} Difficulty</span>
                    <h2 className="text-2xl md:text-3xl font-black leading-tight text-foreground">{active.question}</h2>
                  </div>
                  <button onClick={() => setActive(null)} className="p-2 rounded-full bg-body-bg border border-card-border hover:border-primary/40 transition text-muted hover:text-foreground">
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-body-bg border border-card-border">
                      <h4 className="text-[10px] font-black text-primary tracking-[0.2em] mb-3 uppercase">Core Summary</h4>
                      <p className="text-foreground/80 leading-relaxed">{active.shortAnswer}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                      <h4 className="text-[10px] font-black text-red-500 tracking-[0.2em] mb-3 uppercase">Critical Pitfalls</h4>
                      <ul className="space-y-2">
                        {active.commonMistakes?.map((m, i) => (
                          <li key={i} className="text-sm text-foreground/60 flex gap-2 italic">
                            <span className="text-red-500">•</span> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-8 rounded-2xl bg-body-bg border border-card-border">
                    <h4 className="text-[10px] font-black text-primary tracking-[0.2em] mb-4 uppercase">Detailed Analysis</h4>
                    <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap">{active.detailedAnswer}</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <h4 className="text-[10px] font-black text-primary tracking-[0.2em] mb-3 uppercase">Expanded Inquiry</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {active.followUps?.map((f, i) => (
                        <div key={i} className="text-sm text-foreground/60 bg-body-bg p-3 rounded-xl border border-card-border">
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
