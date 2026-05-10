"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Mic, Timer, Gauge, MessageSquareText, ArrowRight, ShieldCheck, Terminal, Sparkles } from "lucide-react";
import Link from "next/link";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function FeatureIcon({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-3 bg-body-bg border border-card-border rounded-xl p-3">
            <div className="text-primary">{icon}</div>
            <span className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider">{title}</span>
        </div>
    );
}

export default function MockInterviewFeatureSection() {
    return (
        <section className="py-24 px-6 bg-background overflow-hidden">
            <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[1fr_400px] items-stretch">
                {/* Left Card */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
                    className="group relative rounded-2xl glass-card p-8 md:p-12 overflow-hidden border border-card-border">
                    <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 blur-[50px]" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-card-bg border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(237,137,54,0.1)]">
                                <Mic className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] tracking-[0.3em] text-primary font-black uppercase">Module // v2.4</p>
                                <h3 className="text-3xl font-black text-foreground tracking-tight">
                                    Mock Interview <span className="text-foreground/40">Practice</span>
                                </h3>
                            </div>
                        </div>

                        <p className="text-muted max-w-xl leading-relaxed mb-8">
                            Simulate real interview rounds with a timer, difficulty scaling, and feedback that tells you what to fix next.
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-10">
                            <FeatureIcon icon={<Timer className="w-4 h-4" />} title="Timed Rounds" />
                            <FeatureIcon icon={<Gauge className="w-4 h-4" />} title="Adaptive AI" />
                            <FeatureIcon icon={<MessageSquareText className="w-4 h-4" />} title="Deep Feedback" />
                            <FeatureIcon icon={<ShieldCheck className="w-4 h-4" />} title="STAR Method" />
                        </div>

                        <Link href="/dashboard/interview">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="group/btn relative inline-flex items-center gap-3 rounded-xl px-8 py-4 overflow-hidden transition-all duration-500">
                                <div className="absolute inset-0 bg-card-bg backdrop-blur-md border border-card-border group-hover/btn:bg-primary/10 group-hover/btn:border-primary/30 transition-all duration-500 rounded-xl" />
                                <div className="relative z-10 flex items-center gap-3">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground group-hover/btn:text-primary transition-colors">
                                        Start Practice Session
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-primary group-hover/btn:translate-x-1 transition-transform duration-300" />
                                </div>
                            </motion.button>
                        </Link>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
                </motion.div>

                {/* Right Card */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} transition={{ delay: 0.1 }}
                    className="relative rounded-2xl glass-card p-4 flex flex-col group overflow-hidden border border-card-border">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-muted/40" />
                            <div className="w-2 h-2 rounded-full bg-muted/40" />
                            <div className="w-2 h-2 rounded-full bg-muted/40" />
                        </div>
                        <Terminal className="w-3 h-3 text-muted" />
                    </div>

                    <div className="relative flex-grow rounded-xl border border-card-border bg-body-bg overflow-hidden p-6 flex flex-col justify-center">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-mono text-primary tracking-widest uppercase font-bold">Readiness_Score</p>
                                <span className="text-xs font-mono text-foreground">62%</span>
                            </div>
                            <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} whileInView={{ width: "62%" }} transition={{ duration: 1, ease: "circOut" }} className="h-full bg-primary" />
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="p-3 bg-body-bg border border-card-border rounded-lg">
                                    <p className="text-[9px] text-muted uppercase mb-1 font-bold">Focus Area</p>
                                    <p className="text-xs text-foreground/80 leading-snug">System design reasoning + STAR behavioral answers.</p>
                                </div>
                                <div className="p-3 bg-body-bg border border-card-border rounded-lg">
                                    <p className="text-[9px] text-muted uppercase mb-1 font-bold">Last Round</p>
                                    <p className="text-xs text-foreground/80">Technical Deep-Dive: <span className="text-primary font-bold">Passed</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/5 to-transparent pointer-events-none" />
                    </div>

                    <div className="mt-4 px-2 flex items-center justify-between">
                        <p className="text-[9px] text-muted font-mono tracking-tighter">ANALYTICS_V_04</p>
                        <Sparkles className="w-3 h-3 text-muted" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
