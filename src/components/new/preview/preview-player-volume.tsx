"use client";

import React, {useEffect, useRef} from "react";
import {useBeatmapPreview} from "@/context/preview-context";
import {MdVolumeOff, MdVolumeUp} from "react-icons/md";
import * as Slider from "@radix-ui/react-slider";
import {cn} from "@/lib/utils";

interface PreviewPlayerVolumeProps {
    disabled: boolean;
}

const PreviewPlayerVolume = ({disabled}: PreviewPlayerVolumeProps) => {
    const {volume, setVolume} = useBeatmapPreview();
    const previousVolumeRef = useRef(0.5);

    useEffect(() => {
        if (volume > 0) {
            previousVolumeRef.current = volume;
        }
    }, [volume]);

    const toggleMuted = () => {
        if (volume === 0) {
            setVolume(previousVolumeRef.current);
        } else {
            previousVolumeRef.current = volume;
            setVolume(0);
        }
    };

    return (
        <div className="ml-auto flex items-center gap-2">
            <button
                type="button"
                aria-label={volume === 0 ? "Unmute preview" : "Mute preview"}
                onClick={toggleMuted}
                disabled={disabled}
                className="disabled:cursor-not-allowed disabled:opacity-40"
            >
                {volume === 0
                    ? <MdVolumeOff className="size-6"/>
                    : <MdVolumeUp className="size-6"/>}
            </button>

            <Slider.Root
                min={0}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={(values) => setVolume(values[0])}
                disabled={disabled}
                className={cn(
                    "w-16 sm:w-20 relative flex items-center select-none touch-none h-6",
                    disabled && "opacity-50",
                )}
            >
                <Slider.Track className="relative grow bg-tertiary-300 dark:bg-tertiary-700 h-1 rounded-full">
                    <Slider.Range className="absolute h-full overflow-hidden rounded-full bg-primary-500"/>
                </Slider.Track>
                <Slider.Thumb
                    aria-label="Preview volume"
                    className="relative rounded-full flex items-center justify-center size-4 bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2"
                />
            </Slider.Root>
        </div>
    );
};

export default PreviewPlayerVolume;
