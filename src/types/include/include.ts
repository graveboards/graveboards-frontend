//noinspection JSUnusedGlobalSymbols

export type APIInclude = object

export interface QueueInclude extends APIInclude {
    id?: boolean;
    user_id?: boolean;
    name?: boolean;
    description?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    is_open?: boolean;
    visibility?: boolean;
    user_profile?: ProfileInclude | boolean;
    manager_profiles?: ProfileInclude | boolean;
}

export interface ScoreInclude extends APIInclude {
    id?: boolean;
}

export interface RequestInclude extends APIInclude {
    id?: boolean;
    user_id?: boolean;
    beatmapset_id?: boolean;
    beatmapset_snapshot_id?: boolean;
    queue_id?: boolean;
    comment?: boolean;
    mv_checked?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    status?: boolean;
    beatmapset_snapshot?: BeatmapsetSnapshotInclude | boolean;
    user_profile?: ProfileInclude | boolean;
    queue?: QueueInclude | boolean;
}

export interface ProfileInclude extends APIInclude {
    id?: boolean;
    user_id?: boolean;
    updated_at?: boolean;
    is_restricted?: boolean;
    account_history?: boolean;
    active_tournament_banners?: boolean;
    avatar_url?: boolean;
    badges?: boolean;
    beatmap_playcounts_count?: boolean;
    comments_count?: boolean;
    country_code?: boolean;
    country?: boolean;
    cover?: boolean;
    daily_challenge_user_stats?: boolean;
    default_group?: boolean;
    discord?: boolean;
    favourite_beatmapset_count?: boolean;
    follower_count?: boolean;
    graveyard_beatmapset_count?: boolean;
    groups?: boolean;
    guest_beatmapset_count?: boolean;
    has_supported?: boolean;
    interests?: boolean;
    is_active?: boolean;
    is_bot?: boolean;
    is_deleted?: boolean;
    is_online?: boolean;
    is_supporter?: boolean;
    join_date?: boolean;
    kudosu?: boolean;
    location?: boolean;
    last_visit?: boolean;
    loved_beatmapset_count?: boolean;
    mapping_follower_count?: boolean;
    matchmaking_stats?: boolean;
    max_blocks?: boolean;
    max_friends?: boolean;
    monthly_playcounts?: boolean;
    nominated_beatmapset_count?: boolean;
    occupation?: boolean;
    page?: boolean;
    pending_beatmapset_count?: boolean;
    playmode?: boolean;
    playstyle?: boolean;
    pm_friends_only?: boolean;
    post_count?: boolean;
    previous_usernames?: boolean;
    profile_colour?: boolean;
    profile_hue?: boolean;
    profile_order?: boolean;
    rank_highest?: boolean;
    rank_history?: boolean;
    ranked_and_approved_beatmapset_count?: boolean;
    ranked_beatmapset_count?: boolean;
    replays_watched_counts?: boolean;
    scores_best_count?: boolean;
    scores_first_count?: boolean;
    scores_pinned_count?: boolean;
    scores_recent_count?: boolean;
    statistics?: boolean;
    support_level?: boolean;
    team?: boolean;
    title?: boolean;
    title_url?: boolean;
    twitter?: boolean;
    user_achievements?: boolean;
    username?: boolean;
    website?: boolean;
}

export interface BeatmapTagInclude extends APIInclude {
    id?: boolean;
    name?: boolean;
    ruleset_id?: boolean;
    description?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
}

export interface BeatmapSnapshotIncludeCore extends APIInclude {
    id?: boolean;
    beatmap_id?: boolean;
    user_id?: boolean;
    snapshot_number?: boolean;
    snapshot_date?: boolean;
    accuracy?: boolean;
    ar?: boolean;
    beatmapset_id?: boolean;
    bpm?: boolean;
    checksum?: boolean;
    count_circles?: boolean;
    count_sliders?: boolean;
    count_spinners?: boolean;
    cs?: boolean;
    deleted_at?: boolean;
    difficulty_rating?: boolean;
    drain?: boolean;
    failtimes?: boolean;
    hit_length?: boolean;
    is_scoreable?: boolean;
    last_updated?: boolean;
    max_combo?: boolean;
    mode?: boolean;
    mode_int?: boolean;
    passcount?: boolean;
    playcount?: boolean;
    ranked?: boolean;
    status?: boolean;
    total_length?: boolean;
    url?: boolean;
    version?: boolean;
}

