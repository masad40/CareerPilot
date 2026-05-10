"use client";

import { useEffect, useState } from "react";
import { ExpandableGrid } from "./components/ExpandableWrapper";
import { BookOpen, Calendar, CheckCircle2, XCircle, Loader, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface QuizAttempt {
  _id: any;
  topic: string;
  difficulty: string;
  score: { percentage: number; correctAnswers: number; total: number; obtained?: number; wrongAnswers?: number };
  userLevelAfter: string;
  createdAt: string;
}

function getDifficultyColor(d: string) {
  if (d === "Hard") return "text-red-500 bg-red-500/10 border-red-500/30";
  if (d === "Medium") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
  return "text-green-500 bg-green-500/10 border-green-500/30";
}

function getScoreColor(pct: number) {
  if (pct >= 80) return "text-green-500";
  if (pct >= 60) return "text-yellow-500";
  return "text-red-500";
}

function getBarColor(pct: number) {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

const QuizzesHistorySection = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/quiz/submit", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setQuizzes(data.attempts);
      } catch (e) {
        console.error("[QuizHistory]", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const getAttemptId = (quiz: QuizAttempt) =>
    quiz._id?.$oid ?? quiz._id?.toString?.() ?? String(quiz._id);

  const viewResults = (quiz: QuizAttempt) => {
    const id = getAttemptId(quiz);
    sessionStorage.setItem(`attempt_db_${id}`, JSON.stringify(quiz));
    router.push(`/dashboard/skill-mastery/results/${id}`);
  };

  if (loading) {
    return (
      <section className="py-8 flex justify-center">
        <Loader className="w-6 h-6 text-primary animate-spin" />
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Quizzes History</h2>
          <p className="text-xs text-muted">Track your progress and retake quizzes to improve</p>
        </div>
        <span className="text-[11px] font-medium text-muted bg-body-bg px-2.5 py-1 rounded-md border border-card-border uppercase tracking-wider">
          {quizzes.length} Completed
        </span>
      </div>

      <ExpandableGrid
        items={quizzes}
        limit={3}
        emptyMessage="You haven't taken any quizzes yet."
        renderItem={(quiz: QuizAttempt) => {
          const pct = quiz.score?.percentage ?? 0;
          const correct = quiz.score?.correctAnswers ?? (quiz.score as any)?.obtained ?? 0;
          const wrong = quiz.score?.wrongAnswers ?? ((quiz.score?.total ?? 0) - correct);
          const total = quiz.score?.total ?? 0;
          const topic = quiz.topic ?? (quiz as any)?.quizTemplateId ?? "Quiz";
          const difficulty = quiz.difficulty ?? "—";
          const level = quiz.userLevelAfter ?? (quiz as any)?.level ?? "";
          const id = getAttemptId(quiz);

          return (
            <div
              key={id}
              className="flex flex-col bg-card-bg border border-card-border rounded-2xl p-5 hover:border-primary/40 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-foreground line-clamp-1">{topic}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <Calendar className="w-3 h-3 shrink-0" />
                    {new Date(quiz.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
              </div>

              {/* Score row */}
              <div className="flex items-center gap-3 mb-3">
                <p className={`text-3xl font-black ${getScoreColor(pct)}`}>{pct}%</p>
                <div className="text-xs text-muted space-y-0.5">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />{correct} correct
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-3 h-3 text-red-500" />{wrong} wrong
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-card-border rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full ${getBarColor(pct)}`} style={{ width: `${pct}%` }} />
              </div>

              {/* Level + total */}
              <div className="flex items-center gap-2 mb-4">
                {level && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold">
                    {level}
                  </span>
                )}
                {total > 0 && <span className="text-[10px] text-muted">{total} questions</span>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-card-border">
                <button
                  onClick={() => viewResults(quiz)}
                  className="flex-1 flex items-center justify-center gap-2 text-[12px] font-bold text-foreground/70 bg-body-bg hover:bg-primary/5 hover:text-primary py-2 rounded-lg transition-all border border-card-border hover:border-primary/30"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Results
                </button>
                <button
                  onClick={() => router.push("/dashboard/skill-mastery")}
                  className="flex items-center justify-center gap-1.5 px-3 h-9 bg-primary/10 border border-primary/30 rounded-lg text-[11px] font-bold text-primary hover:bg-primary/20 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Retake
                </button>
              </div>
            </div>
          );
        }}
      />
    </section>
  );
};

export default QuizzesHistorySection;
