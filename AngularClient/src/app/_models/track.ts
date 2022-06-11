export class Track {
    id: string;
    releaseId: string;
    index: number;
    title: string;
    subtitle?: string;
    artist: string;
    featuring?: string;
    trackPath: string;
    duration?: TimeRanges;
    explicit: boolean;
    lyrics?: string;
    numberOfPlays: number;
}