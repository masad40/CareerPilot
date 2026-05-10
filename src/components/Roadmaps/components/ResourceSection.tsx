import ResourceCard from "./ResourceCard";
import { PhaseResources } from "@/utils/types";

interface ResourcesSectionProps {
    resources: PhaseResources;
}

export default function ResourcesSection({ resources }: ResourcesSectionProps) {
    if (!resources) return null;

    const resourceConfig = [
        {
            key: "documentation",
            title: "Documentation",
        },
        {
            key: "courses",
            title: "Courses",
        },
        {
            key: "youtube_channels",
            title: "YouTube Channels",
        },
        {
            key: "books",
            title: "Books",
        },
        {
            key: "practice_platforms",
            title: "Practice Platforms",
        },
    ] as const;

    return (
        <div className="space-y-6">
            {resourceConfig.map(({ key, title }) => {
                const items = resources[key];

                if (!items || items.length === 0) return null;

                return (
                    <ResourceCard
                        key={key}
                        title={title}
                        type={key}
                        items={items}
                    />
                );
            })}
        </div>
    );
}
