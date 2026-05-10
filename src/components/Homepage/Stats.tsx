"use client";
import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const statData = [
    { label: "Roadmaps Generated", value: "124K+", description: "Personalized AI career paths", color: "var(--primary)" },
    { label: "Interviews Attempted", value: "85K+", description: "Realistic technical simulations", color: "var(--accent)" },
    { label: "Total Users", value: "50K+", description: "Active career climbers", color: "var(--primary)" },
    { label: "AI Questions Generated", value: "1.2M+", description: "Quizzes & deep question banks", color: "var(--accent)" },
];

const Stats = () => {
    return (
        <section className="relative py-24 px-6 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto mb-16 text-center lg:text-left">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card mb-6"
                >
                    <Activity className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase">Real-Time Platform Pulse</span>
                    <div className="flex gap-1 ml-2">
                        <span className="typing-dot" />
                        <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 items-end">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        <h2 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
                            Fueling the <br />
                            <span className="text-primary">Next Generation</span>
                        </h2>
                    </motion.div>

                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                        className="text-muted text-lg max-w-md lg:mb-2 font-light leading-relaxed">
                        Thousands of users use CareerPilot to bridge the gap between their current skills and their dream roles.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statData.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative group p-8 rounded-2xl glass-card hover:border-primary/50 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute -top-12 -right-12 w-24 h-24 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: stat.color }} />

                            <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-30 group-hover:opacity-100 transition-opacity">
                                <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: stat.color }} />
                                    <span className="text-[10px] font-black tracking-widest text-muted uppercase">Metric.0{index + 1}</span>
                                </div>
                                <h3 className="text-5xl font-black text-foreground mb-2 tracking-tighter group-hover:translate-x-1 transition-transform duration-300">{stat.value}</h3>
                                <p className="text-sm font-bold text-foreground/80 mb-1 italic">{stat.label}</p>
                                <p className="text-xs text-muted font-medium">{stat.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
