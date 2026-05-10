"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function InitialLoader({
    onComplete,
}: {
    onComplete: () => void;
}) {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const ctx = gsap.context(() => {
                const cinematicEase = "cubic-bezier(0.77, 0, 0.175, 1)";

                const tl = gsap.timeline({
                    defaults: { ease: cinematicEase },
                });

                // Initial states
                tl.set(".letter-c", { y: "-120vh", opacity: 1 });
                tl.set(".letter-p", { y: "120vh", opacity: 1 });
                tl.set(".rest-text", { opacity: 0 });
                tl.set(".loading-bar", {
                    scaleX: 0,
                    transformOrigin: "left center",
                });
                tl.set(".camera", { scale: 1.05 });

                // 1️⃣ Slide in letters
                tl.to(".letter-c", {
                    y: 0,
                    duration: 0.65,
                    filter: "blur(0px)",
                    textShadow: "0px 0px 14px rgba(255,255,255,0.4)",
                });

                tl.to(
                    ".letter-p",
                    {
                        y: 0,
                        duration: 0.6,
                        filter: "blur(0px)",
                        textShadow: "0px 0px 14px rgba(255,255,255,0.4)",
                    },
                    "-=0.5", // slightly more overlap for smooth flow
                );

                // Remove glow
                tl.to(
                    [".letter-c", ".letter-p"],
                    {
                        textShadow: "0px 0px 0px rgba(255,255,255,0)",
                        duration: 0.25,
                    },
                    "-=0.25",
                );

                // 2️⃣ Reveal text
                tl.to(
                    ".rest-text",
                    {
                        opacity: 1,
                        duration: 0.75,
                        ease: "none",
                    },
                    "-=0.1",
                );

                // 3️⃣ Loading bar
                tl.to(
                    ".loading-bar",
                    {
                        scaleX: 1,
                        duration: 0.65,
                        ease: "power2.inOut",
                    },
                    "-=0.2",
                );

                // 4️⃣ Camera settle
                tl.to(
                    ".camera",
                    {
                        scale: 1,
                        duration: 0.5,
                        ease: "power3.out",
                    },
                    "-=0.5",
                );

                // 5️⃣ Smooth exit
                tl.to(".loader-container", {
                    opacity: 0,
                    y: -55,
                    filter: "blur(6px)",
                    duration: 0.35,
                    ease: "power3.inOut",
                    onComplete: onComplete,
                });
            }, container);

            return () => ctx.revert();
        },
        { scope: container },
    );

    return (
        <div
            ref={container}
            className="loader-container fixed inset-0 z-[9999] flex items-center justify-center bg-black will-change-transform"
        >
            <div className="camera text-center text-white">
                <div className="flex justify-center text-6xl font-extrabold tracking-tight uppercase">
                    <span className="letter-c blur-md">C</span>
                    <span className="rest-text">areer</span>
                    <span className="letter-p ml-1 blur-md">P</span>
                    <span className="rest-text">ilot</span>
                </div>

                <div className="mt-8 h-[3px] w-64 bg-white/10 mx-auto overflow-hidden rounded-full">
                    <div className="loading-bar h-full w-full bg-white rounded-full" />
                </div>
            </div>
        </div>
    );
}
