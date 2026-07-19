"use client";

import React from "react";
import {MdPause, MdPlayArrow} from "react-icons/md";
import {formatTime} from "@/utils/time-utils";
import * as Slider from "@radix-ui/react-slider";
import {cn} from "@/lib/utils";
import {useTime} from "@/context/time-context";

interface PreviewPlayerControlsProps {
    disabled: boolean;
    startTime: number;
    audioStartTime: number;
    audioEndTime: number;
    onPlay: (timestamp: number) => void;
    onPause: () => void;
}

const PreviewPlayerControls = ({
    disabled,
    startTime,
    audioStartTime,
    audioEndTime,
    onPlay,
    onPause,
}: PreviewPlayerControlsProps) => {
    const {timestamp, setTimestamp, totalLength, isRunning} = useTime();
    const audioStartRatio = totalLength > 0
        ? Math.min(1, Math.max(0, audioStartTime / totalLength))
        : 0;
    const audioEndRatio = totalLength > 0
        ? Math.min(1, Math.max(audioStartRatio, audioEndTime / totalLength))
        : 0;

    const togglePlayback = () => {
        if (isRunning) {
            onPause();
            return;
        }

        let playbackTimestamp = timestamp;

        if (totalLength > 0 && timestamp >= totalLength - 1) {
            playbackTimestamp = startTime;
            setTimestamp(startTime);
        }

        onPlay(playbackTimestamp);
    };

    return (
        <>
            <button
                type="button"
                aria-label={isRunning ? "Pause preview" : "Play preview"}
                onClick={togglePlayback}
                disabled={disabled}
                className="rounded-full disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isRunning ? <MdPause className="size-8"/> : <MdPlayArrow className="size-8"/>}
            </button>

            <div className="flex flex-col items-center leading-tight tabular-nums text-sm">
                <div className="font-bold">
                    {formatTime(Math.floor(timestamp / 1000))}
                </div>
                <div className="text-tertiary-500">
                    {totalLength > 0 ? formatTime(Math.floor(totalLength / 1000)) : "0:00"}
                </div>
            </div>

            <div className="order-last w-full flex-none sm:order-none sm:min-w-0 sm:w-48 sm:flex-1">
                <Slider.Root
                    min={0}
                    max={1}
                    step={0.001}
                    value={[totalLength > 0 ? Math.min(1, timestamp / totalLength) : 0]}
                    onValueChange={(values) => setTimestamp(values[0] * totalLength)}
                    disabled={disabled || totalLength <= 0}
                    className={cn(
                        "w-full relative flex items-center select-none touch-none h-6",
                        (disabled || totalLength <= 0) && "opacity-50",
                    )}
                >
                    <Slider.Track className="relative grow bg-tertiary-300 dark:bg-tertiary-700 h-1 rounded-full">
                        {audioEndRatio > audioStartRatio && (
                            <span
                                aria-hidden="true"
                                className="absolute -top-1 h-3 rounded-sm bg-primary-500/30"
                                style={{
                                    left: `${audioStartRatio * 100}%`,
                                    width: `${(audioEndRatio - audioStartRatio) * 100}%`,
                                }}
                            />
                        )}
                        <Slider.Range className="absolute bg-primary-500 h-full rounded-full"/>
                    </Slider.Track>
                    <Slider.Thumb
                        aria-label="Preview position"
                        aria-valuetext={`${formatTime(Math.floor(timestamp / 1000))} of ${formatTime(Math.floor(totalLength / 1000))}`}
                        className="relative rounded-full flex items-center justify-center size-4 bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2"
                    />
                </Slider.Root>
            </div>
        </>
    );
};

export default PreviewPlayerControls;
