export interface BaseResource {
    name: string;
    link: string;
}

export interface CourseResource extends BaseResource {
    platform: string;
    type: "free" | "paid";
}

export interface PhaseResources {
    documentation?: BaseResource[];
    courses?: CourseResource[];
    youtube_channels?: BaseResource[];
    books?: BaseResource[];
    practice_platforms?: BaseResource[];
}
