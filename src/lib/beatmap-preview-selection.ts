import {BeatmapSnapshot} from "@/types/beatmap";
import {BeatmapPreviewDifficulty, BeatmapPreviewSelection} from "@/types/beatmap-preview";
import {BeatmapsetSnapshot, GameMode} from "@/types/beatmapset";

const createDifficulty = (beatmap: BeatmapSnapshot): BeatmapPreviewDifficulty => ({
    beatmapId: beatmap.beatmap_id,
    snapshotNumber: beatmap.snapshot_number,
    mode: beatmap.mode,
    version: beatmap.version,
    difficultyRating: beatmap.difficulty_rating,
});

export const getDefaultBeatmapPreview = (
    beatmapset: BeatmapsetSnapshot,
): BeatmapSnapshot | undefined => {
    const standardDifficulties = beatmapset.beatmap_snapshots.filter(
        (beatmap) => beatmap.mode === GameMode.Osu,
    );
    const candidates = standardDifficulties.length > 0
        ? standardDifficulties
        : beatmapset.beatmap_snapshots;

    return candidates.reduce<BeatmapSnapshot | undefined>((hardest, beatmap) => (
        !hardest || beatmap.difficulty_rating > hardest.difficulty_rating ? beatmap : hardest
    ), undefined);
};

export const createBeatmapPreviewSelection = (
    beatmap: BeatmapSnapshot,
    beatmapset: BeatmapsetSnapshot,
): BeatmapPreviewSelection => {
    const currentDifficulty = createDifficulty(beatmap);
    const difficultiesComplete = Array.isArray(beatmapset.beatmap_snapshots);
    const difficulties = difficultiesComplete
        ? [...beatmapset.beatmap_snapshots]
            .filter((difficulty) => difficulty.mode === GameMode.Osu)
            .map(createDifficulty)
        : [];

    const hasCurrentDifficulty = difficulties.some((difficulty) =>
        difficulty.beatmapId === currentDifficulty.beatmapId
        && difficulty.snapshotNumber === currentDifficulty.snapshotNumber
    );

    if (!hasCurrentDifficulty) {
        difficulties.push(currentDifficulty);
    }

    difficulties.sort((a, b) =>
        a.difficultyRating - b.difficultyRating
        || a.version.localeCompare(b.version)
        || a.beatmapId - b.beatmapId
        || a.snapshotNumber - b.snapshotNumber
    );

    return {
        ...currentDifficulty,
        beatmapsetId: beatmapset.beatmapset_id,
        beatmapsetSnapshotNumber: beatmapset.snapshot_number,
        previewUrl: beatmapset.preview_url,
        title: beatmapset.title,
        artist: beatmapset.artist,
        coverUrl: beatmapset.covers?.cover,
        mapperName: beatmapset.user_profile?.username || beatmapset.creator,
        mapperAvatarUrl: beatmapset.user_profile?.avatar_url,
        mapperUserId: beatmapset.user_profile?.user_id ?? beatmapset.user_id,
        difficulties,
        difficultiesComplete,
    };
};
