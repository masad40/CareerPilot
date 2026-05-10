import HeroBanner from "../Banner";
import PrecisionTools from "../PrecisionTools";
import HowItWorksSection from "../HowItWorksSection";
import RoadmapGeneratorFeatureSection from "../RoadmapGeneratorFeatureSection";
import SkillAnalyticsSection from "../skillsgap";
import TalkToMentor from "../TalkToMentor";
import MockInterviewFeatureSection from "../MockInterviewFeatureSection";
import JourneySection from "../JourneySection";
import CTASection from "../CTASection";
import Stats from "../Stats";

export default function LandingSections() {
    return (
        <>
            <HeroBanner />
            <Stats />
            <PrecisionTools />
            <RoadmapGeneratorFeatureSection />
            <TalkToMentor />
            <MockInterviewFeatureSection />
            <SkillAnalyticsSection />
            {/* <HowItWorksSection /> */}
            <JourneySection />
            <CTASection />
        </>
    );
}
