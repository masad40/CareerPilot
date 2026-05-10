import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ExpandableGrid } from "./components/ExpandableWrapper";
import { useRouter } from "next/navigation";
import { Calendar, RotateCcw } from "lucide-react";

const InterviewHistorySection = () => {
    const { user } = useAuth();
    const router = useRouter();

    const { data: interviews = [], isLoading } = useQuery({
        queryKey: ["interviews", user?.uid],
        queryFn: async () => {
            const res = await axios.get(`/api/interview?userId=${user?.uid}`);
            return res.data;
        },
        enabled: !!user?.uid,
    });

    const handleFeedback = (interviewId: string) => {
        router.push(`/dashboard/interview/feedback?interviewId=${interviewId}`);
    };

    const formatDate = (dateString: any) =>
        new Date(dateString).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Interviews History</h2>
                <span className="text-[11px] font-medium text-muted bg-body-bg px-2.5 py-1 rounded-md border border-card-border">
                    {interviews.length} TOTAL
                </span>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-40 w-full bg-card-bg animate-pulse rounded-xl border border-card-border" />
                    ))}
                </div>
            ) : (
                <ExpandableGrid
                    items={interviews}
                    limit={3}
                    emptyMessage="No interview history yet. Start your first session!"
                    renderItem={(item: any) => (
                        <div
                            key={item._id}
                            className="group relative flex flex-col bg-card-bg border border-card-border rounded-2xl p-5 hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Top Row */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-[15px] font-semibold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                        {item.roadmapSkill || "General Interview"}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[11px] text-muted font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(item.createdAt)}
                                    </div>
                                </div>
                                <div className="px-2 py-1 rounded-md bg-body-bg border border-card-border">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted">
                                        {item.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mt-2 mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted uppercase font-bold tracking-tight">Questions</span>
                                    <span className="text-sm font-mono text-foreground/80">{item.questions?.length || 0} items</span>
                                </div>
                                <div className="w-px h-8 bg-card-border" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted uppercase font-bold tracking-tight">Status</span>
                                    {item.hasFeedback ? (
                                        <span className="flex items-center gap-1.5 text-sm text-emerald-500 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Completed
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium opacity-80">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-card-border">
                                {item.hasFeedback ? (
                                    <>
                                        <button
                                            onClick={() => handleFeedback(item._id)}
                                            className="group relative flex-1 overflow-hidden px-4 py-2 rounded-lg bg-body-bg border border-card-border transition-all duration-300 hover:border-primary/40 cursor-pointer"
                                        >
                                            <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-primary/10 to-transparent transition-transform duration-300 group-hover:translate-y-0" />
                                            <span className="relative text-[12px] font-bold text-foreground/70 group-hover:text-primary transition-colors duration-300">
                                                View Feedback
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => router.push(`/dashboard/interview?interviewId=${item._id}&questions=${encodeURIComponent(JSON.stringify(item.questions))}`)}
                                            className="group relative flex items-center justify-center w-10 h-9 bg-body-bg border border-card-border rounded-lg transition-all duration-300 hover:bg-primary hover:border-primary cursor-pointer"
                                            title="Retake Interview"
                                        >
                                            <RotateCcw className="w-4 h-4 text-muted transition-all duration-500 group-hover:rotate-[-360deg] group-hover:text-white" />
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-card-bg text-[10px] text-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-card-border shadow-xl">
                                                Retake Session
                                            </div>
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => router.push(`/dashboard/interview?interviewId=${item._id}&questions=${encodeURIComponent(JSON.stringify(item.questions))}`)}
                                        className="cursor-pointer group relative flex-1 flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 py-2 text-[12px] font-extrabold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                                    >
                                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-15deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-15deg)_translateX(100%)]">
                                            <div className="relative h-full w-8 bg-white/40 blur-sm" />
                                        </div>
                                        <span className="relative tracking-tight uppercase">Take Interview</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                />
            )}
        </section>
    );
};

export default InterviewHistorySection;
