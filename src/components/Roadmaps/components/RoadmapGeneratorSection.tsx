"use client";

import React from "react";
import { RoadmapGeneratorSectionProps } from "@/utils/interfaces";
import ExperienceLevelDropdown from "./ExpDropdown";
import { motion } from "framer-motion";
import { Sparkles, Clock, CalendarDays, BrainCircuit } from "lucide-react";

const RoadmapGeneratorSection: React.FC<RoadmapGeneratorSectionProps> = ({
    query,
    setQuery,
    currentLevel,
    setCurrentLevel,
    hours,
    setHours,
    duration,
    setDuration,
    handleGenerate,
    loading,
}) => {
    return (
        <section className="w-full max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
            >
                {/* Decorative Background Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />

                <div className="relative bg-card-bg backdrop-blur-2xl border border-card-border rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden">
                    <div className="space-y-10">
                        {/* ================= Skill Input ================= */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-primary" />
                                <label
                                    htmlFor="skill"
                                    className="block text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                                >
                                    Learning Objective
                                </label>
                            </div>

                            <div className="relative">
                                <textarea
                                    id="skill"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    rows={2}
                                    placeholder="Enter any skill, profession, or academic subject..."
                                    className="w-full bg-body-bg border border-card-border rounded-2xl px-6 py-5 text-xl text-foreground placeholder:text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none resize-none transition-all duration-300 shadow-inner"
                                />
                                <div className="absolute bottom-4 right-4 opacity-20">
                                    <Sparkles className="text-foreground w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        {/* ================= Configuration Inputs ================= */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Experience Level */}
                            <div className="space-y-4">
                                <ExperienceLevelDropdown
                                    currentLevel={currentLevel}
                                    setCurrentLevel={setCurrentLevel}
                                />
                            </div>

                            {/* Hours Per Day */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted" />
                                    <label
                                        htmlFor="hours"
                                        className="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                                    >
                                        Hours Per Day
                                    </label>
                                </div>
                                <input
                                    id="hours"
                                    type="number"
                                    min={1}
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    placeholder="e.g., 3"
                                    className="w-full bg-body-bg border border-card-border rounded-2xl px-6 py-4 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
                                />
                            </div>

                            {/* Duration */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-muted" />
                                    <label
                                        htmlFor="duration"
                                        className="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                                    >
                                        Duration (Weeks)
                                    </label>
                                </div>
                                <input
                                    id="duration"
                                    type="number"
                                    min={1}
                                    value={duration}
                                    onChange={(e) =>
                                        setDuration(e.target.value)
                                    }
                                    placeholder="e.g., 8"
                                    className="w-full bg-body-bg border border-card-border rounded-2xl px-6 py-4 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* ================= CTA ================= */}
                        <div className="flex flex-col items-center gap-4 pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGenerate}
                                disabled={loading}
                                className="relative group/btn min-w-[280px] overflow-hidden rounded-2xl"
                            >
                                {/* Button Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary transition-all duration-300 group-hover/btn:opacity-90" />

                                <div className="relative px-10 py-5 flex items-center justify-center gap-3">
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span className="text-white font-bold uppercase tracking-widest text-sm">
                                                Processing Intelligence
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-white font-bold uppercase tracking-widest text-sm">
                                                Compute Roadmap
                                            </span>
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 1.5,
                                                }}
                                            >
                                                <BrainCircuit className="w-4 h-4 text-white" />
                                            </motion.div>
                                        </>
                                    )}
                                </div>
                            </motion.button>

                            <p className="text-[10px] text-muted font-medium uppercase tracking-widest">
                                AI Engine: Gemini 3 Pro
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default RoadmapGeneratorSection;
