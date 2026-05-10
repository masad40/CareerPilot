"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { useEffect } from "react";

interface TimerProps {
  timeRemaining: number;
  isWarning: boolean;
  onTimeUp: () => void;
}

export default function Timer({ timeRemaining, isWarning, onTimeUp }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isTimeUp = timeRemaining === 0;

  useEffect(() => {
    if (isTimeUp) onTimeUp();
  }, [isTimeUp, onTimeUp]);

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg transition ${
      isTimeUp
        ? "bg-red-500/20 border border-red-500 text-red-500"
        : isWarning
          ? "bg-yellow-500/20 border border-yellow-500 text-yellow-500 animate-pulse"
          : "bg-card-bg border border-card-border text-foreground"
    }`}>
      {isWarning && !isTimeUp && <AlertTriangle className="w-5 h-5" />}
      {!isWarning && !isTimeUp && <Clock className="w-5 h-5" />}
      <span>{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>
    </div>
  );
}
