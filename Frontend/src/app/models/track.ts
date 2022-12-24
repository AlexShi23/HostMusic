import { SafeUrl } from "@angular/platform-browser";

export class Track {
    id: string;
    releaseId: string;
    index: number;
    title: string;
    subtitle?: string;
    artist: string;
    featuring?: string;
    file: SafeUrl;
    duration?: TimeRanges;
    explicit: boolean;
    lyrics?: string;
    numberOfPlays: number;
}