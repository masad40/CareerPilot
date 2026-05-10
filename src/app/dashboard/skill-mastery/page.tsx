"use client";

import QuizConfigurator from "@/components/SkillMastery/QuizConfigurator";
import TopicSelector from "@/components/SkillMastery/TopicSelector";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, ChevronRight, Loader, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface HistoryEntry {
  id: string;
  topic: string;
  difficulty: string;
  completedAt: string;
  score: { percentage: number; correctAnswers: number; total: number; wrongAnswers: number };
  userLevelAfter: string;
}

function getGradeColor(pct: number) {
  if (pct >= 80) return "text-green-500";
  if (pct >= 60) return "text-yellow-500";
  return "text-red-500";
}

function getDifficultyColor(d: string) {
  if (d === "Hard") return "text-red-500 bg-red-500/10 border-red-500/30";
  if (d === "Medium") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
  return "text-green-500 bg-green-500/10 border-green-500/30";
}

export default function SkillMasteryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stage, setStage] = useState<"topic" | "config">("topic");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("quiz_history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("quiz_history");
    setHistory([]);
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setStage("config");
  };

  const handleStartQuiz = async (difficulty: string, questionCount: number) => {
    setLoading(true);
    try {
      // Get auth token to associate quiz with user
      const token = await user?.getIdToken().catch(() => null);

      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ topic: selectedTopic, difficulty, questionCount }),
      });

      if (!response.ok) throw new Error("Failed to generate quiz");

      const data = await response.json();
      if (data.success) {
        const quizId = data.quiz._id?.$oid ?? data.quiz._id?.toString?.() ?? String(data.quiz._id);
        sessionStorage.setItem(`quiz_${quizId}`, JSON.stringify(data.quiz));
        router.push(`/dashboard/skill-mastery/quiz/${quizId}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-8">

      {/* Quiz starter */}
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <Loader className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted">Preparing your quiz...</p>
          </motion.div>
        ) : stage === "topic" ? (
          <TopicSelector onTopicSelect={handleTopicSelect} />
        ) : (
          <QuizConfigurator topic={selectedTopic} onBack={() => setStage("topic")} onStart={handleStartQuiz} />
        )}
      </div>

      {/* Quiz history — hidden while generating */}
      <AnimatePresence>
        {!loading && history.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Recent Quizzes</h2>
              <button onClick={clearHistory}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Clear all
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((entry, i) => (
                <motion.div key={entry.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="bg-card-bg border border-card-border rounded-2xl p-4 hover:border-primary/40 transition-all group">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="font-semibold text-sm text-foreground leading-tight">{entry.topic}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getDifficultyColor(entry.difficulty)}`}>
                      {entry.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <p className={`text-3xl font-black ${getGradeColor(entry.score.percentage)}`}>
                      {entry.score.percentage}%
                    </p>
                    <div className="text-xs text-muted space-y-0.5">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />{entry.score.correctAnswers} correct
                      </div>
                      <div className="flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-red-500" />{entry.score.wrongAnswers} wrong
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-card-border rounded-full overflow-hidden mb-3">
                    <div className={`h-full rounded-full ${entry.score.percentage >= 80 ? "bg-green-500" : entry.score.percentage >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${entry.score.percentage}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-muted">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <Link href={`/dashboard/skill-mastery/quiz/${entry.id}/results`}
                      className="flex items-center gap-1 text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View results <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
