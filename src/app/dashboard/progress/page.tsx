"use client";
import { LayoutDashboard, TrendingUp, CheckCircle2, Zap, Target, BarChart3 } from "lucide-react";
import InterviewHistorySection from "@/components/Progress/InterviewHistorySection";
import QuizzesHistorySection from "@/components/Progress/QuizzesHistorySection";

const Progress = () => {
    return (
        <div className="min-h-screen bg-background text-foreground px-4 md:px-10 py-12">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
                            <LayoutDashboard className="w-4 h-4" />
                            Personal Growth
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground">
                            Performance Insights
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 bg-card-bg p-1.5 rounded-xl border border-card-border">
                        <button className="px-4 py-1.5 text-xs font-bold bg-body-bg rounded-lg text-foreground border border-card-border">
                            Last 30 Days
                        </button>
                        <button className="px-4 py-1.5 text-xs font-bold text-muted hover:text-foreground transition-colors">
                            All Time
                        </button>
                    </div>
                </header>

                {/* Analytics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Roadmap Velocity */}
                    <div className="relative group overflow-hidden bg-card-bg border border-card-border p-6 rounded-2xl transition-all hover:border-primary/50">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Target className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <TrendingUp className="w-3 h-3" /> +12%
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-mono font-bold text-foreground">14</h3>
                            <p className="text-xs text-muted font-medium uppercase tracking-wider">Roadmaps Active</p>
                        </div>
                        <div className="mt-4 h-1 w-full bg-card-border rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[65%]" />
                        </div>
                    </div>

                    {/* Quiz Mastery */}
                    <div className="relative group overflow-hidden bg-card-bg border border-card-border p-6 rounded-2xl transition-all hover:border-primary/50">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <Zap className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-[10px] font-bold text-muted bg-body-bg px-2 py-0.5 rounded-full border border-card-border">
                                AVG 88%
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-mono font-bold text-foreground">42</h3>
                            <p className="text-xs text-muted font-medium uppercase tracking-wider">Quizzes Passed</p>
                        </div>
                        <div className="mt-4 flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div key={i} className={`h-4 flex-1 rounded-sm ${i < 6 ? "bg-emerald-500/40" : "bg-card-border"}`} />
                            ))}
                        </div>
                    </div>

                    {/* Interview Readiness */}
                    <div className="relative group overflow-hidden bg-card-bg border border-card-border p-6 rounded-2xl transition-all hover:border-primary/50">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                <BarChart3 className="w-5 h-5 text-amber-400" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-mono font-bold text-foreground">Lvl 4</h3>
                            <p className="text-xs text-muted font-medium uppercase tracking-wider">Interview Status</p>
                        </div>
                        <div className="mt-4 text-[11px] text-muted font-medium italic">
                            "Ready for Senior roles"
                        </div>
                    </div>

                    {/* Total Learning Time */}
                    <div className="relative group overflow-hidden bg-card-bg border border-card-border p-6 rounded-2xl transition-all hover:border-primary/50">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-mono font-bold text-foreground">128h</h3>
                            <p className="text-xs text-muted font-medium uppercase tracking-wider">Time Invested</p>
                        </div>
                        <div className="mt-4 flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-card-bg bg-body-bg" />
                            ))}
                            <div className="w-6 h-6 rounded-full border-2 border-card-bg bg-primary flex items-center justify-center text-[8px] font-bold text-white">
                                +8
                            </div>
                        </div>
                    </div>
                </section>

                {/* History Sections */}
                <div className="space-y-14">
                    <InterviewHistorySection />
                    <QuizzesHistorySection />
                </div>
            </div>
        </div>
    );
};

export default Progress;
