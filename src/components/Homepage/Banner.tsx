"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    } as const;

    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    } as const;

    return (
        <section className="pt-10 relative min-h-screen flex items-center justify-center overflow-hidden bg-background ">
            <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] floating opacity-40" />
            <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-accent/20 rounded-full blur-[150px] floating opacity-40" style={{ animationDelay: "2s" }} />

            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="relative max-w-7xl mx-auto px-6 py-20 text-center z-10"
            >
                {/* Badge */}
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card mb-10 pulse-ring shadow-md">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full neon-glow-primary" />
                    <span className="text-xs font-black tracking-[0.25em] text-foreground uppercase">
                        Next-Gen Career Intelligence
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-foreground">
                    Your AI-Powered <br />
                    <span className="text-primary">Career GPS</span>
                </motion.h1>

                {/* Description */}
                <motion.p variants={fadeInUp} className="mt-8 max-w-2xl mx-auto text-foreground/80 text-lg md:text-xl leading-relaxed font-light">
                    Navigate the modern job market with personalized skill roadmaps,
                    <span className="text-primary font-bold underline decoration-primary/30 decoration-2 underline-offset-4"> 24/7 AI mentorship</span>,
                    and real-time industry gap analysis.
                </motion.p>

                {/* Actions */}
                <motion.div variants={fadeInUp} className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                    <Link href="/dashboard/roadmap">
                        <button className="relative cursor-pointer group px-10 py-4 rounded-xl font-bold transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-primary/30">
                            <div className="absolute inset-0 bg-primary border border-primary/40 rounded-xl" />
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                            <span className="relative z-10 flex items-center gap-2 text-white">✨ Generate My Roadmap</span>
                        </button>
                    </Link>

                    <Link href="/dashboard/mentor">
                        <button className="glass-card group relative cursor-pointer px-10 py-4 rounded-xl font-bold overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                            <span className="relative z-10 flex items-center justify-center gap-2 text-foreground group-hover:text-primary transition-colors">
                                Try AI Mentor
                                <div className="flex gap-1">
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </div>
                            </span>
                            <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-primary transition-all duration-500 shadow-[0_0_12px_var(--primary)]" />
                        </button>
                    </Link>
                </motion.div>

                {/* Waveform */}
                <div className="mt-20 flex justify-center items-end gap-1.5 h-8 opacity-70">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1.5 waveform-bar rounded-full" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
