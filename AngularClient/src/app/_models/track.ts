export class Track {
    id: string;
    releaseId: string;
    index: number;
    title: string;
    subtitle?: string;
    artist: string;
    featuring?: string;
    path: string;
    duration?: TimeRanges;
    explicit: boolean;
    lyrics?: string;
    numberOfPlays: number;
}