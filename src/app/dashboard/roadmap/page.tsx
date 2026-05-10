"use client";

import EmptyRoadmapState from "@/components/Roadmaps/components/EmptyRoadmapState";
import RoadmapDetails from "@/components/Roadmaps/RoadmapDetails";
import axios from "axios";
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
} from "framer-motion";
import { useState, useRef, useCallback } from "react";
import RoadmapHistory from "@/components/Roadmaps/RoadmapHistory";
import { useAuth } from "@/context/AuthContext";
import { Roadmap } from "@/utils/interfaces";
import RoadmapHeroSection from "@/components/Roadmaps/RoadmapHeroSection";
import RoadmapGeneratorSection from "@/components/Roadmaps/components/RoadmapGeneratorSection";

const MyRoadmaps = () => {
    const { user } = useAuth();
    const limit = 3;

    const [query, setQuery] = useState("");
    const [duration, setDuration] = useState("");
    const [hours, setHours] = useState("");
    const [currentLevel, setCurrentLevel] = useState("");
    const [loading, setLoading] = useState(false);

    const [roadmap, setRoadmap] = useState<Roadmap | undefined>();
    const [roadmapId, setRoadmapId] = useState<string>("");
    const [completedTopics, setCTopics] = useState<Array<string>>([]);
    const [roadmapCount, setRoadmapCount] = useState<number>(0);

    const resultSectionRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    const scrollToResult = useCallback(() => {
        setTimeout(() => {
            if (resultSectionRef.current) {
                resultSectionRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 400);
    }, []);

    const handleGenerate = async () => {
        if (!query || !duration || !hours) return;
        setLoading(true);

        try {
            const res = await axios.post("/api/roadmaps", {
                userId: user?.uid,
                userEmail: user?.email,
                query,
                duration,
                hours,
                currentLevel,
            });

            const newRoadmap = res.data.roadmap;
            setRoadmap(newRoadmap);
            setQuery("");

            setTimeout(scrollToResult, 2800);
        } catch (err) {
            console.error("Generation Error:", err);
            setLoading(false);
        } finally {
            setTimeout(() => setLoading(false), 2500);
        }
    };

    const handleViewRoadmap = (
        selectedRoadmap: Roadmap,
        id: string,
        completedTopics: Array<string>,
    ) => {
        setRoadmap(selectedRoadmap);
        setRoadmapId(id);
        setCTopics(completedTopics);

        console.log(completedTopics);
        scrollToResult();
    };

    return (
        <div className="relative min-h-screen selection:bg-primary/30 bg-background">
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8 } }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-2xl"
                    >
                        <div className="relative w-72 h-1 bg-white/5 rounded-full overflow-hidden mb-12 border border-white/10">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{
                                    duration: 2.2,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-black text-white mb-3 tracking-[0.2em]">
                                ARCHITECTING
                            </h2>
                            <p className="text-primary text-xs font-mono uppercase tracking-[0.4em] animate-pulse">
                                {query || "Designing Path"}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-16">
                {/* Hero & Generator */}
                <motion.div
                    style={{ y: y1 }}
                    className="flex flex-col items-center"
                >
                    <main className="w-full max-w-5xl px-6 py-12 flex flex-col items-center">
                        <RoadmapHeroSection />
                        <RoadmapGeneratorSection
                            query={query}
                            setQuery={setQuery}
                            currentLevel={currentLevel}
                            setCurrentLevel={setCurrentLevel}
                            hours={hours}
                            setHours={setHours}
                            duration={duration}
                            setDuration={setDuration}
                            handleGenerate={handleGenerate}
                            loading={loading}
                        />
                    </main>
                </motion.div>

                {/* History Section */}
                <section className="px-6 pb-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4 border-l-2 border-primary/20 pl-6">
                            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">
                                My Created{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-primary">
                                    Roadmaps
                                </span>
                            </h2>
                            <div className="bg-card-bg backdrop-blur-lg text-muted text-[10px] font-black px-4 py-2 rounded-xl border border-card-border">
                                {roadmapCount !== 0
                                    ? `SYSTEM STORAGE: ${roadmapCount} / ${limit}`
                                    : "DATA VAULT EMPTY"}
                            </div>
                        </div>

                        <RoadmapHistory
                            userId={user?.uid || ""}
                            onViewRoadmap={handleViewRoadmap}
                            setRoadmapCount={setRoadmapCount}
                        />
                    </div>
                </section>

                {/* ================= RESULT SECTION ================= */}
                <div
                    ref={resultSectionRef}
                    className="w-full scroll-mt-32 px-6 max-w-7xl mx-auto pb-32"
                >
                    <AnimatePresence mode="wait">
                        {roadmap ? (
                            <motion.div
                                key={roadmap.skill}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="rounded-[2.5rem] overflow-hidden bg-card-bg backdrop-blur-3xl border border-card-border shadow-2xl"
                            >
                                <RoadmapDetails
                                    roadmap={roadmap}
                                    roadmapId={roadmapId}
                                    completedTopics={completedTopics}
                                />
                            </motion.div>
                        ) : (
                            <EmptyRoadmapState />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MyRoadmaps;
