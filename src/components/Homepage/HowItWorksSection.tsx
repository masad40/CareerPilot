"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Sparkles, Map, BrainCircuit, Mic2, HelpCircle } from "lucide-react";

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function StepCard({
    step, title, desc, icon, accent = "primary",
}: {
    step: string; title: string; desc: string; icon: React.ReactNode; accent?: "primary" | "accent";
}) {
    const styles = {
        primary: "border-primary/30 text-primary bg-primary/10",
        accent:  "border-accent/30 text-accent bg-accent/10",
    };

    return (
        <motion.div
            variants={item}
            whileHover={{ y: -8 }}
            className="group relative rounded-2xl glass-card p-6 flex flex-col h-full transition-all duration-300 overflow-hidden"
        >
            <div className={`absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${styles[accent].split(" ")[0]}`} />

            <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center backdrop-blur-md shadow-lg ${styles[accent]}`}>
                    {icon}
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted group-hover:text-foreground transition-colors">{step}</span>
            </div>

            <div className="flex-grow">
                <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-sm text-muted leading-relaxed group-hover:text-foreground/80 transition-colors">{desc}</p>
            </div>

            <div className="mt-8 flex items-center gap-2">
                <div className="flex gap-[2px] items-center h-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-[2px] rounded-full waveform-bar`} style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
                <span className="text-[10px] font-medium tracking-wider text-muted uppercase">AI Optimized</span>
            </div>
        </motion.div>
    );
}

export default function HowItWorksSection() {
    return (
        <section className="relative py-32 px-6 overflow-hidden bg-background">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center md:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card-bg border border-card-border mb-6">
                        <span className="typing-dot" />
                        <span className="text-[10px] font-bold tracking-widest text-muted uppercase">Process</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                        The Intelligence <span className="text-primary">Cycle</span>
                    </h2>
                    <p className="text-muted max-w-2xl text-lg font-light leading-relaxed">
                        From your first goal to your final interview, we automate the hard parts of career growth.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-4 gap-6"
                >
                    <StepCard step="STEP 01" accent="accent" icon={<Map className="w-6 h-6" />} title="Goal Mapping" desc="Select your target role. Gemini API crafts a high-precision roadmap tailored to your specific experience level." />
                    <StepCard step="STEP 02" accent="primary" icon={<BrainCircuit className="w-6 h-6" />} title="Mentor Learning" desc="Don't just read—understand. Use our 24/7 AI Mentor to break down complex topics directly from your roadmap." />
                    <StepCard step="STEP 03" accent="accent" icon={<HelpCircle className="w-6 h-6" />} title="Active Testing" desc="Validate your progress with AI-generated quizzes and deep-dive question banks for every milestone." />
                    <StepCard step="STEP 04" accent="primary" icon={<Mic2 className="w-6 h-6" />} title="Interview Sim" desc="Experience high-pressure mock interviews. Get instant sentiment analysis and actionable technical feedback." />
                </motion.div>
            </div>
        </section>
    );
}
