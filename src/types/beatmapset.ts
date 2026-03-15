//noinspection JSUnusedGlobalSymbols

import {UserProfile} from "@/types/user";
import {Beatmap, BeatmapSnapshot} from "@/types/beatmap";

export interface Beatmapset {
    id: number;
    user_id: number;
    beatmaps: Beatmap[];
    snapshots: BeatmapsetSnapshot[];
}

export interface BeatmapsetSnapshot {
    id: number;
    beatmapset_id: number;
    snapshot_number: number;
    snapshot_date: string;
    checksum: string;
    verified: boolean;
    artist: string;
    artist_unicode: string;
    availability: { download_disabled: boolean; more_information: string | null; };
    bpm: number;
    can_be_hyped: boolean;
    covers: {
        cover: string;
        "cover@2x": string;
        card: string;
        "card@2x": string;
        list: string;
        "list@2x": string;
        slimcover: string;
        "slimcover@2x": string;
    };
    creator: string;
    current_nominations: {
        beatmapset_id: number;
        rulesets: string[] | null;
        reset: boolean;
        user_id: number;
    }[];
    deleted_at: string | null;
    description: { description: string; };
    discussion_enabled: boolean;
    discussion_locked: boolean;
    favourite_count: number;
    genre: {
        genre_id: GenreInt;
        genre_name: Genre;
    };
    hype: { current: number; required: number; };
    is_scoreable: boolean;
    language: {
        language_id: LanguageInt;
        language_name: Language;
    };
    last_updated: string;
    legacy_thread_url: string | null;
    nominations_summary: {
        current: number;
        eligible_main_rulesets: GameMode[] | null;
        required_meta: { main_ruleset: number; non_main_ruleset: number; };
    };
    nsfw: boolean;
    offset: number;
    pack_tags: string[];
    play_count: number;
    preview_url: string;
    ranked: BeatmapsetSnapshotRanked;
    ranked_date: string | null;
    rating: number;
    ratings: number[];
    source: string;
    spotlight: boolean;
    status: BeatmapsetSnapshotStatus;
    storyboard: boolean;
    submitted_date: string;
    tags: string;
    title: string;
    title_unicode: string;
    track_id: number | null;
    user_id: number;
    video: boolean;
    beatmap_snapshots: BeatmapSnapshot[];
    beatmapset_tags: BeatmapsetTag[];
    user_profile: UserProfile;
}

export enum GenreInt {
    Any = 0,
    Unspecified,
    VideoGame,
    Anime,
    Rock,
    Pop,
    Other,
    Novelty,
    HipHop,
    Electronic,
    Metal,
    Classical,
    Folk,
    Jazz
}

export enum Genre {
    Any = "Any",
    Unspecified = "Unspecified",
    VideoGame = "Video Game",
    Anime = "Anime",
    Rock = "Rock",
    Pop = "Pop",
    Other = "Other",
    Novelty = "Novelty",
    HipHop = "Hip Hop",
    Electronic = "Electronic",
    Metal = "Metal",
    Classical = "Classical",
    Folk = "Folk",
    Jazz = "Jazz"
}

export enum GameModeInt {
    Fruits = 0,
    Mania = 1,
    Osu = 2,
    Taiko = 3
}

export enum GameMode {
    Fruits = "fruits",
    Mania = "mania",
    Osu = "osu",
    Taiko = "taiko"
}

export enum BeatmapsetSnapshotRanked {
    Graveyard = -2,
    Wip = -1,
    Pending = 0,
    Status = 1,
    Approved = 2,
    Qualified = 3,
    Loved = 4
}

export enum BeatmapsetSnapshotStatus {
    Graveyard = "graveyard",
    Wip = "wip",
    Pending = "pending",
    Status = "Status",
    Approved = "approved",
    Qualified = "qualified",
    Loved = "loved"
}

export enum LanguageInt {
    Any = 0,
    Unspecified = 1,
    English = 2,
    Japanese = 3,
    Chinese = 4,
    Instrumental = 5,
    Korean = 6,
    French = 7,
    German = 8,
    Swedish = 9,
    Spanish = 10,
    Italian = 11,
    Russian = 12,
    Polish = 13,
    Other = 14
}

export enum Language {
    Any = "Any",
    Unspecified = "Unspecified",
    English = "English",
    Japanese = "Japanese",
    Chinese = "Chinese",
    Instrumental = "Instrumental",
    Korean = "Korean",
    French = "French",
    German = "German",
    Swedish = "Swedish",
    Spanish = "Spanish",
    Italian = "Italian",
    Russian = "Russian",
    Polish = "Polish",
    Other = "Other"
}

export interface FailTime { exit: number[] | null; fail: number[] | null; }

export interface BeatmapTag {
    id: number;
    name: string;
    description: string;
    ruleset_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface BeatmapsetTag {
    id: number;
    name: string;
}

export interface Leaderboard {
    id: number;
    beatmap_id: number;
    beatmap_snapshot_id: number;
    created_at: string;
    updated_at: string;
    frozen: boolean;
    beatmap_snapshot: BeatmapSnapshot;
}