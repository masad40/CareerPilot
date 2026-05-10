"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import InitialLoader from "@/components/Homepage/InitialLoader";
import gsap from "gsap";

const ClientRootWrapper = ({ children }: { children: ReactNode }) => {
    const [showLoader, setShowLoader] = useState<boolean | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem("careerPilotVisited");

        if (!hasVisited) {
            sessionStorage.setItem("careerPilotVisited", "true");
            setShowLoader(true);
            document.body.style.overflow = "hidden";
        } else {
            setShowLoader(false);
        }
    }, []);

    const handleLoaderComplete = () => {
        setShowLoader(false);
        document.body.style.overflow = "auto";

        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "expo.out",
            },
        );
    };

    if (showLoader === null) return null;

    return (
        <>
            {showLoader && <InitialLoader onComplete={handleLoaderComplete} />}

            <div
                ref={contentRef}
                className="min-h-screen"
                style={{ opacity: showLoader ? 0 : 1 }}
            >
                {children}
            </div>
        </>
    );
};

export default ClientRootWrapper;
