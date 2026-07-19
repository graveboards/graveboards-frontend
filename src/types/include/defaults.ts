//noinspection JSUnusedGlobalSymbols

import {
    BeatmapInclude,
    BeatmapsetInclude,
    BeatmapsetSnapshotInclude,
    BeatmapSnapshotInclude, QueueInclude, RequestInclude,
    UserInclude
} from "@/types/include/include";

export const DefaultUserInclude = {} satisfies UserInclude;

export const DefaultBeatmapsetInclude = {} satisfies BeatmapsetInclude;

export const DefaultBeatmapInclude = {} satisfies BeatmapInclude;

export const DefaultBeatmapsetSnapshotInclude = {
    beatmapset_id: true,
    snapshot_number: true,
    preview_url: true,
    title: true,
    artist: true,
    covers: true,
    creator: true,
    user_id: true,
    beatmap_snapshots: {
        beatmap_id: true,
        snapshot_number: true,
        mode: true,
        version: true,
        difficulty_rating: true,
    },
    user_profile: {
        user_id: true,
        username: true,
        avatar_url: true,
    },
} satisfies BeatmapsetSnapshotInclude;

export const DefaultBeatmapSnapshotInclude = {} satisfies BeatmapSnapshotInclude;

export const DefaultBeatmapListingsInclude = {
    beatmap_id: true,
    snapshot_number: true,
    difficulty_rating: true,
    mode: true,
    bpm: true,
    ar: true,
    cs: true,
    accuracy: true,
    drain: true,
    hit_length: true,
    url: true,
    version: true,
    beatmapset_snapshots: {
        beatmapset_id: true,
        snapshot_number: true,
        preview_url: true,
        artist: true,
        title: true,
        covers: true,
        creator: true,
        user_id: true,
        user_profile: {
            user_id: true,
            username: true,
            avatar_url: true,
        },
    },
    owner_profiles: true,
} satisfies BeatmapSnapshotInclude;

export const DefaultQueueInclude = {
    user_profile: true,
    manager_profiles: true,
} satisfies QueueInclude;

export const DefaultRequestInclude = {
    beatmapset_snapshot: {
        beatmapset_id: true,
        snapshot_number: true,
        preview_url: true,
        title: true,
        artist: true,
        covers: true,
        creator: true,
        user_id: true,
        beatmap_snapshots: {
            beatmap_id: true,
            snapshot_number: true,
            mode: true,
            version: true,
            difficulty_rating: true,
        },
        user_profile: {
            user_id: true,
            username: true,
            avatar_url: true,
        },
    },
    user_profile: true,
    queue: true,
} satisfies RequestInclude;
