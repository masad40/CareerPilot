"use client";

import Timer from "@/components/SkillMastery/Timer";
import { QuizQuestion } from "@/utils/interfaces";
import { motion } from "framer-motion";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface QuizPlayerProps {
  quizData: {
    _id: string;
    topic: string;
    difficulty: string;
    questions: QuizQuestion[];
    timeLimit: number;
  };
  onSubmit: (answers: any[]) => Promise<void>;
}

export default function QuizPlayer({ quizData, onSubmit }: QuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const questions = quizData.questions;
  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (timeRemaining <= 0) handleAutoSubmit();
  }, [timeRemaining]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswerSelect = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion]: optionId });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const submissionAnswers = questions.map((q, idx) => ({
      questionId: q.id, userAnswer: answers[idx] || null, timeSpent: 0,
    }));
    try { await onSubmit(submissionAnswers); } catch (error) { console.error("Auto-submit error:", error); }
  }, [questions, answers, onSubmit, isSubmitting]);

  const handleManualSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const submissionAnswers = questions.map((q, idx) => ({
      questionId: q.id, userAnswer: answers[idx] || null, timeSpent: 0,
    }));
    try { await onSubmit(submissionAnswers); } catch (error) {
      console.error("Submit error:", error);
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const isTimeWarning = timeRemaining < 300;

  if (showReview) {
    return (
      <ReviewPage
        questions={questions}
        answers={answers}
        onConfirm={handleManualSubmit}
        onBack={() => setShowReview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card-bg backdrop-blur-md border-b border-card-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{quizData.topic}</h2>
            <p className="text-sm text-muted">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <Timer timeRemaining={timeRemaining} isWarning={isTimeWarning} onTimeUp={handleAutoSubmit} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted text-right">{answeredCount} / {questions.length} answered</p>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <p className="text-sm text-primary font-medium">{currentQ.difficulty} • {currentQ.category}</p>
            <h3 className="text-2xl font-bold text-foreground leading-relaxed">{currentQ.question}</h3>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  answers[currentQuestion] === option.id
                    ? "bg-primary/10 border-primary"
                    : "bg-card-bg border-card-border hover:border-primary/40"
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    answers[currentQuestion] === option.id
                      ? "bg-primary border-primary"
                      : "border-muted"
                  }`}>
                    {answers[currentQuestion] === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-foreground">{option.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-3 justify-between items-center pt-6 border-t border-card-border">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2 rounded-lg bg-card-bg hover:bg-body-bg text-foreground border border-card-border disabled:opacity-50 flex items-center gap-2 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-2">
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-card-bg hover:bg-body-bg text-foreground border border-card-border flex items-center gap-2 transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowReview(true)}
                className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition"
              >
                Review & Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewPage({
  questions, answers, onConfirm, onBack,
}: {
  questions: QuizQuestion[];
  answers: { [key: number]: string };
  onConfirm: () => Promise<void>;
  onBack: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try { await onConfirm(); } catch (error) {
      console.error("Submit error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-2xl mx-auto pt-12 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-foreground">Review Your Answers</h2>
          <p className="text-muted">Check your progress before submitting</p>
        </div>

        <div className="bg-card-bg rounded-lg border border-card-border p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{answeredCount}</p>
              <p className="text-sm text-muted mt-1">Answered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{unansweredCount}</p>
              <p className="text-sm text-muted mt-1">Unanswered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-muted">{questions.length}</p>
              <p className="text-sm text-muted mt-1">Total</p>
            </div>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-500 font-medium">
                You have {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}
              </p>
              <p className="text-sm text-yellow-500/70 mt-1">
                You can still submit — unanswered questions will count as wrong.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-lg bg-card-bg hover:bg-body-bg text-foreground border border-card-border font-medium transition"
          >
            Back to Quiz
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
