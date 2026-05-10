"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { BarChart3, Focus, Search, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// #ED8936 = current (you), #38BDF8 = target
const PRIMARY = "#ED8936";
const ACCENT  = "#38BDF8";

function ComparisonBar({ label, current, target }: { label: string; current: number; target: number }) {
    const [hovered, setHovered] = useState(false);
    const gap = target - current;

    return (
        <div
            className="flex flex-col items-center gap-3 w-full relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Hover tooltip */}
            {hovered && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-20 left-1/2 -translate-x-1/2 z-30 w-28 rounded-lg border border-card-border bg-background shadow-lg p-2 text-center pointer-events-none"
                >
                    <p className="text-[9px] text-muted uppercase font-bold mb-1">{label}</p>
                    <div className="flex justify-between text-[10px] font-mono">
                        <span style={{ color: PRIMARY }}>You {current}%</span>
                        <span style={{ color: ACCENT }}>↑{target}%</span>
                    </div>
                    <div className="mt-1 text-[9px] font-bold" style={{ color: gap > 0 ? PRIMARY : ACCENT }}>
                        {gap > 0 ? `Gap: ${gap}%` : "On Track ✓"}
                    </div>
                    {/* Arrow */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-background border-r border-b border-card-border" />
                </motion.div>
            )}

            <div className="h-56 w-full bg-card-bg border border-card-border rounded-lg flex items-end overflow-hidden relative cursor-pointer">
                {/* Target bar */}
                <div
                    className="absolute bottom-0 w-full border-t border-card-border transition-opacity duration-300"
                    style={{ height: `${target}%`, backgroundColor: `${ACCENT}22` }}
                />
                {/* Current bar */}
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${current}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="w-full z-10 transition-opacity duration-300"
                    style={{ backgroundColor: hovered ? PRIMARY : `${PRIMARY}cc` }}
                />
                {/* Gap indicator on hover */}
                {hovered && gap > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute z-20 w-full"
                        style={{
                            bottom: `${current}%`,
                            height: `${gap}%`,
                            background: `repeating-linear-gradient(45deg, ${PRIMARY}22, ${PRIMARY}22 2px, transparent 2px, transparent 6px)`,
                            borderTop: `1px dashed ${PRIMARY}88`,
                        }}
                    />
                )}
                {/* Alert icon for big gaps */}
                {gap > 40 && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                        <AlertCircle className="w-3 h-3 animate-pulse" style={{ color: PRIMARY }} />
                    </div>
                )}
            </div>
            <span className="text-[9px] font-mono text-muted tracking-tight uppercase text-center font-bold leading-tight h-6">{label}</span>
        </div>
    );
}

export default function RoadmapGapAnalyzer() {
    return (
        <section className="py-24 px-6 bg-background overflow-hidden">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
                className="max-w-6xl mx-auto group relative rounded-2xl glass-card overflow-hidden">
                <div className="grid md:grid-cols-[320px_1fr]">
                    {/* Sidebar */}
                    <div className="p-8 border-r border-card-border bg-card-bg flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Search className="w-4 h-4" style={{ color: PRIMARY }} />
                                <p className="text-[10px] tracking-[0.3em] text-muted font-black uppercase">Target // Profile</p>
                            </div>

                            <h4 className="text-foreground font-bold text-lg mb-2">Senior Product Architect</h4>
                            <p className="text-xs text-muted leading-relaxed mb-8">
                                Analyzing your current signature against industry requirements for this role.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 rounded-lg p-3 border" style={{ color: PRIMARY, backgroundColor: `${PRIMARY}18`, borderColor: `${PRIMARY}33` }}>
                                    <AlertCircle className="w-4 h-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider">3 Critical Gaps Identified</p>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg p-3 border" style={{ color: ACCENT, backgroundColor: `${ACCENT}18`, borderColor: `${ACCENT}33` }}>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider">4 Requirements Met</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors group/link">
                                View Detailed Roadmap
                                <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="p-8 md:p-12 bg-background">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-card-bg border border-card-border flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-foreground" />
                                </div>
                                <h3 className="text-xl font-black text-foreground">
                                    Gap <span className="text-muted">Density Analysis</span>
                                </h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PRIMARY }} />
                                    <span className="text-[9px] text-muted uppercase font-bold">You</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: ACCENT }} />
                                    <span className="text-[9px] text-muted uppercase font-bold">Target</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-4 md:gap-6 items-end">
                            <ComparisonBar label="Technical Mastery" current={85} target={95} />
                            <ComparisonBar label="Strategic Planning" current={30} target={80} />
                            <ComparisonBar label="Comm. Skills" current={60} target={75} />
                            <ComparisonBar label="Market Knowledge" current={40} target={90} />
                            <ComparisonBar label="Leadership" current={20} target={85} />
                            <ComparisonBar label="Ops Management" current={55} target={60} />
                            <ComparisonBar label="Risk Analysis" current={70} target={75} />
                        </div>

                        <div className="mt-12 pt-8 border-t border-card-border">
                            <div className="flex items-center gap-2 mb-2">
                                <Focus className="w-3 h-3" style={{ color: PRIMARY }} />
                                <span className="text-[10px] text-muted uppercase tracking-widest font-black">Optimization Path</span>
                            </div>
                            <p className="text-xs text-muted leading-relaxed max-w-2xl">
                                The engine recommends prioritizing{" "}
                                <span className="text-foreground font-bold">Leadership</span> and{" "}
                                <span className="text-foreground font-bold">Market Knowledge</span>
                                —these represent your largest delta between current state and roadmap completion.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
