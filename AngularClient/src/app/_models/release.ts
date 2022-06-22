import { ReleaseType } from "./releaseType";
import { Status } from "./status";
import { Track } from "./track";

export class Release {
    id: string;
    type: ReleaseType;
    status: Status;
    ownerId: string;
    title: string;
    subtitle?: string;
    artist: string;
    featuring?: string;
    genre: string;
    country: string;
    coverPath: string;
    tracks: Track[];
    duration: TimeRanges;
    explicit: boolean;
    releaseDate: Date;
    numberOfTracks: number;
    numberOfPlays: number;
}