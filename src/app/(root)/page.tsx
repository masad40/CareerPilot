import HeroBanner from "@/components/Homepage/Banner";
import CTASection from "@/components/Homepage/CTASection";
import Footer from "@/components/Homepage/Footer";
import HowItWorksSection from "@/components/Homepage/HowItWorksSection";
import JourneySection from "@/components/Homepage/JourneySection";
import MeshBackground from "@/components/Homepage/MeshBackground";
import MockInterviewFeatureSection from "@/components/Homepage/MockInterviewFeatureSection";
import Navbar from "@/components/Homepage/Navbar";
import PrecisionTools from "@/components/Homepage/PrecisionTools";
import RoadmapGeneratorFeatureSection from "@/components/Homepage/RoadmapGeneratorFeatureSection";
import LandingSections from "@/components/Homepage/Section/LandingSection";
import SkillAnalyticsSection from "@/components/Homepage/skillsgap";
import TalkToMentor from "@/components/Homepage/TalkToMentor";

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden selection:bg-primary/30 text-foreground">
            <MeshBackground />
            <div className="relative z-10">
                <Navbar />
                <LandingSections />
                <Footer />
            </div>
        </main>
    );
}
