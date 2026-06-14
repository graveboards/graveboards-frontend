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
    beatmap_snapshots: true,
    user_profile: true,
    preview_url: true,
} satisfies BeatmapsetSnapshotInclude;

export const DefaultBeatmapSnapshotInclude = {} satisfies BeatmapSnapshotInclude;

export const DefaultBeatmapListingsInclude = {
    difficulty_rating: true,
    bpm: true,
    ar: true,
    cs: true,
    accuracy: true,
    drain: true,
    hit_length: true,
    url: true,
    version: true,
    beatmapset_snapshots: {
        artist: true,
        title: true,
        user_profile: true,
    },
    owner_profiles: true,
} satisfies BeatmapSnapshotInclude;

export const DefaultQueueInclude = {
    user_profile: true,
    manager_profiles: true,
} satisfies QueueInclude;

export const DefaultRequestInclude = {
    beatmapset_snapshot: {
        beatmap_snapshots: true,
        user_profile: true,
        preview_url: true,
    },
    user_profile: true,
    queue: true,
} satisfies RequestInclude;
