"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
    CheckCircle2,
    AlertCircle,
    Trophy,
    TrendingUp,
    Target,
    Zap,
    ArrowRight,
    ShieldCheck,
    Star,
    Sparkles,
} from "lucide-react";

const containerVars = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const FeedbackPage = () => {
    const { id } = useParams();

    const {
        data: feedbackObj,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["feedbackObj", id],
        queryFn: async () => {
            const res = await axios.get(`/api/interview/feedback/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const feedback = feedbackObj?.feedback
        ? JSON.parse(feedbackObj.feedback)
        : null;

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="size-16 bg-indigo-500/20 rounded-full blur-xl absolute"
                />
                <p className="text-slate-400 font-medium tracking-widest animate-pulse uppercase text-xs">
                    Generating Report
                </p>
            </div>
        );
    }

    if (error || !feedback) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-400 bg-[#050505]">
                <div className="text-center space-y-4">
                    <AlertCircle className="size-12 mx-auto text-red-500/50" />
                    <p>Feedback data could not be retrieved.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden pb-20">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full opacity-50" />

            <motion.div
                variants={containerVars}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto p-6 lg:p-12 relative z-10 space-y-10"
            >
                {/* ================= HERO SECTION ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        variants={itemVars}
                        className="lg:col-span-1 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative group"
                    >
                        <Trophy className="size-6 text-indigo-400 mb-4 opacity-50" />
                        <span className="text-[10px] uppercase tracking-[0.4em] text-indigo-400/70 mb-6 font-black">
                            Performance Score
                        </span>

                        <div className="relative size-52 flex items-center justify-center mb-8">
                            <svg className="size-full transform -rotate-90">
                                <circle
                                    cx="104"
                                    cy="104"
                                    r="94"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="transparent"
                                    className="text-white/5"
                                />
                                <motion.circle
                                    cx="104"
                                    cy="104"
                                    r="94"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={590}
                                    initial={{ strokeDashoffset: 590 }}
                                    animate={{
                                        strokeDashoffset:
                                            590 -
                                            (590 *
                                                (feedback?.overallScore ?? 0)) /
                                                100,
                                    }}
                                    transition={{
                                        duration: 2,
                                        ease: "easeOut",
                                    }}
                                    strokeLinecap="round"
                                    className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-7xl font-black tracking-tighter text-white">
                                    {feedback?.overallScore ?? 0}
                                </span>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Index
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed italic px-4">
                            "
                            {feedback?.overallPerformanceSummary?.split(".")[0]}
                            ."
                        </p>
                    </motion.div>

                    <motion.div
                        variants={itemVars}
                        className="lg:col-span-2 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[2.5rem] p-8 lg:p-12 flex flex-col justify-center relative"
                    >
                        <Sparkles className="absolute top-10 right-10 size-6 text-indigo-500/30 animate-pulse" />
                        <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
                            Executive{" "}
                            <span className="text-indigo-500">Analysis.</span>
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed mb-8 font-light max-w-2xl">
                            {feedback?.overallPerformanceSummary}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {feedback?.tags?.map((tag: string, idx: number) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ================= CATEGORY GRID (Uncollapsed by default) ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <Target className="size-5 text-indigo-400" />
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                Competency Matrix
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {feedback?.categoryScores?.map(
                                (cat: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        variants={itemVars}
                                        className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest w-3/4 leading-tight">
                                                {cat?.category}
                                            </h3>
                                            <span
                                                className={`text-lg font-black ${cat?.score >= 80 ? "text-emerald-400" : "text-indigo-400"}`}
                                            >
                                                {cat?.score}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 mb-5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{
                                                    width: `${cat?.score}%`,
                                                }}
                                                className={`h-full ${cat?.score >= 80 ? "bg-emerald-500" : "bg-indigo-500"}`}
                                            />
                                        </div>
                                        {/* UNCOLLAPSED TEXT: No line-clamp, full opacity */}
                                        <p className="text-[13px] text-slate-400 leading-relaxed font-normal">
                                            {cat?.justification}
                                        </p>
                                    </motion.div>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            variants={itemVars}
                            className="bg-emerald-500/[0.02] border border-emerald-500/10 p-8 rounded-[2.5rem]"
                        >
                            <h3 className="text-emerald-400 font-bold mb-6 flex items-center gap-3 text-sm tracking-widest uppercase">
                                <Star className="size-4" /> Core Strengths
                            </h3>
                            <ul className="space-y-4">
                                {feedback?.strengths?.map(
                                    (s: string, i: number) => (
                                        <li
                                            key={i}
                                            className="flex gap-3 text-sm text-slate-300 items-start"
                                        >
                                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>{s}</span>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </motion.div>

                        <motion.div
                            variants={itemVars}
                            className="bg-amber-500/[0.02] border border-amber-500/10 p-8 rounded-[2.5rem]"
                        >
                            <h3 className="text-amber-400 font-bold mb-6 flex items-center gap-3 text-sm tracking-widest uppercase">
                                <TrendingUp className="size-4" /> Critical
                                Growth
                            </h3>
                            <ul className="space-y-4">
                                {feedback?.criticalImprovementAreas?.map(
                                    (s: string, i: number) => (
                                        <li
                                            key={i}
                                            className="flex gap-3 text-sm text-slate-300 items-start"
                                        >
                                            <Zap className="size-4 text-amber-500 shrink-0 mt-0.5" />
                                            <span>{s}</span>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* ================= STRATEGIC ROADMAP & FINAL VERDICT ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        variants={itemVars}
                        className="bg-white/[0.01] border border-white/5 p-8 lg:p-10 rounded-[2.5rem]"
                    >
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <ArrowRight className="size-5 text-indigo-500" />{" "}
                            Strategic Roadmap
                        </h2>
                        <div className="space-y-3">
                            {feedback?.actionableNextSteps?.map(
                                (step: string, i: number) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all"
                                    >
                                        <span className="text-xl font-black text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors">
                                            0{i + 1}
                                        </span>
                                        <p className="text-sm text-slate-300 leading-snug">
                                            {step}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVars} className="relative group">
                        <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] rounded-full opacity-50" />
                        <div className="relative h-full bg-indigo-600/10 border border-indigo-500/20 p-8 lg:p-12 rounded-[2.5rem] flex flex-col justify-between backdrop-blur-sm">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tighter">
                                    Final Verdict
                                </h2>
                                <p className="text-2xl text-indigo-100/90 leading-tight font-light italic">
                                    "{feedback?.finalVerdict}"
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-indigo-500/20 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">
                                        Readiness
                                    </p>
                                    <p className="text-slate-200 text-lg font-medium">
                                        {feedback?.readinessAssessment}
                                    </p>
                                </div>
                                <div className="size-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                                    <ShieldCheck className="text-indigo-400 size-6" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default FeedbackPage;
