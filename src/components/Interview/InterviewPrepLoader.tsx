"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InterviewPrepLoaderProps {
    message?: string;
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
    onFinish?: () => void;
}

const tips = [
    "Research the company beforehand",
    "Prepare answers for common questions",
    "Dress appropriately for the interview",
    "Maintain good posture and eye contact",
    "Ask thoughtful questions at the end",
    "Practice STAR method for behavioral answers",
    "Keep your answers concise and structured",
    "Show enthusiasm and interest in the role",
    "Bring your resume and portfolio if needed",
    "Be punctual and respectful to everyone",
    "Practice active listening",
    "Know your strengths and weaknesses",
    "Prepare examples of past work or achievements",
    "Be honest about your experience",
    "Demonstrate problem-solving skills",
    "Research industry trends",
    "Understand the job description thoroughly",
    "Be ready to discuss your resume in detail",
    "Tailor your answers to the company values",
    "Use clear and confident language",
    "Avoid filler words like 'um' and 'like'",
    "Maintain a calm and confident tone",
    "Prepare for technical or skill-based questions",
    "Practice mock interviews with a friend",
    "Understand your potential career path",
    "Highlight teamwork and collaboration experiences",
    "Prepare questions about company culture",
    "Be polite and professional at all times",
    "Bring multiple copies of your resume",
    "Follow up with a thank-you email",
    "Show adaptability to change",
    "Be ready to discuss challenges you overcame",
    "Keep answers structured and on-topic",
    "Demonstrate leadership skills when appropriate",
    "Speak positively about past experiences",
    "Be self-aware and reflective",
    "Show willingness to learn",
    "Avoid negative language or criticism",
    "Be mindful of body language",
    "Have a good handshake (if in person)",
    "Know the names of key interviewers if possible",
    "Understand the company's competitors",
    "Be concise when answering questions",
    "Be authentic and genuine",
    "Practice time management during answers",
    "Have a clear closing statement or summary",
    "Show passion for the role and industry",
    "Handle unexpected questions gracefully",
    "Be prepared for virtual interview etiquette",
    "Maintain consistency in your story and experience",
];

const InterviewPrepLoader: React.FC<InterviewPrepLoaderProps> = ({
    message = "Architecting your session",
    progress,
    setProgress,
    loading,
    onFinish,
}) => {
    const [tipIndex, setTipIndex] = useState(0);

    // 1. Logic: Smoothly increment progress
    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                // Slower progress as it nears 100% for realism
                const diff = prev < 70 ? Math.random() * 8 : Math.random() * 2;
                return Math.min(prev + diff, 98); // Stall at 98 until loading is false
            });
        }, 400);

        return () => clearInterval(interval);
    }, [loading, setProgress]);

    // 2. Logic: Rotate tips with a fade
    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % tips.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence onExitComplete={onFinish}>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md"
                >
                    <div className="w-full max-w-lg px-6 flex flex-col items-center">
                        {/* Premium Abstract Loader */}
                        <div className="relative size-24 mb-12">
                            {/* Inner Glow */}
                            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />

                            {/* Rotating Ring */}
                            <svg className="size-full" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-white/5"
                                    strokeWidth="2"
                                />
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="var(--primary)" // Ensure --primary is in your tailwind/css
                                    strokeWidth="2"
                                    strokeDasharray="283"
                                    initial={{ strokeDashoffset: 283 }}
                                    animate={{
                                        strokeDashoffset:
                                            283 - (283 * progress) / 100,
                                    }}
                                    transition={{
                                        ease: "circOut",
                                        duration: 0.5,
                                    }}
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Percentage Indicator */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-mono text-foreground/50 tracking-tighter">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center space-y-2 mb-8">
                            <motion.h2
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-xl font-medium text-foreground tracking-tight"
                            >
                                {message}
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                    }}
                                >
                                    ...
                                </motion.span>
                            </motion.h2>

                            <div className="h-10 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={tipIndex}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.4 }}
                                        className="text-sm text-muted max-w-sm leading-relaxed"
                                    >
                                        <span className="text-primary/60 mr-2">
                                            Tip:
                                        </span>
                                        {tips[tipIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Horizontal Track (The "Modern" Progress) */}
                        <div className="w-64 h-[1px] bg-card-border relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "linear",
                                }}
                            />
                        </div>

                        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">
                            AI Engine Initializing
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InterviewPrepLoader;