export interface BeatmapSnapshotInclude extends BeatmapSnapshotIncludeCore {
    beatmapset_snapshots?: BeatmapsetSnapshotIncludeShallow | boolean;
    beatmap_tags?: BeatmapTagInclude | boolean;
    leaderboard?: LeaderboardIncludeShallow | boolean;
    owner_profiles?: ProfileInclude | boolean;
}

export interface BeatmapsetSnapshotIncludeCore extends APIInclude {
    id?: boolean;
    beatmapset_id?: boolean;
    user_id?: boolean;
    snapshot_number?: boolean;
    snapshot_date?: boolean;
    checksum?: boolean;
    verified?: boolean;
    artist?: boolean;
    artist_unicode?: boolean;
    availability?: boolean;
    bpm?: boolean;
    can_be_hyped?: boolean;
    covers?: boolean;
    creator?: boolean;
    current_nominations?: boolean;
    deleted_at?: boolean;
    description?: boolean;
    discussion_enabled?: boolean;
    discussion_locked?: boolean;
    favourite_count?: boolean;
    genre?: boolean;
    hype?: boolean;
    is_scoreable?: boolean;
    language?: boolean;
    last_updated?: boolean;
    legacy_thread_url?: boolean;
    nominations_summary?: boolean;
    nsfw?: boolean;
    offset?: boolean;
    pack_tags?: boolean;
    play_count?: boolean;
    preview_url?: boolean;
    ranked?: boolean;
    ranked_date?: boolean;
    rating?: boolean;
    ratings?: boolean;
    source?: boolean;
    spotlight?: boolean;
    status?: boolean;
    storyboard?: boolean;
    submitted_date?: boolean;
    tags?: boolean;
    title?: boolean;
    title_unicode?: boolean;
    track_id?: boolean;
    video?: boolean;
}

export interface BeatmapsetSnapshotIncludeShallow extends BeatmapsetSnapshotIncludeCore {
    beatmapset_tags?: BeatmapsetTagInclude | boolean;
    user_profile?: ProfileInclude | boolean;
}

export interface BeatmapsetSnapshotInclude extends BeatmapsetSnapshotIncludeCore {
    beatmap_snapshots?: BeatmapSnapshotIncludeCore | boolean;
    beatmapset_tags?: BeatmapsetTagInclude | boolean;
    user_profile?: ProfileInclude | boolean;
}

export interface BeatmapsetTagInclude extends APIInclude {
    id?: boolean;
    name?: boolean;
}

export interface UserRoleInclude extends APIInclude {
    id?: boolean;
    name?: boolean;
}

export interface BeatmapIncludeCore extends APIInclude {
    id?: boolean;
    beatmapset_id?: boolean;
    snapshots?: BeatmapsetSnapshotIncludeShallow | boolean;
}

export type BeatmapIncludeShallow = BeatmapIncludeCore;

export interface BeatmapInclude extends BeatmapIncludeCore {
    beatmapset?: BeatmapsetIncludeShallow | boolean;
}

export interface BeatmapsetIncludeCore extends APIInclude {
    id?: boolean;
    user_id?: boolean;
    snapshots?: BeatmapsetSnapshotIncludeShallow | boolean;
}

export type BeatmapsetIncludeShallow = BeatmapsetIncludeCore;

export interface BeatmapsetInclude extends BeatmapsetIncludeCore {
    beatmaps?: BeatmapIncludeShallow | boolean;
}

export interface LeaderboardIncludeCore extends APIInclude {
    id?: boolean;
    beatmap_id?: boolean;
    beatmap_snapshot_id?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    frozen?: boolean;
}

export type LeaderboardIncludeShallow = LeaderboardIncludeCore;

export interface LeaderboardInclude extends LeaderboardIncludeCore {
    beatmap_snapshot?: BeatmapSnapshotIncludeCore | boolean;
}

export interface RequestTaskInclude extends APIInclude {
    user_id?: boolean;
    beatmapset_id?: boolean;
    queue_id?: boolean;
    comment?: boolean;
    mv_checked?: boolean;
    completed_at?: boolean;
    failed_at?: boolean;
    hashed_id?: boolean;
}

export interface SearchInclude extends APIInclude {
    [k: string]: ProfileInclude | BeatmapSnapshotInclude | BeatmapsetSnapshotInclude | QueueInclude | RequestInclude | boolean;
}

export interface UserInclude extends APIInclude {
    id?: boolean;
    profile?: ProfileInclude | boolean;
    roles?: UserRoleInclude | boolean;
}