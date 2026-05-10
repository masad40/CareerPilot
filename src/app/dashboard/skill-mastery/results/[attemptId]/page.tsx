"use client";

import ResultsDisplay from "@/components/SkillMastery/ResultsDisplay";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AttemptResultsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const attemptId = params.attemptId as string;

  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Check sessionStorage cache first (set by QuizzesHistorySection)
        const cached = sessionStorage.getItem(`attempt_db_${attemptId}`);
        if (cached) {
          setAttempt(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // 2. Fetch from DB
        if (!user) { setError("Please log in to view results."); setLoading(false); return; }
        const token = await user.getIdToken();
        const res = await fetch(`/api/quiz/submit?id=${attemptId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.attempt) {
          setAttempt(data.attempt);
        } else {
          setError("Results not found.");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [attemptId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">{error || "Results not found"}</p>
          <button onClick={() => router.push("/dashboard/skill-mastery")}
            className="px-6 py-2 rounded-lg bg-primary text-white transition">
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
