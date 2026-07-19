"use client";

import React, {
    createContext,
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import "osu-beatmap-preview/assets/fonts/torus.css";
import {StandardBeatmapPreview} from "osu-beatmap-preview";
import {getBeatmapOsuFile, getBeatmapPreviewDifficulties} from "@/actions/beatmaps";
import {BeatmapDifficultySection, BeatmapMetadataSection} from "osu-classes";
import {GameMode} from "@/types/beatmapset";
import {useAuth} from "@/context/auth-context";
import type {BeatmapPreviewDifficulty, BeatmapPreviewSelection} from "@/types/beatmap-preview";

export type GameplayPreviewStatus = "idle" | "loading" | "ready" | "restricted" | "unsupported" | "error";

interface BeatmapPreviewContextProps {
    selection: BeatmapPreviewSelection | null;
    selectBeatmap: (selection: BeatmapPreviewSelection) => void;
    difficulties: BeatmapPreviewDifficulty[];
    difficultiesLoading: boolean;
    selectDifficulty: (difficulty: BeatmapPreviewDifficulty) => void;
    clearBeatmap: () => void;
    retryPreview: () => void;
    previewerRef: React.RefObject<StandardBeatmapPreview | null>;
    initializePreviewer: (canvas: HTMLCanvasElement) => void;
    gameplayStatus: GameplayPreviewStatus;
    gameplayError: string | null;
    gameplayNotice: string | null;
    metadata: BeatmapMetadataSection | null;
    difficulty: BeatmapDifficultySection | null;
    beatmapLength: number;
    previewTime: number;
    volume: number;
    setVolume: (volume: number) => void;
}

export const BeatmapPreviewContext = createContext<BeatmapPreviewContextProps | null>(null);

const mergeDifficulties = (
    ...difficultyLists: BeatmapPreviewDifficulty[][]
): BeatmapPreviewDifficulty[] => {
    const difficultiesByKey = new Map<string, BeatmapPreviewDifficulty>();

    difficultyLists.flat().forEach((difficulty) => {
        difficultiesByKey.set(
            `${difficulty.beatmapId}:${difficulty.snapshotNumber}`,
            difficulty,
        );
    });

    return [...difficultiesByKey.values()]
        .sort((a, b) => a.difficultyRating - b.difficultyRating);
};

export const BeatmapPreviewProvider: FC<{ children: React.ReactNode }> = ({children}) => {
    const {isAuthenticated, isLoading: authLoading} = useAuth();
    const previewerRef = useRef<StandardBeatmapPreview | null>(null);
    const loadGenerationRef = useRef(0);
    const difficultiesGenerationRef = useRef(0);

    const [previewerReady, setPreviewerReady] = useState(false);
    const [selection, setSelection] = useState<BeatmapPreviewSelection | null>(null);
    const [difficulties, setDifficulties] = useState<BeatmapPreviewDifficulty[]>([]);
    const [difficultiesLoading, setDifficultiesLoading] = useState(false);
    const [gameplayStatus, setGameplayStatus] = useState<GameplayPreviewStatus>("idle");
    const [gameplayError, setGameplayError] = useState<string | null>(null);
    const [gameplayNotice, setGameplayNotice] = useState<string | null>(null);
    const [retryAttempt, setRetryAttempt] = useState(0);

    const [metadata, setMetadata] = useState<BeatmapMetadataSection | null>(null);
    const [difficulty, setDifficulty] = useState<BeatmapDifficultySection | null>(null);
    const [beatmapLength, setBeatmapLength] = useState(0);
    const [previewTime, setPreviewTime] = useState(0);

    const [volume, setVolumeState] = useState(0.5);
    const [volumeReady, setVolumeReady] = useState(false);

    const initializePreviewer = useCallback((canvas: HTMLCanvasElement) => {
        if (!isAuthenticated) {
            previewerRef.current?.dispose();
            previewerRef.current = null;
            setPreviewerReady(false);
            return;
        }

        previewerRef.current?.dispose();
        previewerRef.current = new StandardBeatmapPreview(canvas, {
            width: 640,
            height: 480,
            useBeatmapPreviewTime: false,
        });
        setPreviewerReady(true);
    }, [isAuthenticated]);

    useEffect(() => () => {
        loadGenerationRef.current += 1;
        previewerRef.current?.dispose();
        previewerRef.current = null;
    }, []);

    useEffect(() => {
        const storageVolume = localStorage.getItem("volume");
        const parsedVolume = storageVolume ? Number.parseFloat(storageVolume) : 0.5;
        setVolumeState(Number.isFinite(parsedVolume) ? Math.min(1, Math.max(0, parsedVolume)) : 0.5);
        setVolumeReady(true);
    }, []);

    useEffect(() => {
        if (volumeReady) {
            localStorage.setItem("volume", volume.toString());
        }
    }, [volume, volumeReady]);

    const setVolume = useCallback((nextVolume: number) => {
        setVolumeState(Math.min(1, Math.max(0, nextVolume)));
    }, []);

    const selectBeatmap = useCallback((nextSelection: BeatmapPreviewSelection) => {
        loadGenerationRef.current += 1;
        difficultiesGenerationRef.current += 1;
        setSelection(nextSelection);
        setDifficulties(mergeDifficulties(nextSelection.difficulties));
        setDifficultiesLoading(false);
        setMetadata(null);
        setDifficulty(null);
        setBeatmapLength(0);
        setPreviewTime(0);
        setGameplayError(null);
        setGameplayNotice(null);
        setGameplayStatus(nextSelection.mode !== GameMode.Osu
            ? "unsupported"
            : authLoading || isAuthenticated
                ? "loading"
                : "restricted");
    }, [authLoading, isAuthenticated]);

    const selectDifficulty = useCallback((nextDifficulty: BeatmapPreviewDifficulty) => {
        if (
            !selection
            || (
                selection.beatmapId === nextDifficulty.beatmapId
                && selection.snapshotNumber === nextDifficulty.snapshotNumber
            )
        ) {
            return;
        }

        loadGenerationRef.current += 1;
        setSelection({
            ...selection,
            beatmapId: nextDifficulty.beatmapId,
            snapshotNumber: nextDifficulty.snapshotNumber,
            mode: nextDifficulty.mode,
            version: nextDifficulty.version,
            difficultyRating: nextDifficulty.difficultyRating,
        });
        setDifficulty(null);
        setGameplayError(null);
        setGameplayNotice(null);
        setGameplayStatus(nextDifficulty.mode !== GameMode.Osu
            ? "unsupported"
            : authLoading || isAuthenticated
                ? "loading"
                : "restricted");
    }, [authLoading, isAuthenticated, selection]);

    const clearBeatmap = useCallback(() => {
        loadGenerationRef.current += 1;
        difficultiesGenerationRef.current += 1;
        setSelection(null);
        setDifficulties([]);
        setDifficultiesLoading(false);
        setMetadata(null);
        setDifficulty(null);
        setBeatmapLength(0);
        setPreviewTime(0);
        setGameplayError(null);
        setGameplayNotice(null);
        setGameplayStatus("idle");
        previewerRef.current?.clear();
    }, []);

    const retryPreview = useCallback(() => {
        if (
            authLoading
            || !isAuthenticated
            || selection?.mode !== GameMode.Osu
        ) {
            return;
        }

        setGameplayError(null);
        setGameplayNotice(null);
        setGameplayStatus("loading");
        setRetryAttempt((attempt) => attempt + 1);
    }, [authLoading, isAuthenticated, selection]);

    useEffect(() => {
        const beatmapsetId = selection?.beatmapsetId;
        const beatmapsetSnapshotNumber = selection?.beatmapsetSnapshotNumber;

        if (
            !beatmapsetId
            || !beatmapsetSnapshotNumber
            || selection?.difficultiesComplete
            || authLoading
            || !isAuthenticated
        ) {
            return;
        }

        const generation = ++difficultiesGenerationRef.current;
        setDifficultiesLoading(true);

        const loadDifficulties = async () => {
            const result = await getBeatmapPreviewDifficulties(
                beatmapsetId,
                beatmapsetSnapshotNumber,
            );

            if (generation !== difficultiesGenerationRef.current) {
                return;
            }

            setDifficultiesLoading(false);

            if (result.ok) {
                setDifficulties((current) => mergeDifficulties(current, result.difficulties));
            }
        };

        void loadDifficulties();
    }, [
        authLoading,
        isAuthenticated,
        selection?.beatmapsetId,
        selection?.beatmapsetSnapshotNumber,
        selection?.difficultiesComplete,
    ]);

    useEffect(() => {
        if (!selection || authLoading) {
            return;
        }

        if (!isAuthenticated) {
            loadGenerationRef.current += 1;
            previewerRef.current?.clear();
            setMetadata(null);
            setDifficulty(null);
            setBeatmapLength(0);
            setPreviewTime(0);
            setGameplayError(null);
            setGameplayNotice(null);
            setGameplayStatus(selection.mode === GameMode.Osu ? "restricted" : "unsupported");
            return;
        }

        if (!previewerReady) {
            return;
        }

        if (selection.mode !== GameMode.Osu) {
            previewerRef.current?.clear();
            setGameplayStatus("unsupported");
            return;
        }

        const generation = ++loadGenerationRef.current;
        setGameplayStatus("loading");
        setGameplayError(null);

        const loadBeatmap = async () => {
            try {
                const result = await getBeatmapOsuFile(selection.beatmapId, selection.snapshotNumber);

                if (generation !== loadGenerationRef.current) {
                    return;
                }

                if (!previewerRef.current) {
                    setGameplayStatus("error");
                    setGameplayError("The beatmap renderer could not be initialized.");
                    return;
                }

                if (!result.ok) {
                    previewerRef.current.clear();
                    setGameplayStatus(result.reason === "unauthenticated" ? "restricted" : "error");
                    setGameplayError(result.message);
                    return;
                }

                const beatmap = previewerRef.current.loadBeatmapText(result.text);

                if (generation !== loadGenerationRef.current) {
                    return;
                }

                const totalLength = Math.max(0, beatmap.totalLength);
                const normalizedPreviewTime = beatmap.general.previewTime >= 0
                    ? Math.min(beatmap.general.previewTime, totalLength)
                    : 0;

                setMetadata(beatmap.metadata || null);
                setDifficulty(beatmap.difficulty || null);
                setBeatmapLength(totalLength);
                setPreviewTime(normalizedPreviewTime);
                setGameplayNotice(result.fallback
                    ? "Showing the latest osu! version because this archived snapshot is unavailable."
                    : null);
                previewerRef.current.render(normalizedPreviewTime);
                setGameplayStatus("ready");
            } catch {
                if (generation !== loadGenerationRef.current) {
                    return;
                }

                previewerRef.current?.clear();
                setGameplayStatus("error");
                setGameplayError("The beatmap preview could not be loaded.");
            }
        };

        void loadBeatmap();
    }, [authLoading, isAuthenticated, previewerReady, retryAttempt, selection]);

    const value = useMemo(() => ({
        selection,
        selectBeatmap,
        difficulties,
        difficultiesLoading,
        selectDifficulty,
        clearBeatmap,
        retryPreview,
        previewerRef,
        initializePreviewer,
        gameplayStatus,
        gameplayError,
        gameplayNotice,
        metadata,
        difficulty,
        beatmapLength,
        previewTime,
        volume,
        setVolume,
    }), [
        clearBeatmap,
        beatmapLength,
        difficulties,
        difficultiesLoading,
        difficulty,
        gameplayError,
        gameplayNotice,
        gameplayStatus,
        initializePreviewer,
        metadata,
        previewTime,
        retryPreview,
        selectBeatmap,
        selectDifficulty,
        selection,
        setVolume,
        volume,
    ]);

    return (
        <BeatmapPreviewContext.Provider value={value}>
            {children}
        </BeatmapPreviewContext.Provider>
    );
};

export const useBeatmapPreview = (): BeatmapPreviewContextProps => {
    const context = useContext(BeatmapPreviewContext);

    if (!context) {
        throw new Error("useBeatmapPreview must be used within a BeatmapPreviewProvider");
    }

    return context;
};
