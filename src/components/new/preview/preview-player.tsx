"use client";

import React, {useEffect, useRef, useState} from "react";
import {useBeatmapPreview} from "@/context/preview-context";
import {MdClose, MdErrorOutline, MdHistory, MdLockOutline, MdMusicNote, MdRefresh} from "react-icons/md";
import {useTime} from "@/context/time-context";
import PreviewPlayerVolume from "@/components/new/preview/preview-player-volume";
import PreviewPlayerControls from "@/components/new/preview/preview-player-controls";
import PreviewPlayerDifficultySelect from "@/components/new/preview/preview-player-difficulty-select";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const AUDIO_SYNC_TOLERANCE_MS = 120;

type TimelineMode = "pending" | "audio" | "beatmap";

const PreviewPlayer = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasViewportRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioPlayPendingRef = useRef(false);
    const timelineModeRef = useRef<TimelineMode>("pending");
    const timelineBeatmapKeyRef = useRef<string | null>(null);

    const [canvasScale, setCanvasScale] = useState(1);
    const [audioReady, setAudioReady] = useState(false);
    const [audioDuration, setAudioDuration] = useState(0);
    const [audioError, setAudioError] = useState<string | null>(null);

    const {
        timestamp,
        setTimestamp,
        totalLength,
        setTotalLength,
        isRunning,
        start,
        stop,
        reset,
    } = useTime();
    const {
        selection,
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
        beatmapLength,
        previewTime,
        volume,
    } = useBeatmapPreview();
    const selectedBeatmapKey = selection
        ? `${selection.beatmapId}:${selection.snapshotNumber}`
        : null;
    const selectedBeatmapsetKey = selection
        ? `${selection.beatmapsetId}:${selection.beatmapsetSnapshotNumber}`
        : null;

    useEffect(() => {
        if (canvasRef.current) {
            initializePreviewer(canvasRef.current);
        }
    }, [initializePreviewer, selectedBeatmapsetKey]);

    useEffect(() => {
        const viewport = canvasViewportRef.current;

        if (!viewport) {
            return;
        }

        const resizeCanvas = () => {
            setCanvasScale(viewport.clientWidth / CANVAS_WIDTH);
        };
        const observer = new ResizeObserver(resizeCanvas);

        resizeCanvas();
        observer.observe(viewport);
        return () => observer.disconnect();
    }, [selectedBeatmapsetKey]);

    useEffect(() => {
        reset();
        setTotalLength(0);
        setAudioReady(false);
        setAudioDuration(0);
        setAudioError(null);
        audioPlayPendingRef.current = false;
        timelineModeRef.current = "pending";
        timelineBeatmapKeyRef.current = null;

        if (selectedBeatmapsetKey) {
            audioRef.current?.load();
        }
    }, [reset, selectedBeatmapsetKey, selection?.previewUrl, setTotalLength]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [selectedBeatmapsetKey, volume]);

    useEffect(() => {
        const audioIsAvailable = audioReady && audioDuration > 0;

        if (!selectedBeatmapsetKey || audioIsAvailable || audioError) {
            return;
        }

        const timeout = window.setTimeout(() => {
            if (!audioReady || audioDuration <= 0) {
                setAudioError("The audio preview took too long to load.");
            }
        }, 15_000);

        return () => window.clearTimeout(timeout);
    }, [audioDuration, audioError, audioReady, selectedBeatmapsetKey]);

    useEffect(() => {
        if (!selectedBeatmapKey) {
            return;
        }

        const hasBeatmapTimeline = gameplayStatus === "ready" && beatmapLength > 0;
        const audioHasSettled = (audioReady && audioDuration > 0) || Boolean(audioError);
        const beatmapTimelineChanged = timelineBeatmapKeyRef.current !== selectedBeatmapKey;

        if (
            hasBeatmapTimeline
            && audioHasSettled
            && (timelineModeRef.current !== "beatmap" || beatmapTimelineChanged)
        ) {
            const wasPending = timelineModeRef.current === "pending";
            const audioOffset = audioReady && audioDuration > 0
                ? (audioRef.current?.currentTime ?? 0) * 1000
                : 0;
            const timelineLength = Math.max(beatmapLength, previewTime + audioDuration);
            const initialTimestamp = Math.min(previewTime + audioOffset, timelineLength);

            timelineModeRef.current = "beatmap";
            timelineBeatmapKeyRef.current = selectedBeatmapKey;
            setTotalLength(timelineLength);
            setTimestamp(initialTimestamp);

            if (wasPending || isRunning) {
                start();
            }
            return;
        }

        const shouldUseAudioTimeline = (
            gameplayStatus === "restricted"
            || gameplayStatus === "unsupported"
            || gameplayStatus === "error"
            || (gameplayStatus === "ready" && beatmapLength <= 0)
        );

        if (
            shouldUseAudioTimeline
            && audioReady
            && audioDuration > 0
            && timelineModeRef.current !== "audio"
        ) {
            const wasPending = timelineModeRef.current === "pending";
            const audioTimestamp = Math.min(
                (audioRef.current?.currentTime ?? 0) * 1000,
                audioDuration,
            );

            timelineModeRef.current = "audio";
            setTotalLength(audioDuration);
            setTimestamp(wasPending ? 0 : audioTimestamp);

            if (wasPending || isRunning) {
                start();
            }
        }
    }, [
        audioDuration,
        audioError,
        audioReady,
        beatmapLength,
        gameplayStatus,
        isRunning,
        previewTime,
        selectedBeatmapKey,
        setTimestamp,
        setTotalLength,
        start,
    ]);

    useEffect(() => {
        if (
            gameplayStatus === "ready"
            && timelineModeRef.current === "beatmap"
            && totalLength > 0
        ) {
            previewerRef.current?.render(timestamp);
        }
    }, [gameplayStatus, previewerRef, timestamp, totalLength]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            audioPlayPendingRef.current = false;
            return;
        }

        const mediaDuration = audio.duration;
        const mediaIsReady = audioReady
            && audio.readyState > HTMLMediaElement.HAVE_NOTHING
            && Number.isFinite(mediaDuration)
            && mediaDuration > 0;

        if (!mediaIsReady || audioDuration <= 0 || audioError) {
            if (!audio.paused) {
                audio.pause();
            }
            audioPlayPendingRef.current = false;
            return;
        }

        const audioStartTime = timelineModeRef.current === "beatmap" ? previewTime : 0;
        const audioEndTime = audioStartTime + audioDuration;
        const isInsideAudioWindow = (
            timestamp >= audioStartTime
            && timestamp < audioEndTime
        );

        if (isInsideAudioWindow) {
            const expectedAudioTime = (timestamp - audioStartTime) / 1000;

            if (Math.abs(audio.currentTime - expectedAudioTime) * 1000 > AUDIO_SYNC_TOLERANCE_MS) {
                audio.currentTime = Math.min(expectedAudioTime, mediaDuration);
            }
        } else {
            const boundaryTime = timestamp < audioStartTime ? 0 : audioDuration / 1000;

            if (Math.abs(audio.currentTime - boundaryTime) * 1000 > AUDIO_SYNC_TOLERANCE_MS) {
                audio.currentTime = Math.min(boundaryTime, mediaDuration);
            }
        }

        const isAtAudioEnd = audio.ended
            && audio.duration - audio.currentTime <= AUDIO_SYNC_TOLERANCE_MS / 1000;

        if (isRunning && isInsideAudioWindow && !isAtAudioEnd) {
            if (audio.paused && !audioPlayPendingRef.current) {
                audioPlayPendingRef.current = true;
                void audio.play()
                    .then(() => {
                        if (audioRef.current === audio) {
                            audioPlayPendingRef.current = false;
                        }
                    })
                    .catch((error: DOMException) => {
                        if (audioRef.current !== audio) {
                            return;
                        }

                        audioPlayPendingRef.current = false;
                        if (error.name !== "AbortError") {
                            stop();
                        }
                    });
            }
        } else {
            if (!audio.paused) {
                audio.pause();
            }
            audioPlayPendingRef.current = false;
        }
    }, [
        audioDuration,
        audioError,
        audioReady,
        isRunning,
        previewTime,
        selection?.beatmapId,
        selection?.snapshotNumber,
        stop,
        timestamp,
    ]);

    if (!selection) {
        return null;
    }

    const displayTitle = metadata?.title || selection.title;
    const displayArtist = metadata?.artist || selection.artist;
    const selectedDifficulty = difficulties.find((difficulty) => (
        difficulty.beatmapId === selection.beatmapId
        && difficulty.snapshotNumber === selection.snapshotNumber
    )) ?? {
        beatmapId: selection.beatmapId,
        snapshotNumber: selection.snapshotNumber,
        mode: selection.mode,
        version: selection.version,
        difficultyRating: selection.difficultyRating,
    };
    const selectableDifficulties = selection.mode === "osu"
        ? difficulties.filter((difficulty) => difficulty.mode === "osu")
        : [selectedDifficulty];
    const timelineStart = timelineModeRef.current === "beatmap" ? previewTime : 0;
    const audioWindowEnd = timelineStart + audioDuration;
    const controlsDisabled = totalLength <= 0;
    const playTimeline = (playbackTimestamp: number) => {
        const audio = audioRef.current;
        const canPlayAudio = audio
            && audioReady
            && audioDuration > 0
            && !audioError
            && audio.readyState > HTMLMediaElement.HAVE_NOTHING
            && Number.isFinite(audio.duration)
            && audio.duration > 0
            && playbackTimestamp >= timelineStart
            && playbackTimestamp < audioWindowEnd;

        if (canPlayAudio) {
            const expectedAudioTime = (playbackTimestamp - timelineStart) / 1000;

            if (Math.abs(audio.currentTime - expectedAudioTime) * 1000 > AUDIO_SYNC_TOLERANCE_MS) {
                audio.currentTime = Math.min(expectedAudioTime, audio.duration);
            }

            audioPlayPendingRef.current = true;
            void audio.play()
                .then(() => {
                    if (audioRef.current === audio) {
                        audioPlayPendingRef.current = false;
                    }
                })
                .catch(() => {
                    if (audioRef.current === audio) {
                        audioPlayPendingRef.current = false;
                        stop();
                    }
                });
        } else {
            audio?.pause();
            audioPlayPendingRef.current = false;
        }

        start();
    };
    const pauseTimeline = () => {
        stop();
        audioRef.current?.pause();
        audioPlayPendingRef.current = false;
    };
    const retryAudio = () => {
        setAudioError(null);
        setAudioReady(false);
        setAudioDuration(0);
        audioPlayPendingRef.current = false;
        audioRef.current?.load();
    };

    return (
        <aside
            aria-label="Beatmap preview player"
            data-gameplay-status={gameplayStatus}
            data-timeline-mode={timelineModeRef.current}
            data-preview-time={Math.round(previewTime)}
            data-current-time={Math.round(timestamp)}
            data-audio-window-end={Math.round(audioWindowEnd)}
            className="bg-tertiary-100 sm:m-4 z-40 dark:bg-tertiary-900 shadow-xl sm:rounded-xl fixed bottom-0 right-0 overflow-hidden w-full sm:w-[40rem] sm:max-w-[calc(100%-2rem)] md:max-w-[calc(100%-18rem)]"
        >
            <audio
                ref={audioRef}
                key={selectedBeatmapsetKey}
                src={selection.previewUrl}
                preload="auto"
                onLoadedMetadata={() => {
                    const audio = audioRef.current;

                    if (audio) {
                        audio.volume = volume;

                        if (Number.isFinite(audio.duration)) {
                            setAudioDuration(audio.duration * 1000);
                        }
                    }
                }}
                onCanPlay={() => {
                    setAudioReady(true);
                    setAudioError(null);
                }}
                onError={() => {
                    setAudioReady(false);
                    setAudioDuration(0);
                    setAudioError("The audio preview could not be loaded.");

                    if (timelineModeRef.current === "audio") {
                        timelineModeRef.current = "pending";
                        stop();
                        setTimestamp(0);
                        setTotalLength(0);
                    }
                }}
                onEnded={() => {
                    audioPlayPendingRef.current = false;
                }}
            />

            <div
                ref={canvasViewportRef}
                className="relative bg-tertiary-800 dark:bg-tertiary-900 overflow-hidden aspect-4/3"
                style={selection.coverUrl ? {
                    backgroundImage: `linear-gradient(rgb(0 0 0 / 55%), rgb(0 0 0 / 70%)), url(${selection.coverUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                } : undefined}
            >
                <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label={`Gameplay preview for ${displayTitle}`}
                    aria-hidden={gameplayStatus !== "ready"}
                    className={`absolute left-0 top-0 origin-top-left transition-opacity ${gameplayStatus === "ready" ? "opacity-100" : "opacity-0"}`}
                    style={{
                        height: CANVAS_HEIGHT,
                        width: CANVAS_WIDTH,
                        transform: `scale(${canvasScale})`,
                    }}
                />

                {gameplayStatus !== "ready" && (
                    <div
                        aria-live="polite"
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center text-white"
                    >
                        {gameplayStatus === "loading" && (
                            <>
                                <div
                                    className="size-8 rounded-full border-2 border-white/30 border-t-white animate-spin"/>
                                <span className="text-sm">Loading beatmap preview…</span>
                            </>
                        )}

                        {gameplayStatus === "unsupported" && (
                            <>
                                <MdMusicNote className="size-9"/>
                                <span className="font-semibold">Audio preview</span>
                                <span className="text-sm text-white/75">
                                    Beatmap rendering currently supports only osu!standard maps.
                                </span>
                            </>
                        )}

                        {gameplayStatus === "restricted" && (
                            <>
                                <MdLockOutline className="size-9"/>
                                <span className="font-semibold">Sign in for beatmap preview</span>
                                <span className="text-sm text-white/75">
                                    Visual beatmap previews are available to logged-in users. Audio remains available.
                                </span>
                            </>
                        )}

                        {gameplayStatus === "error" && (
                            <>
                                <MdErrorOutline className="size-9"/>
                                <span className="font-semibold">
                                    {audioError ? "Preview unavailable" : "Audio preview is still available"}
                                </span>
                                <span className="text-sm text-white/75">{gameplayError}</span>
                                <button
                                    onClick={retryPreview}
                                    className="mt-1 flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25"
                                >
                                    <MdRefresh className="size-4"/>
                                    Retry
                                </button>
                            </>
                        )}
                    </div>
                )}

                <div
                    className="absolute inset-x-0 top-0 z-20 flex py-3 items-center justify-between gap-3 bg-linear-to-b from-black/80 to-transparent px-3 text-white">
                    <div className="min-w-0 flex-1 drop-shadow-md">
                        <div className="truncate text-lg font-bold">
                            {displayArtist} - {displayTitle}
                        </div>
                        <div className="flex min-w-0 items-center gap-1">
                            <span className="shrink-0">Mapped by</span>
                            {selection.mapperAvatarUrl && (
                                <span
                                    role="img"
                                    aria-label={`${selection.mapperName}'s avatar`}
                                    className="size-6 shrink-0 rounded-full bg-cover bg-center"
                                    style={{backgroundImage: `url(${selection.mapperAvatarUrl})`}}
                                />
                            )}
                            {selection.mapperUserId ? (
                                <a
                                    href={`https://osu.ppy.sh/users/${selection.mapperUserId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate font-bold hover:underline"
                                >
                                    {selection.mapperName}
                                </a>
                            ) : (
                                <span className="truncate font-bold">{selection.mapperName}</span>
                            )}
                        </div>
                    </div>

                    <PreviewPlayerDifficultySelect
                        difficulties={selectableDifficulties}
                        selected={selectedDifficulty}
                        disabled={difficultiesLoading || selectableDifficulties.length < 2}
                        onSelect={selectDifficulty}
                    />
                </div>

                {gameplayStatus === "ready" && gameplayNotice && (
                    <div
                        className="absolute inset-x-0 bottom-2 mx-auto flex w-fit max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-lg bg-black/65 px-2.5 py-1.5 text-center text-xs text-white/85">
                        <MdHistory className="size-4 shrink-0"/>
                        <span>{gameplayNotice}</span>
                    </div>
                )}
            </div>

            {audioError && (
                <div
                    role="alert"
                    className="flex items-center justify-between gap-3 bg-red-100 px-4 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200"
                >
                    <span>{audioError}</span>
                    <button type="button" onClick={retryAudio} className="flex shrink-0 items-center gap-1 font-bold">
                        <MdRefresh className="size-4"/>
                        Retry audio
                    </button>
                </div>
            )}

            <div className="flex flex-wrap min-w-0 items-center gap-3 p-4 sm:flex-nowrap sm:gap-4">
                <PreviewPlayerControls
                    disabled={controlsDisabled}
                    startTime={timelineStart}
                    audioStartTime={timelineStart}
                    audioEndTime={audioWindowEnd}
                    onPlay={playTimeline}
                    onPause={pauseTimeline}
                />
                <PreviewPlayerVolume disabled={Boolean(audioError)}/>
                <button
                    type="button"
                    aria-label="Close preview"
                    onClick={clearBeatmap}
                    className="shrink-0 rounded-full p-1 hover:bg-tertiary-200 dark:hover:bg-tertiary-800"
                >
                    <MdClose className="size-6"/>
                </button>
            </div>
        </aside>
    );
};

export default PreviewPlayer;
