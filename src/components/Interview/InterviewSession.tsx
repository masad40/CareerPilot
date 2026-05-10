"use client";
import { CallStatus, InterviewSessionProps } from "@/utils/interfaces";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic,
    MicOff,
    MessageSquare,
    Timer,
    Power,
    User,
    Bot,
} from "lucide-react";

const TypewriterText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState("");
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(timer);
        }, 12);
        return () => clearInterval(timer);
    }, [text]);
    return <span>{displayedText}</span>;
};

const InterviewSession = ({
    time,
    setTime,
    messages,
    callStatus,
    handleCallConnect,
    handleCallDisconnect,
    isSpeaking,
}: InterviewSessionProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    useEffect(() => {
        let interval: any = null;
        if (callStatus === CallStatus.ACTIVE) {
            interval = setInterval(
                () => setTime((prev: any) => prev + 1),
                1000,
            );
        }
        return () => clearInterval(interval);
    }, [callStatus, setTime]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <section className="relative h-[92vh] w-full rounded-2xl bg-background text-foreground p-6 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-[1500px] h-full mx-auto flex flex-col gap-6">
                {/* --- Top Nav --- */}
                <div className="flex justify-between items-center px-4 py-3 bg-card-bg backdrop-blur-md border border-card-border rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className={`size-2.5 rounded-full ${callStatus === CallStatus.ACTIVE ? "bg-emerald-500 shadow-[0_0_12px_#10b981]" : "bg-muted/40"}`} />
                        <h1 className="text-sm font-medium tracking-wide text-foreground">
                            Career Pilot <span className="text-muted mx-2">|</span> Interview
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 px-4 py-1 rounded-full bg-body-bg border border-card-border">
                        <Timer className="size-3.5 text-primary" />
                        <span className="text-xs font-mono text-foreground/80">{formatTime(time)}</span>
                    </div>
                </div>

                {/* --- Main Grid --- */}
                <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                    {/* Left Visualizer Card */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col h-full">
                        <div className="flex-1 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] relative flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="relative size-56 flex items-center justify-center">
                                    <AnimatePresence>
                                        {isSpeaking && (
                                            <motion.div
                                                initial={{
                                                    scale: 0.8,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1.5,
                                                    opacity: 0.4,
                                                }}
                                                exit={{ opacity: 0 }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 2,
                                                    ease: "easeOut",
                                                }}
                                                className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                                            />
                                        )}
                                    </AnimatePresence>

                                    <div
                                        className={`size-36 rounded-full border flex items-center justify-center transition-all duration-700 backdrop-blur-2xl shadow-inner ${isSpeaking ? "bg-primary/10 border-primary/50 scale-105" : "bg-body-bg border-card-border"}`}
                                    >
                                        {isSpeaking ? (
                                            <Mic className="size-12 text-primary" />
                                        ) : (
                                            <MicOff className="size-12 text-muted" />
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 text-center px-6">
                                    <span className="px-3 py-1 rounded-full bg-body-bg border border-card-border text-[10px] uppercase tracking-widest text-muted">
                                        System Active
                                    </span>
                                    <h2 className="text-2xl font-extralight text-foreground mt-4 tracking-tight">
                                        Listening for insights...
                                    </h2>
                                </div>
                            </div>

                            {/* Decorative Glass Lines */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-card-border to-transparent" />
                        </div>
                    </div>

                    {/* Right Transcript Card */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col h-full bg-card-bg backdrop-blur-2xl border border-card-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-card-border bg-body-bg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <MessageSquare className="size-4 text-primary" />
                                </div>
                                <span className="text-xs font-medium tracking-widest text-muted">
                                    LIVE TRANSCRIPTION
                                </span>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
                        >
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted text-sm font-light tracking-wide">
                                    Establish a connection to begin transcription.
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={idx}
                                        className={`flex items-start gap-4 ${msg.role === "assistant" ? "" : "flex-row-reverse"}`}
                                    >
                                        <div className={`p-2.5 rounded-xl border ${msg.role === "assistant" ? "bg-primary/10 border-primary/20" : "bg-body-bg border-card-border"}`}>
                                            {msg.role === "assistant"
                                                ? <Bot className="size-4 text-primary" />
                                                : <User className="size-4 text-foreground/70" />}
                                        </div>
                                        <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === "assistant" ? "bg-card-bg rounded-tl-none border border-card-border" : "bg-primary/5 rounded-tr-none border border-primary/10"}`}>
                                            <p className={`text-[15px] leading-relaxed font-light ${msg.role === "assistant" ? "text-foreground" : "text-foreground/80"}`}>
                                                {msg.role === "assistant" && idx === messages.length - 1
                                                    ? <TypewriterText text={msg.content} />
                                                    : msg.content}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Footer Controls --- */}
                <div className="h-20 flex items-center justify-center">
                    <button
                        onClick={
                            callStatus === CallStatus.INACTIVE
                                ? handleCallConnect
                                : handleCallDisconnect
                        }
                        className={`group relative cursor-pointer overflow-hidden flex items-center gap-4 px-10 py-4 rounded-2xl font-medium transition-all duration-500 active:scale-95 ${
                            callStatus === CallStatus.INACTIVE
                                ? "bg-foreground text-background hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]"
                                : "bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
                        }`}
                    >
                        <Power className="size-5 transition-transform group-hover:rotate-12" />
                        <span className="tracking-wide ">
                            {callStatus === CallStatus.INACTIVE
                                ? "Start Interview"
                                : "End Session"}
                        </span>
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </section>
    );
};

export default InterviewSession;
