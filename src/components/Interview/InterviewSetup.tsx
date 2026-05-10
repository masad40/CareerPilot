"use client";

import { InterviewSetupProps } from "@/utils/interfaces";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const InterviewSetup = ({
    step,
    setStep,
    selectedRoadmap,
    setSelectedRoadmap,
    userInput,
    setUserInput,
    pdfUploaded,
    setPdfUploaded,
    config,
    setConfig,
    generateInterview,
}: InterviewSetupProps) => {
    const { user } = useAuth();
    const [direction, setDirection] = useState(1);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { data: roadmapsObj, isLoading } = useQuery({
        queryKey: ["roadmaps"],
        queryFn: async () => {
            const res = await axios(`/api/roadmaps?userId=${user?.uid}`);
            return res.data;
        },
    });

    const roadmaps =
        roadmapsObj?.map((rd: any) => ({
            id: rd._id,
            roadmap: rd.roadmap,
        })) ?? [];

    const handleSelectRoadmap = (rd: any) => {
        setSelectedRoadmap((prev: any) =>
            prev?.id === rd.id ? null : { id: rd.id, roadmap: rd.roadmap },
        );
    };

    // Industry Standard GSAP: Slide + Blur + Fade
    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray(".animate-item");
            gsap.killTweensOf(items);

            gsap.fromTo(
                items,
                { opacity: 0, x: 50 * direction, filter: "blur(8px)" },
                {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power4.out",
                    // clearProps: "all", // Removed temporarily to ensure transitions stay smooth
                },
            );
        }, containerRef);

        return () => ctx.revert();
    }, [step]);

    const handleMove = (next: boolean) => {
        if (!containerRef.current) return;

        const d = next ? 1 : -1;
        setDirection(d);

        const items =
            containerRef.current.querySelectorAll<HTMLElement>(".animate-item");
        gsap.to(items, {
            opacity: 0,
            x: -50 * d,
            filter: "blur(8px)",
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.in",
            onComplete: () => {
                if (next) {
                    if (step === 4) generateInterview();
                    else setStep((s) => s + 1);
                } else {
                    setStep((s) => s - 1);
                }
            },
        });
    };

    const canContinue = () => {
        if (step === 1) {
            if (!config.interviewType) return false;
            if (config.interviewType === "Roadmaps" && !selectedRoadmap)
                return false;
            if (config.interviewType === "PDF" && !pdfUploaded) return false;
            if (config.interviewType === "User Input") {
                if (
                    !userInput.trim() ||
                    userInput.trim().split(/\s+/).length < 10
                )
                    return false;
            }
        }
        if (step === 2)
            return !!(config.difficulty && config.difficulty !== "");
        if (step === 3) return !!(config.topic && config.topic !== "");
        return true;
    };

    const steps = [
        {
            title: "Before We Begin",
            content: (
                <div className="space-y-4 text-foreground/80 text-sm leading-relaxed animate-in fade-in duration-300">
                    <p className="text-base font-medium text-foreground">
                        Welcome! This mock interview simulates a real-world
                        scenario to help you practice effectively.
                    </p>
                    <ul className="space-y-2 text-muted list-disc pl-5">
                        <li>
                            <span className="font-semibold text-foreground/80">
                                Adaptive AI:
                            </span>{" "}
                            Questions match your skill level and topics.
                        </li>
                        <li>
                            <span className="font-semibold text-foreground/80">
                                Realistic pacing:
                            </span>{" "}
                            Follow-ups mimic live interviews.
                        </li>
                        <li>
                            <span className="font-semibold text-foreground/80">
                                Feedback:
                            </span>{" "}
                            Identify strengths and areas to improve.
                        </li>
                    </ul>
                    <p className="text-primary font-medium mt-2">Quick Tips:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-muted list-disc pl-5 text-xs">
                        <li>Check your microphone and camera.</li>
                        <li>Choose a quiet environment.</li>
                        <li>Answer confidently and thoughtfully.</li>
                    </ul>
                </div>
            ),
        },
        {
            title: "Select Interview Type",
            content: (
                <div className="space-y-4">
                    <select
                        className="w-full bg-body-bg border border-card-border text-foreground p-4 rounded-xl outline-none cursor-pointer focus:border-primary/50 transition-colors"
                        value={config.interviewType}
                        onChange={(e) => {
                            setConfig({
                                ...config,
                                interviewType: e.target.value,
                            });
                            setSelectedRoadmap(null);
                            setUserInput("");
                            setPdfUploaded(false);
                        }}
                    >
                        <option value="" disabled className="bg-background text-muted">
                            🔹 Choose interview source
                        </option>
                        <option className="bg-background" value="Roadmaps">Roadmaps</option>
                        <option className="bg-background" value="PDF">PDF</option>
                        <option className="bg-background" value="User Input">User Input</option>
                    </select>

                    <div className="max-h-[30vh] overflow-y-auto custom-scrollbar space-y-3">
                        {config.interviewType === "Roadmaps" && (
                            <div className="space-y-3 pr-2">
                                {isLoading ? (
                                    <p className="text-muted text-sm text-center">
                                        Loading roadmaps...
                                    </p>
                                ) : roadmaps.length > 0 ? (
                                    roadmaps.map((rdObj: any) => (
                                        <div
                                            key={rdObj.id}
                                            className={`rounded-2xl border transition-all duration-300 p-5 cursor-pointer ${
                                                selectedRoadmap?.id === rdObj.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-card-border bg-body-bg hover:bg-card-bg"
                                            }`}
                                            onClick={() => handleSelectRoadmap(rdObj)}
                                        >
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {rdObj.roadmap.skill}
                                            </h3>
                                            <p className="text-xs text-muted mt-1">
                                                {rdObj.roadmap.roadmap_summary?.goal}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted text-sm text-center py-4">
                                        You haven't created any roadmaps yet!
                                        You haven't created any roadmaps yet!
                                    </p>
                                )}
                            </div>
                        )}

                        {config.interviewType === "PDF" && (
                            <div className="space-y-2">
                                <div
                                    className="border-2 border-dashed border-card-border rounded-xl p-8 text-center bg-body-bg hover:bg-card-bg transition-all cursor-pointer"
                                    onClick={() => setPdfUploaded(true)}
                                >
                                    <p className="text-muted text-sm">
                                        {pdfUploaded
                                            ? "✅ PDF Uploaded"
                                            : "Drag & drop your PDF here or click to upload"}
                                    </p>
                                </div>
                                <p className="text-xs text-muted">
                                    Upload a PDF containing at least 5 topics so
                                    the AI can generate questions.
                                </p>
                            </div>
                        )}

                        {config.interviewType === "User Input" && (
                            <div className="space-y-2">
                                <textarea
                                    rows={4}
                                    placeholder="Paste your custom interview topics or roadmap here..."
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    className="w-full bg-body-bg border border-card-border text-foreground placeholder:text-muted p-4 rounded-xl focus:outline-none focus:border-primary transition-all resize-none"
                                />
                                <p className="text-xs text-muted">
                                    Enter at least 10 keywords for the AI to
                                    generate a meaningful interview.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Select Difficulty",
            content: (
                <div className="space-y-4">
                    <div className="text-muted text-xs space-y-1">
                        <p className="text-foreground/80 text-sm mb-2">
                            Adjust complexity, depth of expected answers, and
                            intensity of follow-ups:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { label: "Easy", hint: "Simple questions.", border: "border-green-500", bg: "bg-green-500/20", shadow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]" },
                            { label: "Medium", hint: "Applied knowledge.", border: "border-yellow-500", bg: "bg-yellow-500/20", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]" },
                            { label: "Advanced", hint: "Deep analysis.", border: "border-red-500", bg: "bg-red-500/20", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]" },
                        ].map((lvl) => (
                            <button
                                key={lvl.label}
                                onClick={() => setConfig({ ...config, difficulty: lvl.label })}
                                className={`p-4 rounded-xl border transition-all duration-300 text-sm font-medium ${
                                    config.difficulty === lvl.label
                                        ? `${lvl.border} ${lvl.bg} ${lvl.shadow}`
                                        : "border-card-border bg-body-bg hover:bg-card-bg text-muted"
                                }`}
                            >
                                <div>{lvl.label}</div>
                                <div className="text-[10px] opacity-60 font-normal mt-1">{lvl.hint}</div>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-muted italic">
                        Tip: Start with a level you feel comfortable with.
                    </p>
                </div>
            ),
        },
        {
            title: "Interview Focus",
            content: (
                <div className="space-y-4">
                    <p className="text-foreground/80 text-sm">
                        Choose the focus of this interview to help the AI tailor questions.
                    </p>
                    <select
                        className="w-full bg-body-bg border border-card-border text-foreground p-4 rounded-xl outline-none focus:border-primary/50 transition-colors"
                        value={config.topic || ""}
                        onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                    >
                        <option value="" disabled className="bg-background">🔹 Select interview focus</option>
                        <option value="Behavioral" className="bg-background">Behavioral / Soft Skills</option>
                        <option value="Skill-Based" className="bg-background">Skill-Based / Practical</option>
                        <option value="Scenario / Problem Solving" className="bg-background">Scenario / Problem Solving</option>
                    </select>
                    <div className="text-muted text-xs min-h-[60px] p-3 rounded-lg bg-body-bg border border-card-border italic">
                        {config.topic === "Behavioral" && "Focus on communication, teamwork, and decision-making."}
                        {config.topic === "Skill-Based" && "Focus on practical expertise and methods in your chosen skill."}
                        {config.topic === "Scenario / Problem Solving" && "Focus on strategy, reasoning, and weighing trade-offs."}
                        {!config.topic && "Choose a focus to see more details."}
                    </div>
                </div>
            ),
        },
        {
            title: "Final Check",
            content: (
                <div className="text-center space-y-4">
                    <div className="size-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center animate-pulse">
                        <span className="material-symbols-outlined text-green-400">
                            videocam
                        </span>
                    </div>
                    <p className="text-muted text-sm">
                        Microphone and camera are calibrated.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <section
            ref={containerRef}
            className="w-full flex items-center justify-center py-4"
        >
            <div className="flex flex-col glass-card w-full max-w-2xl min-h-[500px] h-auto max-h-[85vh] p-6 md:p-10 rounded-3xl border border-card-border shadow-2xl bg-card-bg backdrop-blur-xl relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <div className="w-20">
                        {step > 0 && (
                            <button
                                onClick={() => handleMove(false)}
                                className="animate-item flex items-center gap-1 text-muted hover:text-foreground transition-colors text-sm"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back_ios</span>{" "}
                                Back
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2 flex-1 justify-end">
                        {steps.map((_, s) => (
                            <div key={s}
                                className={`h-1 w-8 md:w-10 rounded-full transition-all duration-500 ${step >= s ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-card-border"}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                    <h2 className="animate-item text-2xl md:text-3xl font-bold mb-4 tracking-tight text-foreground">
                        {steps[step].title}
                    </h2>
                    <div className="animate-item">{steps[step].content}</div>
                </div>

                {/* Footer */}
                <div className="pt-6 flex justify-end shrink-0">
                    <button
                        onClick={() => handleMove(true)}
                        disabled={!canContinue()}
                        className={`animate-item w-full md:w-auto px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                            canContinue()
                                ? "bg-primary text-black hover:shadow-lg active:scale-95 cursor-pointer"
                                : "bg-white/10 text-slate-500 cursor-not-allowed"
                        }`}
                    >
                        {step === 4 ? "Launch Interview" : "Continue"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default InterviewSetup;
