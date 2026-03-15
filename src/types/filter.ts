//noinspection JSUnusedGlobalSymbols

import {QueueVisibility} from "@/types/queue";
import {RequestStatus} from "@/types/request";
import {
    BeatmapsetSnapshotRanked,
    BeatmapsetSnapshotStatus,
    GameMode,
    GameModeInt, Genre, GenreInt, Language,
    LanguageInt
} from "@/types/beatmapset";

export type FilterOperators<T> = {
    eq?: T;
    gt?: T;
    lt?: T;
    gte?: T;
    lte?: T;
    neq?: T;
    in?: T[];
    not_in?: T[];
    is_null?: boolean;
    regex?: string;
    not_regex?: string;
}

export type FilterType<T> = FilterOperators<T> | T | null;

export interface BeatmapFilterCore {
    id?: FilterType<number>;
    beatmapset_id?: FilterType<number>;
}

export interface BeatmapsetFilterCore {
    id?: FilterType<number>;
    user_id?: FilterType<number>;
}

export interface BeatmapsetSnapshotFilterCore {
    artist?: FilterType<string>;
    artist_unicode?: FilterType<string>;
    bpm?: FilterType<number>;
    can_be_hyped?: FilterType<boolean>;
    creator?: FilterType<string>;
    deleted_at?: FilterType<string>;
    discussion_enabled?: FilterType<boolean>;
    discussion_locked?: FilterType<boolean>;
    favourite_count?: FilterType<number>;
    is_scoreable?: FilterType<boolean>;
    last_updated?: FilterType<string>;
    nsfw?: FilterType<boolean>;
    offset?: FilterType<number>;
    play_count?: FilterType<number>;
    preview_url?: FilterType<string>;
    ranked?: FilterType<BeatmapsetSnapshotRanked>;
    rating?: FilterType<number>;
    source?: FilterType<string>;
    status?: FilterType<BeatmapsetSnapshotStatus>;
    spotlight?: FilterType<boolean>;
    submitted_date?: FilterType<string>;
    tags?: FilterType<string>;
    title?: FilterType<string>;
    title_unicode?: FilterType<string>;
    track_id?: FilterType<number>;
    video?: FilterType<boolean>;
    availability_download_disabled?: FilterType<boolean>;
    availability_more_information?: FilterType<string>;
    description?: FilterType<string>;
    genre_id?: FilterType<GenreInt>;
    genre_name?: FilterType<Genre>;
    hype_current?: FilterType<number>;
    hype_required?: FilterType<number>;
    language_id?: FilterType<LanguageInt>;
    language_name?: FilterType<Language>;
    nominations_summary_current?: FilterType<number>;
    nominations_summary_required_meta_main_ruleset?: FilterType<number>;
    nominations_summary_required_meta_non_main_ruleset?: FilterType<number>;
    num_difficulties?: FilterType<number>;
    sr_gaps_min?: FilterType<number>;
    sr_gaps_max?: FilterType<number>;
    sr_gaps_avg?: FilterType<number>;
    hit_lengths_min?: FilterType<number>;
    hit_lengths_max?: FilterType<number>;
    hit_lengths_avg?: FilterType<number>;
}

export interface BeatmapSnapshotFilterCore {
    accuracy?: FilterType<number>;
    ar?: FilterType<number>;
    bpm?: FilterType<number>;
    checksum?: FilterType<string>;
    count_circles?: FilterType<number>;
    count_sliders?: FilterType<number>;
    count_spinners?: FilterType<number>;
    cs?: FilterType<number>;
    deleted_at?: FilterType<string>;
    difficulty_rating?: FilterType<number>;
    drain?: FilterType<number>;
    hit_length?: FilterType<number>;
    is_scoreable?: FilterType<boolean>;
    last_updated?: FilterType<string>;
    max_combo?: FilterType<number>;
    mode?: FilterType<GameMode>;
    mode_int?: FilterType<GameModeInt>;
    passcount?: FilterType<number>;
    playcount?: FilterType<number>;
    ranked?: FilterType<BeatmapsetSnapshotRanked>;
    status?: FilterType<BeatmapsetSnapshotStatus>;
    total_length?: FilterType<number>;
    url?: FilterType<string>;
    version?: FilterType<string>;
}

export interface BeatmapFilterShallow extends BeatmapFilterCore {
    snapshots?: BeatmapSnapshotFilter;
}

export interface BeatmapsetFilterShallow extends BeatmapsetFilterCore {
    snapshots?: BeatmapsetSnapshotFilter;
}

export type BeatmapsetSnapshotFilterShallow = BeatmapsetSnapshotFilterCore;
export type BeatmapSnapshotFilterShallow = BeatmapSnapshotFilterCore;

export interface BeatmapFilter extends BeatmapFilterCore {
    beatmapset?: BeatmapsetFilterShallow;
    snapshots?: BeatmapSnapshotFilter;
}

export interface BeatmapsetFilter extends BeatmapsetFilterCore {
    beatmaps?: BeatmapFilterShallow;
    snapshots?: BeatmapsetSnapshotFilter;
}

export interface BeatmapsetSnapshotFilter extends BeatmapsetSnapshotFilterCore {
    beatmap_snapshots?: BeatmapSnapshotFilterShallow;
}

export interface BeatmapsetTagFilter {
    id?: FilterType<number>;
    name?: FilterType<string>;
}

export interface BeatmapSnapshotFilter extends BeatmapSnapshotFilterCore {
    beatmapset_snapshots?: BeatmapsetSnapshotFilterShallow;
}

export interface BeatmapTagFilter {
    id?: FilterType<number>;
    name?: FilterType<string>;
    ruleset_id?: FilterType<number>;
    description?: FilterType<string>;
    created_at?: FilterType<string>;
    updated_at?: FilterType<string>;
}

export interface ProfileFilter {
    username?: FilterType<string>;
    country_code?: FilterType<string>;
    graveyard_beatmapset_count?: FilterType<number>;
    loved_beatmapset_count?: FilterType<number>;
    pending_beatmapset_count?: FilterType<number>;
    ranked_beatmapset_count?: FilterType<number>;
    total_maps?: FilterType<number>;
    total_kudosu?: FilterType<number>;
    is_restricted?: FilterType<boolean>;
}

export interface QueueFilter {
    user_id?: FilterType<number>;
    name?: FilterType<string>;
    description?: FilterType<string>;
    created_at?: FilterType<string>;
    updated_at?: FilterType<string>;
    is_open?: FilterType<boolean>;
    visibility?: FilterType<QueueVisibility>;
}

export interface RequestFilter {
    user_id?: FilterType<number>;
    beatmapset_id?: FilterType<number>;
    queue_id?: FilterType<number>;
    comment?: FilterType<string>;
    mv_checked?: FilterType<boolean>;
    created_at?: FilterType<string>;
    updated_at?: FilterType<string>;
    status?: FilterType<RequestStatus>;
}

export interface ScoreFilter {
    id?: FilterType<number>;
}

export interface UserFilter {
    id?: FilterType<number>;
    profile?: ProfileFilter;
    queues?: QueueFilter;
    requests?: RequestFilter;
    beatmapsets?: BeatmapsetFilterShallow;
}

export interface SearchFilters {
    profile?: ProfileFilter;
    beatmap?: BeatmapSnapshotFilter;
    beatmapset?: BeatmapsetSnapshotFilter;
    queue?: QueueFilter;
    request?: RequestFilter;
}
