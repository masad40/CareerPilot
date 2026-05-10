"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Send, MessageSquare, Terminal, Sparkles } from "lucide-react";
import Link from "next/link";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function Pill({ text }: { text: string }) {
    return (
        <span className="text-[10px] font-black tracking-wider uppercase text-muted bg-body-bg border border-card-border px-3 py-1.5 rounded-md backdrop-blur-md">
            {text}
        </span>
    );
}

export default function TalkToMentor() {
    const [messages, setMessages] = useState([
        { id: 1, type: "ai", content: "Hello! I've analyzed your target goal: Senior DevOps Engineer at Google. Would you like to see your custom 6-month roadmap focusing on Kubernetes and Infrastructure as Code?" },
        { id: 2, type: "user", content: "Yes, please! Let's prioritize AWS and Terraform. Can we also include mock interviews?" },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { id: messages.length + 1, type: "user", content: input }]);
            setInput("");
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
        }
    };

    return (
        <section className="py-24 px-6 bg-background overflow-hidden">
            <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[400px_1fr] items-stretch">
                {/* Chat Card */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
                    className="relative rounded-2xl glass-card p-4 flex flex-col group overflow-hidden border border-card-border">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-muted/40" />
                            <div className="w-2 h-2 rounded-full bg-muted/40" />
                            <div className="w-2 h-2 rounded-full bg-muted/40" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-muted uppercase tracking-tighter">Live_Session.log</span>
                            <Terminal className="w-3 h-3 text-muted" />
                        </div>
                    </div>

                    <div className="relative flex-grow rounded-xl border border-card-border bg-body-bg flex flex-col overflow-hidden min-h-[400px]">
                        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed font-medium ${
                                        msg.type === "user"
                                            ? "bg-primary/10 border border-primary/30 text-primary"
                                            : "bg-body-bg border border-card-border text-foreground/80"
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-body-bg border border-card-border px-3 py-2 rounded-lg flex gap-1">
                                        <span className="w-1 h-1 bg-muted rounded-full animate-bounce" />
                                        <span className="w-1 h-1 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1 h-1 bg-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-card-border bg-body-bg">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Ask your mentor..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    className="w-full bg-body-bg border border-card-border rounded-lg py-2 pl-3 pr-10 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
                                />
                                <button onClick={handleSendMessage} className="absolute right-2 text-muted hover:text-primary transition-colors">
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Content */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} transition={{ delay: 0.1 }}
                    className="group relative rounded-2xl glass-card p-8 md:p-12 overflow-hidden border border-card-border">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-[60px]" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-card-bg border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(237,137,54,0.1)]">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] tracking-[0.3em] text-primary font-black uppercase">Mentor // Adaptive</p>
                                <h3 className="text-3xl font-black text-foreground tracking-tight">
                                    Personal <span className="text-foreground/40">Mentor</span>
                                </h3>
                            </div>
                        </div>

                        <p className="text-muted max-w-xl leading-relaxed mb-8">
                            Experience real-time guidance on every step of your professional journey. Our AI mentor doesn&apos;t just answer—it strategizes with you, focusing on industry standards and mock performance.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-10">
                            <Pill text="Real-time Guidance" />
                            <Pill text="Mock Interviews" />
                            <Pill text="Industry Standards" />
                            <Pill text="24/7 Availability" />
                        </div>

                        <Link href="/dashboard/mentor">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="group/btn relative inline-flex items-center gap-3 rounded-xl px-8 py-4 overflow-hidden transition-all duration-500">
                                <div className="absolute inset-0 bg-card-bg backdrop-blur-md border border-card-border group-hover/btn:bg-primary/10 group-hover/btn:border-primary/30 transition-all duration-500 rounded-xl" />
                                <div className="relative z-10 flex items-center gap-3">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground group-hover/btn:text-primary transition-colors">
                                        Start Coaching
                                    </span>
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                            </motion.button>
                        </Link>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
                </motion.div>
            </div>
        </section>
    );
}
