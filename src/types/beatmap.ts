import {
    Beatmapset,
    BeatmapsetSnapshot,
    BeatmapsetSnapshotRanked,
    BeatmapsetSnapshotStatus,
    BeatmapTag,
    FailTime,
    GameMode,
    GameModeInt, Leaderboard
} from "@/types/beatmapset";
import {UserProfile} from "@/types/user";

export interface Beatmap {
    id: number;
    beatmapset_id: number;
    beatmapset?: Beatmapset;
    snapshots?: BeatmapSnapshot[];
}

export interface BeatmapSnapshot {
    id: number;
    beatmap_id: number;
    snapshot_number: number;
    snapshot_date: string;
    accuracy: number;
    ar: number;
    beatmapset_id: number;
    bpm: number;
    checksum: string;
    count_circles: number;
    count_sliders: number;
    count_spinners: number;
    cs: number;
    deleted_at: string | null;
    difficulty_rating: number;
    drain: number;
    failtimes: FailTime;
    hit_length: number;
    is_scoreable: boolean;
    last_updated: string;
    max_combo: number;
    mode: GameMode;
    mode_int: GameModeInt;
    passcount: number;
    playcount: number;
    ranked: BeatmapsetSnapshotRanked;
    status: BeatmapsetSnapshotStatus;
    total_length: number;
    url: string;
    user_id: number;
    version: string;
    beatmapset_snapshots: BeatmapsetSnapshot[];
    beatmap_tags: BeatmapTag[];
    leaderboard: Leaderboard;
    owner_profiles: UserProfile[];
}