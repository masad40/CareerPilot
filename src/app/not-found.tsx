"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] overflow-hidden px-6">
            {/* Background Ambient Orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 text-center">
                {/* Floating 404 Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1
                        animate={{ y: [0, -15, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/50 to-transparent opacity-20 select-none"
                    >
                        404
                    </motion.h1>
                </motion.div>

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="-mt-20 md:-mt-32 backdrop-blur-xl glass-card border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-red-400">
                            Navigation Error
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                        Lost in the{" "}
                        <span className="text-primary">Career Cloud?</span>
                    </h2>

                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                        The page you are looking for has been moved, deleted, or
                        never existed in this timeline. Let's get you back on
                        course.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <button className="w-full sm:w-auto bg-primary text-black px-8 py-3.5 rounded-2xl font-bold text-sm hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Return to Base
                            </button>
                        </Link>
                        <Link href="/dashboard/roadmap">
                            <button className="w-full sm:w-auto bg-white/5 text-white border border-white/10 px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all">
                                View Roadmaps
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Subtle Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 text-[10px] uppercase tracking-[0.4em] text-white font-medium"
            >
                CareerPilot AI • System Integrity: 99.9%
            </motion.p>
        </div>
    );
}
