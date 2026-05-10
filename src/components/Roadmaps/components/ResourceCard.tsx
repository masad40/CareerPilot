interface ResourceItem {
    name: string;
    link: string;
}

interface CourseItem extends ResourceItem {
    platform: string;
    type: "free" | "paid";
}

interface ResourceCardProps<T extends ResourceItem> {
    title: string;
    type: string;
    items: T[];
}

function isCourse(item: ResourceItem): item is CourseItem {
    return (
        typeof (item as CourseItem).platform === "string" &&
        typeof (item as CourseItem).type === "string"
    );
}

export default function ResourceCard<T extends ResourceItem>({
    title,
    items,
}: ResourceCardProps<T>) {
    return (
        <div className="bg-card-bg border border-card-border rounded-xl p-5 hover:border-primary/40 transition-colors">
            <h4 className="text-foreground font-medium mb-4">{title}</h4>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-3 rounded-lg bg-body-bg border border-card-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                {item.name}
                            </span>
                            {isCourse(item) && (
                                <span className="text-[10px] text-muted uppercase tracking-wider mt-1">
                                    {item.platform} • {item.type}
                                </span>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
