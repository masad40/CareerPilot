"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import { useState } from "react";

interface QuizConfiguratorProps {
  topic: string;
  onBack: () => void;
  onStart: (difficulty: string, questionCount: number) => void;
}

export default function QuizConfigurator({ topic, onBack, onStart }: QuizConfiguratorProps) {
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [questionCount, setQuestionCount] = useState(20);

  const difficultyLevels = [
    { name: "Basic", description: "Great for beginners", icon: "🟢" },
    { name: "Intermediate", description: "For intermediate learners", icon: "🟡" },
    { name: "Advanced", description: "For advanced learners", icon: "🔴" },
    { name: "Mixed", description: "Random difficulty", icon: "🎲" },
  ];

  const questionOptions = [
    { count: 15, time: "10 mins" },
    { count: 20, time: "15 mins" },
    { count: 30, time: "20 mins" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-3xl font-bold text-foreground">Configure your quiz</h2>
        <p className="text-muted mt-2">
          Topic: <span className="text-primary font-medium">{topic}</span>
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Select Difficulty Level</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {difficultyLevels.map((level) => (
            <motion.button
              key={level.name}
              onClick={() => setDifficulty(level.name)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                difficulty === level.name
                  ? "bg-primary/10 border-primary"
                  : "bg-card-bg border-card-border hover:border-primary/40"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{level.icon}</span>
                <div>
                  <p className="font-semibold text-foreground">{level.name}</p>
                  <p className="text-sm text-muted">{level.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Number of Questions</h3>
        <div className="grid grid-cols-3 gap-3">
          {questionOptions.map((option) => (
            <motion.button
              key={option.count}
              onClick={() => setQuestionCount(option.count)}
              className={`p-4 rounded-lg border-2 transition ${
                questionCount === option.count
                  ? "bg-primary/10 border-primary"
                  : "bg-card-bg border-card-border hover:border-primary/40"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-2xl font-bold text-foreground">{option.count}</p>
              <p className="text-xs text-muted mt-1 flex items-center gap-1">
                <Zap className="w-3 h-3" /> {option.time}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        onClick={() => onStart(difficulty, questionCount)}
        className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold flex items-center justify-center gap-2 transition"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Zap className="w-5 h-5" /> Start Quiz ({questionCount} questions,{" "}
        {questionCount === 15 ? "10" : questionCount === 20 ? "15" : "20"} mins)
      </motion.button>
    </motion.div>
  );
}
