import {GameMode} from "@/types/beatmapset";

export interface BeatmapPreviewDifficulty {
    beatmapId: number;
    snapshotNumber: number;
    mode: GameMode;
    version: string;
    difficultyRating: number;
}

export interface BeatmapPreviewSelection extends BeatmapPreviewDifficulty {
    beatmapsetId: number;
    beatmapsetSnapshotNumber: number;
    previewUrl: string;
    title: string;
    artist: string;
    coverUrl?: string;
    mapperName: string;
    mapperAvatarUrl?: string;
    mapperUserId?: number;
    difficulties: BeatmapPreviewDifficulty[];
    difficultiesComplete: boolean;
}
