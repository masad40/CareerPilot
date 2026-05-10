"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnalysisLoaderProps {
    progress: number;
}

export default function AnalysisLoader({ progress }: AnalysisLoaderProps) {
    const [visualProgress, setVisualProgress] = useState(0);

    const loadingTexts = [
        "Analyzing your responses...",
        "Evaluating communication skills...",
        "Comparing with industry standards...",
        "Generating personalized feedback...",
    ];

    useEffect(() => {
        if (progress >= 100) {
            setVisualProgress(100);
            return;
        }

        const interval = setInterval(() => {
            setVisualProgress((prev) => {
                if (prev >= 97) return prev;

                const increment = Math.random() * 3 + 2;
                return Math.min(prev + increment, 95);
            });
        }, 250);

        return () => clearInterval(interval);
    }, [progress]);

    const textIndex = Math.min(
        Math.floor((visualProgress / 100) * loadingTexts.length),
        loadingTexts.length - 1,
    );

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
            {/* Animated Hexagon/Orb */}
            <div className="relative mb-12">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-24 h-24 border-2 border-primary/30 rounded-2xl neon-glow-primary"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0 w-24 h-24 border-2 border-white/10 rounded-2xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl animate-pulse">
                        psychology
                    </span>
                </div>
            </div>

            {/* Progress Text */}
            <div className="text-center space-y-4">
                <motion.h2
                    key={textIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xl font-bold tracking-tight text-foreground"
                >
                    {loadingTexts[textIndex]}
                </motion.h2>

                <div className="w-64 h-1.5 bg-card-border rounded-full overflow-hidden border border-card-border">
                    <motion.div
                        className="h-full bg-primary neon-glow-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${visualProgress}%` }}
                        transition={{
                            ease: visualProgress === 100 ? "circOut" : "linear",
                            duration: visualProgress === 100 ? 0.5 : 0.2,
                        }}
                    />
                </div>

                <p className="text-primary font-mono text-sm tracking-widest uppercase">
                    {Math.round(visualProgress)}% Complete
                </p>
            </div>
        </div>
    );
}
