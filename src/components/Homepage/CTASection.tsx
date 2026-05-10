"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
    return (
        <section className="py-24 px-6 bg-background relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative rounded-3xl glass-card p-12 md:p-24 overflow-hidden text-center shadow-xl"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(237,137,54,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(237,137,54,0.04)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[120px] pointer-events-none rounded-full group-hover:bg-primary/20 transition-colors duration-1000" />

                    <div className="relative z-10">
                        <div className="flex justify-center mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                                <Zap className="w-3 h-3" /> System Ready
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 leading-none">
                            Ready to take the <br />
                            <span className="text-foreground/40">pilot&apos;s seat?</span>
                        </h2>

                        <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                            Join the next generation of professionals accelerating their careers with autonomous AI guidance. Your roadmap is primed.
                        </p>

                        <div className="flex flex-col items-center gap-6">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/signup" className="group/btn relative inline-flex items-center gap-4 rounded-2xl px-12 py-5 overflow-hidden">
                                    <div className="absolute inset-0 bg-primary border border-primary/40 group-hover/btn:bg-primary/90 transition-all duration-500 rounded-2xl shadow-lg" />
                                    <div className="absolute -inset-1 bg-primary/20 blur-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    <div className="relative z-10 flex items-center gap-3">
                                        <span className="text-xs font-black uppercase tracking-[0.4em] text-white">Initialize Journey</span>
                                        <ArrowRight className="w-5 h-5 text-white group-hover/btn:translate-x-2 transition-transform duration-500" />
                                    </div>
                                </Link>
                            </motion.div>

                            <div className="flex items-center gap-2 text-[10px] text-muted font-mono tracking-widest uppercase font-bold">
                                <Sparkles className="w-3 h-3 text-primary" />
                                50k+ Engineers Scaled
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-card-border rounded-tl-3xl pointer-events-none" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-card-border rounded-tr-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-card-border rounded-bl-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-card-border rounded-br-3xl pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
}
