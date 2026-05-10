"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, TrendingUp, ChevronDown, ChevronUp, MinusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface DetailedAnswer {
  questionId: number;
  questionText: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  explanation: string;
  options?: { id: string; text: string }[];
}

interface ResultsDisplayProps {
  score: {
    obtained: number;
    total: number;
    percentage: number;
    correctAnswers: number;
    wrongAnswers: number;
    skipped: number;
  };
  topic: string;
  difficulty: string;
  categoryPerformance: {
    [key: string]: { correct: number; total: number; percentage: number };
  };
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendedTopics: string[];
  };
  feedback: string;
  level: string;
  answers?: DetailedAnswer[];
}

function getGrade(percentage: number) {
  if (percentage >= 90) return { grade: "A+", color: "text-green-500" };
  if (percentage >= 80) return { grade: "A",  color: "text-green-500" };
  if (percentage >= 70) return { grade: "B",  color: "text-blue-500" };
  if (percentage >= 60) return { grade: "C",  color: "text-yellow-500" };
  return { grade: "F", color: "text-red-500" };
}

function AnswerCard({ answer, index }: { answer: DetailedAnswer; index: number }) {
  const [open, setOpen] = useState(!answer.isCorrect);

  const statusIcon = answer.userAnswer === null
    ? <MinusCircle className="w-5 h-5 text-muted shrink-0" />
    : answer.isCorrect
      ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
      : <XCircle className="w-5 h-5 text-red-500 shrink-0" />;

  const borderColor = answer.userAnswer === null
    ? "border-card-border"
    : answer.isCorrect
      ? "border-green-500/30"
      : "border-red-500/30";

  const bgColor = answer.userAnswer === null
    ? "bg-card-bg"
    : answer.isCorrect
      ? "bg-green-500/5"
      : "bg-red-500/5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden`}
    >
      {/* Question header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        {statusIcon}
        <span className="flex-1 text-sm font-medium text-foreground leading-snug">
          <span className="text-muted mr-2">Q{index + 1}.</span>
          {answer.questionText}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-muted shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-muted shrink-0 mt-0.5" />}
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-card-border pt-3">
              {/* Your answer */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted w-28 shrink-0">Your answer:</span>
                {answer.userAnswer === null ? (
                  <span className="text-muted italic">Skipped</span>
                ) : (
                  <span className={answer.isCorrect ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                    {answer.userAnswer.toUpperCase()}
                    {answer.isCorrect ? " ✓" : " ✗"}
                  </span>
                )}
              </div>

              {/* Correct answer */}
              {!answer.isCorrect && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted w-28 shrink-0">Correct answer:</span>
                  <span className="text-green-500 font-medium">{answer.correctAnswer.toUpperCase()} ✓</span>
                </div>
              )}

              {/* Explanation */}
              {answer.explanation && (
                <div className="mt-2 p-3 rounded-lg bg-card-bg border border-card-border text-sm text-foreground/80 leading-relaxed">
                  <span className="font-semibold text-primary">Explanation: </span>
                  {answer.explanation}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ResultsDisplay({
  score, topic, difficulty, categoryPerformance, insights, feedback, level, answers = [],
}: ResultsDisplayProps) {
  const { grade, color } = getGrade(score.percentage);
  const [activeTab, setActiveTab] = useState<"overview" | "review">("overview");

  const wrongAnswers = answers.filter(a => !a.isCorrect);
  const correctAnswers = answers.filter(a => a.isCorrect);
  const skippedAnswers = answers.filter(a => a.userAnswer === null);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Score hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card-bg border border-card-border rounded-2xl p-6 text-center space-y-4"
        >
          <p className="text-muted text-sm">Quiz Completed · {topic} · {difficulty}</p>
          <div className="flex items-center justify-center gap-8">
            <div>
              <p className={`text-6xl font-black ${color}`}>{grade}</p>
              <p className="text-xs text-muted mt-1">Grade</p>
            </div>
            <div className="w-px h-16 bg-card-border" />
            <div>
              <p className="text-5xl font-black text-foreground">{score.percentage}%</p>
              <p className="text-xs text-muted mt-1">Score</p>
            </div>
            <div className="w-px h-16 bg-card-border" />
            <div>
              <p className="text-3xl font-bold text-foreground">{score.correctAnswers}/{score.total}</p>
              <p className="text-xs text-muted mt-1">Correct</p>
            </div>
          </div>

          <div className="flex justify-center gap-6 pt-2">
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-semibold">{score.correctAnswers}</span>
              <span className="text-muted">correct</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-semibold">{score.wrongAnswers}</span>
              <span className="text-muted">wrong</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <MinusCircle className="w-4 h-4 text-muted" />
              <span className="text-muted font-semibold">{score.skipped}</span>
              <span className="text-muted">skipped</span>
            </div>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
            Level: {level}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-card-bg border border-card-border rounded-xl p-1">
          {(["overview", "review"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab === "review" ? `Question Review (${answers.length})` : "Overview"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Category performance */}
            {Object.keys(categoryPerformance).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-4"
              >
                <h2 className="font-semibold text-foreground">Category Performance</h2>
                <div className="space-y-3">
                  {Object.entries(categoryPerformance).map(([cat, data]: [string, any]) => (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{cat}</span>
                        <span className="text-muted">{data.correct}/{data.total} · {data.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${data.percentage >= 80 ? "bg-green-500" : data.percentage >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${data.percentage}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Strengths & Weaknesses */}
            {(insights.strengths.length > 0 || insights.weaknesses.length > 0) && (
              <div className="grid md:grid-cols-2 gap-4">
                {insights.strengths.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5"
                  >
                    <h3 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Strengths
                    </h3>
                    <ul className="space-y-1.5">
                      {insights.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-green-600 dark:text-green-300 flex gap-2">
                          <span className="text-green-500">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {insights.weaknesses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5"
                  >
                    <h3 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Areas to Improve
                    </h3>
                    <ul className="space-y-1.5">
                      {insights.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-red-600 dark:text-red-300 flex gap-2">
                          <span className="text-red-500">•</span>{w}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-card-bg border border-card-border rounded-2xl p-5"
              >
                <h3 className="font-semibold text-foreground mb-2">Feedback</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{feedback}</p>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === "review" && (
          <div className="space-y-4">
            {answers.length === 0 ? (
              <div className="text-center py-12 text-muted">No answer data available.</div>
            ) : (
              <>
                {/* Filter summary */}
                <div className="flex gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500">
                    {wrongAnswers.length} wrong
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-500">
                    {correctAnswers.length} correct
                  </span>
                  {skippedAnswers.length > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-card-bg border border-card-border text-muted">
                      {skippedAnswers.length} skipped
                    </span>
                  )}
                </div>

                {/* All questions */}
                <div className="space-y-3">
                  {answers.map((answer, i) => (
                    <AnswerCard key={answer.questionId ?? i} answer={answer} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex gap-3 justify-center pt-2 pb-8"
        >
          <Link
            href="/dashboard/skill-mastery"
            className="px-6 py-2.5 rounded-xl bg-card-bg hover:bg-body-bg text-foreground border border-card-border text-sm font-medium transition"
          >
            Take Another Quiz
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition"
          >
            Back to Dashboard
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
