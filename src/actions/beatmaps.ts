"use server"

import {SERVER_API_URL} from "@/lib/server-api-url";
import {verifySession} from "@/actions/session";
import type {BeatmapPreviewDifficulty} from "@/types/beatmap-preview";

export type BeatmapOsuFileResult =
    | {ok: true; text: string; fallback: boolean}
    | {ok: false; message: string; reason?: "unauthenticated"};

export type BeatmapPreviewDifficultiesResult =
    | {ok: true; difficulties: BeatmapPreviewDifficulty[]}
    | {ok: false; message: string; reason?: "unauthenticated"};

const FETCH_TIMEOUT_MS = 8_000;
const DIFFICULTIES_QUERY = new URLSearchParams({
    "include[beatmap_snapshots][beatmap_id]": "true",
    "include[beatmap_snapshots][snapshot_number]": "true",
    "include[beatmap_snapshots][mode]": "true",
    "include[beatmap_snapshots][version]": "true",
    "include[beatmap_snapshots][difficulty_rating]": "true",
}).toString();

export const getBeatmapOsuFile = async (
    id: number,
    snapshotNumber: number,
): Promise<BeatmapOsuFileResult> => {
    const session = await verifySession();

    if (!session) {
        return {
            ok: false,
            message: "Sign in to view the beatmap preview.",
            reason: "unauthenticated",
        };
    }

    try {
        const response = await fetch(`${SERVER_API_URL}/beatmaps/${id}/snapshots/${snapshotNumber}/osu`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${session.token}`,
            },
            cache: "no-store",
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });

        if (response.ok) {
            return {
                ok: true,
                text: await response.text(),
                fallback: false,
            };
        }
    } catch {
        // Fall through to the current public beatmap version.
    }

    try {
        const fallbackResponse = await fetch(`https://osu.ppy.sh/osu/${id}`, {
            method: "GET",
            cache: "no-store",
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });

        if (fallbackResponse.ok) {
            return {
                ok: true,
                text: await fallbackResponse.text(),
                fallback: true,
            };
        }
    } catch {
        // Both sources are best-effort. The caller keeps audio controls available.
    }

    return {
        ok: false,
        message: "The beatmap preview could not be loaded.",
    };
};

export const getBeatmapPreviewDifficulties = async (
    beatmapsetId: number,
    snapshotNumber: number,
): Promise<BeatmapPreviewDifficultiesResult> => {
    const session = await verifySession();

    if (!session) {
        return {
            ok: false,
            message: "Sign in to view beatmap difficulties.",
            reason: "unauthenticated",
        };
    }

    try {
        const response = await fetch(
            `${SERVER_API_URL}/beatmapsets/${beatmapsetId}/snapshots/${snapshotNumber}?${DIFFICULTIES_QUERY}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${session.token}`,
                },
                cache: "no-store",
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            },
        );

        if (!response.ok) {
            return {
                ok: false,
                message: "The beatmap difficulties could not be loaded.",
            };
        }

        const beatmapset = await response.json() as {
            beatmap_snapshots?: Array<{
                beatmap_id: number;
                snapshot_number: number;
                mode: BeatmapPreviewDifficulty["mode"];
                version: string;
                difficulty_rating: number;
            }>;
        };
        const difficulties = (beatmapset.beatmap_snapshots ?? [])
            .filter((beatmap) => beatmap.mode === "osu")
            .map((beatmap) => ({
                beatmapId: beatmap.beatmap_id,
                snapshotNumber: beatmap.snapshot_number,
                mode: beatmap.mode,
                version: beatmap.version,
                difficultyRating: beatmap.difficulty_rating,
            }))
            .sort((a, b) => a.difficultyRating - b.difficultyRating);

        return {
            ok: true,
            difficulties,
        };
    } catch {
        return {
            ok: false,
            message: "The beatmap difficulties could not be loaded.",
        };
    }
};
