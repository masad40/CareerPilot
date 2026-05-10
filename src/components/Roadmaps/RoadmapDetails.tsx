"use client";

import { useState, useMemo } from "react";
import StatCard from "./components/StatCard";
import ResourcesSection from "../../components/Roadmaps/components/ResourceSection";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    ChevronDown,
    Code2,
    Sparkles,
    Layers,
    Check,
    Trophy,
    Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

interface RoadmapDetailsProps {
    roadmap: any;
    roadmapId: string;
    completedTopics: Array<string>;
}

// Animation Variants for staggered revealing
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 },
    },
} as const;

export default function RoadmapDetails({
    roadmap,
    roadmapId,
    completedTopics,
}: RoadmapDetailsProps) {
    const { user } = useAuth();
    const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]));
    const [completed, setCompleted] = useState<Set<string>>(
        new Set(completedTopics || []),
    );
    const [isSyncing, setIsSyncing] = useState(false);

    if (!roadmap) return null;

    const toggleTopic = async (topicId: string) => {
        const isAdding = !completed.has(topicId);

        const prevCompleted = new Set(completed);

        const newCompleted = new Set(completed);
        if (isAdding) newCompleted.add(topicId);
        else newCompleted.delete(topicId);

        setCompleted(newCompleted);
        setIsSyncing(true);

        try {
            await axios.post("/api/roadmaps/progress", {
                userId: user?.uid,
                roadmapId,
                topicId,
                action: isAdding ? "add" : "remove",
            });
        } catch (err) {
            console.error(err);

            setCompleted(prevCompleted);

            toast.error("Connection error: Progress not saved.");
        } finally {
            setIsSyncing(false);
        }
    };

    const togglePhase = (num: number) => {
        const newSet = new Set(openPhases);
        newSet.has(num) ? newSet.delete(num) : newSet.add(num);
        setOpenPhases(newSet);
    };

    const totalSubtopics = useMemo(() => {
        return roadmap.phases.reduce(
            (acc: number, phase: any) =>
                acc +
                phase.topics.reduce(
                    (tAcc: number, topic: any) =>
                        tAcc + (topic.subtopics?.length || 0),
                    0,
                ),
            0,
        );
    }, [roadmap]);

    const progressPercent =
        totalSubtopics > 0
            ? Math.round((completed.size / totalSubtopics) * 100)
            : 0;

    return (
        <div className="relative bg-background overflow-hidden py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            {/* Animated Background Glows */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 -left-24 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 -right-24 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="max-w-6xl mx-auto space-y-10 relative z-10">
                {/* Header Glass Card */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="relative group overflow-hidden bg-card-bg backdrop-blur-2xl border border-card-border rounded-3xl p-8 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <motion.h1
                        variants={itemVariants}
                        className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold mb-3 text-foreground italic"
                    >
                        <Sparkles className="w-8 h-8 text-primary" />
                        {roadmap.skill}
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-muted text-base sm:text-lg leading-relaxed max-w-3xl"
                    >
                        {roadmap.roadmap_summary?.goal}
                    </motion.p>

                    {/* Stats Grid */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8"
                    >
                        <motion.div
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <StatCard
                                label="Level"
                                value={roadmap.user_profile.current_level}
                            />
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <StatCard
                                label="Hours/Day"
                                value={roadmap.user_profile.hours_per_day}
                            />
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <StatCard
                                label="Weeks"
                                value={roadmap.user_profile.total_weeks}
                            />
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <StatCard
                                label="Total Est."
                                value={`${roadmap.user_profile.total_estimated_hours}h`}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-8 bg-body-bg border border-card-border p-5 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex justify-between items-end mb-3 relative z-10">
                            <div className="flex justify-center">
                                <div>
                                    <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold">
                                        <Target className="w-4 h-4" />
                                        Your Mastery
                                    </p>
                                    <div className="flex justify-center items-center gap-3">
                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                                            {progressPercent}% Completed
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
                                            />
                                            <span className="text-[10px] text-muted uppercase tracking-widest">
                                                {isSyncing ? "Syncing..." : "Cloud Synced"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <motion.span
                                key={completed.size}
                                initial={{ scale: 1.2, color: "#ED8936" }}
                                animate={{ scale: 1 }}
                                className="text-muted text-sm font-mono"
                            >
                                {completed.size}/{totalSubtopics} topics
                            </motion.span>
                        </div>
                        <div className="w-full bg-card-border h-3 sm:h-4 rounded-full overflow-hidden border border-card-border relative z-10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{
                                    duration: 1.2,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="h-full bg-gradient-to-r from-primary via-orange-400 to-primary relative"
                            >
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Phases Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-xl sm:text-2xl font-bold text-foreground/90 px-2 flex items-center gap-3"
                    >
                        <span className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
                        Learning Path
                        <span className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/50" />
                    </motion.h2>

                    {roadmap.phases.map((phase: any, index: number) => (
                        <motion.div
                            variants={itemVariants}
                            key={phase.phase_number}
                            layout
                            className="group bg-card-bg hover:bg-body-bg backdrop-blur-md border border-card-border hover:border-primary/30 rounded-2xl transition-colors duration-500 shadow-lg overflow-hidden"
                        >
                            {/* Phase Header */}
                            <div
                                className="p-4 sm:p-6 cursor-pointer flex justify-between items-center"
                                onClick={() => togglePhase(phase.phase_number)}
                            >
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <motion.div
                                        whileHover={{ rotate: 5, scale: 1.05 }}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center font-bold text-lg sm:text-xl shadow-[0_0_20px_rgba(237,137,54,0.2)] text-white border border-primary/20"
                                    >
                                        {phase.phase_number}
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {phase.phase_title}
                                        </h3>
                                        <p className="text-primary/70 text-xs sm:text-sm font-medium flex items-center gap-1 mt-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {phase.duration_weeks} Weeks
                                        </p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{
                                        rotate: openPhases.has(
                                            phase.phase_number,
                                        )
                                            ? 180
                                            : 0,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 20,
                                    }}
                                    className="w-8 h-8 rounded-full border border-card-border bg-body-bg flex items-center justify-center text-muted group-hover:text-foreground group-hover:bg-card-bg transition-colors"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </motion.div>
                            </div>

                            <AnimatePresence initial={false}>
                                {openPhases.has(phase.phase_number) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.04, 0.62, 0.23, 0.98],
                                        }}
                                        className="border-t border-card-border"
                                    >
                                        <div className="px-4 sm:px-6 pb-6 sm:pb-8 pt-4">
                                            <div className="flex flex-col gap-6">
                                                {/* Topics */}
                                                {phase.topics.map(
                                                    (
                                                        topic: any,
                                                        tIndex: number,
                                                    ) => (
                                                        <div
                                                            key={tIndex}
                                                            className="relative pl-5 border-l-2 border-primary/20"
                                                        >
                                                            <div className="absolute top-1.5 -left-[5px] w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(237,137,54,0.5)]" />
                                                            <h4 className="font-bold text-primary mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                                                                {
                                                                    topic.topic_name
                                                                }
                                                            </h4>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                                {topic.subtopics.map(
                                                                    (
                                                                        sub: string,
                                                                        sIndex: number,
                                                                    ) => {
                                                                        const id = `${phase.phase_number}-${tIndex}-${sIndex}`;
                                                                        const isDone =
                                                                            completed.has(
                                                                                id,
                                                                            );

                                                                        return (
                                                                            <motion.label
                                                                                whileHover={{
                                                                                    scale: 1.02,
                                                                                }}
                                                                                whileTap={{
                                                                                    scale: 0.98,
                                                                                }}
                                                                                key={
                                                                                    id
                                                                                }
                                                                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group/item ${
                                                                                    isDone
                                                                                        ? "bg-primary/10 border-primary/30"
                                                                                        : "bg-body-bg border-card-border hover:border-primary/20"
                                                                                }`}
                                                                            >
                                                                                <div className="relative flex items-center justify-center mt-0.5">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                            isDone
                                                                                        }
                                                                                        onChange={() =>
                                                                                            toggleTopic(
                                                                                                id,
                                                                                            )
                                                                                        }
                                                                                        className="peer w-5 h-5 rounded-md border-2 border-card-border bg-body-bg appearance-none cursor-pointer checked:bg-primary checked:border-primary transition-all"
                                                                                    />
                                                                                    <Check
                                                                                        className={`absolute w-3.5 h-3.5 text-white pointer-events-none transition-transform duration-300 ${isDone ? "scale-100" : "scale-0"}`}
                                                                                    />
                                                                                </div>
                                                                                <span
                                                                                    className={`text-sm sm:text-base font-medium transition-colors duration-300 ${
                                                                                        isDone
                                                                                            ? "text-muted line-through"
                                                                                            : "text-foreground/80 group-hover/item:text-foreground"
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        sub
                                                                                    }
                                                                                </span>
                                                                            </motion.label>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}

                                                {/* Phase Projects & Resources */}
                                                <div className="grid md:grid-cols-2 gap-4 pt-6 mt-2 border-t border-card-border">
                                                    {/* Phase Projects */}
                                                    <div className="bg-gradient-to-br from-primary/5 to-transparent p-5 sm:p-6 rounded-2xl border border-primary/20">
                                                        <h3 className="text-primary font-bold mb-4 flex items-center gap-2 text-lg">
                                                            <Code2 className="w-5 h-5" />{" "}
                                                            Phase Projects
                                                        </h3>

                                                        {phase.projects?.map(
                                                            (
                                                                proj: any,
                                                                i: number,
                                                            ) => (
                                                                <motion.div
                                                                    whileHover={{ y: -4 }}
                                                                    key={i}
                                                                    className="bg-card-bg w-full border border-card-border rounded-xl p-5 mb-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                                                                >
                                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                                        <div className="flex-1">
                                                                            <h4 className="text-lg font-bold text-foreground mb-1">
                                                                                {proj.project_title}
                                                                            </h4>
                                                                            <p className="text-muted text-sm leading-relaxed">
                                                                                {proj.description}
                                                                            </p>
                                                                        </div>
                                                                        <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap font-medium flex items-center gap-1.5">
                                                                            <Clock className="w-3.5 h-3.5" />{" "}
                                                                            {
                                                                                proj.estimated_hours
                                                                            }{" "}
                                                                            hrs
                                                                        </span>
                                                                    </div>

                                                                    {proj
                                                                        .key_features
                                                                        ?.length >
                                                                        0 && (
                                                                        <div className="mt-5">
                                                                            <h5 className="text-xs font-bold text-primary/80 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                                                                                <Sparkles className="w-3.5 h-3.5" />{" "}
                                                                                Key
                                                                                Features
                                                                            </h5>
                                                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground/80 text-sm">
                                                                                {proj.key_features.map(
                                                                                    (
                                                                                        feature: string,
                                                                                        fIndex: number,
                                                                                    ) => (
                                                                                        <li
                                                                                            key={
                                                                                                fIndex
                                                                                            }
                                                                                            className="flex items-start gap-2"
                                                                                        >
                                                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                                                            {
                                                                                                feature
                                                                                            }
                                                                                        </li>
                                                                                    ),
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    )}

                                                                    {proj
                                                                        .skills_applied
                                                                        ?.length >
                                                                        0 && (
                                                                        <div className="mt-5 pt-4 border-t border-card-border">
                                                                            <h5 className="text-xs font-bold text-primary/80 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                                                                                <Layers className="w-3.5 h-3.5" />{" "}
                                                                                Skills
                                                                                Applied
                                                                            </h5>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {proj.skills_applied.map(
                                                                                    (
                                                                                        skill: string,
                                                                                        sIndex: number,
                                                                                    ) => (
                                                                                        <span
                                                                                            key={
                                                                                                sIndex
                                                                                            }
                                                                                            className="text-xs px-2.5 py-1 rounded-md bg-card-bg text-foreground/70 border border-card-border hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
                                                                                        >
                                                                                            {
                                                                                                skill
                                                                                            }
                                                                                        </span>
                                                                                    ),
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </motion.div>
                                                            ),
                                                        )}
                                                    </div>

                                                    <div className="bg-card-bg p-5 sm:p-6 rounded-2xl border border-card-border h-fit">
                                                        <ResourcesSection
                                                            resources={
                                                                phase.resources
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Final Capstone */}
                {roadmap.final_capstone_project && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative group p-[1px] rounded-3xl overflow-hidden mt-12"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#f59e0b_360deg)] opacity-20 group-hover:opacity-100 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 opacity-50" />

                        <div className="relative bg-card-bg backdrop-blur-3xl rounded-[23px] p-8 sm:p-10 border border-card-border hover:border-amber-500/30 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)] border border-amber-500/20 shrink-0"
                                >
                                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                                </motion.div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                        <h2 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-widest">
                                            Final Capstone
                                        </h2>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                        {roadmap.final_capstone_project.title}
                                    </h3>
                                    <p className="text-muted max-w-2xl text-base sm:text-lg leading-relaxed">
                                        {roadmap.final_capstone_project.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
