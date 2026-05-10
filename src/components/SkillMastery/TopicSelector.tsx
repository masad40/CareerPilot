"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader } from "lucide-react";
import { useState } from "react";

interface TopicSelectorProps {
  onTopicSelect: (topic: string) => void;
}

export default function TopicSelector({ onTopicSelect }: TopicSelectorProps) {
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedTopics = ["React", "JavaScript", "TypeScript", "Node.js", "System Design", "SQL", "Python", "CSS"];

  const handleTopicSubmit = (topic: string) => {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => onTopicSelect(topic), 300);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-foreground">Skill Mastery</h2>
        <p className="text-muted">Test your knowledge with AI-powered quizzes</p>
      </div>

      <div className="space-y-3">
        <label className="text-foreground/80 font-medium block">What would you like to learn?</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyPress={(e) => { if (e.key === "Enter") handleTopicSubmit(customTopic); }}
            placeholder="e.g., React Hooks, Database Design..."
            className="flex-1 px-4 py-3 rounded-lg bg-body-bg border border-card-border text-foreground placeholder:text-muted focus:border-primary focus:outline-none transition"
          />
          <button
            onClick={() => handleTopicSubmit(customTopic)}
            disabled={loading || !customTopic.trim()}
            className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Start
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-muted text-sm">Or choose a suggested topic:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {suggestedTopics.map((topic, i) => (
            <motion.button
              key={topic}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleTopicSubmit(topic)}
              disabled={loading}
              className="p-3 rounded-lg bg-card-bg hover:bg-body-bg text-foreground border border-card-border hover:border-primary transition disabled:opacity-50"
            >
              {topic}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
