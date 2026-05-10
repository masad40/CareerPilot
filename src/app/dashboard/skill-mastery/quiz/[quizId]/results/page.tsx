"use client";

import ResultsDisplay from "@/components/SkillMastery/ResultsDisplay";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const quizId = params.quizId as string;
  // Optional: pass ?attemptId=<mongoId> to load directly from DB
  const attemptId = searchParams.get("attemptId");

  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Try sessionStorage first (just-completed quiz)
        const cached = sessionStorage.getItem(`attempt_${quizId}`);
        if (cached) {
          setAttempt(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // 2. Try localStorage history (has DB _id stored)
        const history = JSON.parse(localStorage.getItem("quiz_history") || "[]");
        const entry = history.find((e: any) => e.id === quizId);
        const dbId = attemptId ?? entry?.dbId;

        if (dbId && user) {
          const token = await user.getIdToken();
          const res = await fetch(`/api/quiz/submit?id=${dbId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success && data.attempt) {
            setAttempt(data.attempt);
            setLoading(false);
            return;
          }
        }

        // 3. If entry exists in localStorage with full data, use it
        if (entry) {
          setAttempt(entry);
          setLoading(false);
          return;
        }

        setError("Results not found. Please retake the quiz.");
        setLoading(false);
      } catch (err) {
        console.error("Error loading results:", err);
        setError("Failed to load results");
        setLoading(false);
      }
    };
    load();
  }, [quizId, attemptId, user]);

  // Save DB id to localStorage history when results load
  useEffect(() => {
    if (!attempt) return;
    const history = JSON.parse(localStorage.getItem("quiz_history") || "[]");
    const idx = history.findIndex((e: any) => e.id === quizId);
    if (idx !== -1 && attempt._id && !history[idx].dbId) {
      history[idx].dbId = attempt._id?.toString?.() ?? String(attempt._id);
      localStorage.setItem("quiz_history", JSON.stringify(history));
    }
  }, [attempt, quizId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">{error || "Results not found"}</p>
          <button onClick={() => router.push("/dashboard/skill-mastery")}
            className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition">
            Back to Skill Mastery
          </button>
        </div>
      </div>
    );
  }

  return (
    <ResultsDisplay
      score={attempt.score}
      topic={attempt.topic}
      difficulty={attempt.difficulty}
      categoryPerformance={attempt.categoryWisePerformance || {}}
      insights={attempt.insights || { strengths: [], weaknesses: [], recommendedTopics: [] }}
      feedback={attempt.feedback || ""}
      level={attempt.userLevelAfter || "Beginner"}
      answers={attempt.answers || []}
    />
  );
}
