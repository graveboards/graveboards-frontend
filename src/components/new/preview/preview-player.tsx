"use client";

import React, {useEffect, useRef, useState} from "react";
import {usePreview} from "@/context/preview-context";
import {MdClose, MdPause, MdPlayArrow, MdVolumeOff, MdVolumeUp} from "react-icons/md";
import {formatTime} from "@/utils/time-utils";
import clsx from "clsx";
import "react-range-slider-input/dist/style.css";
import * as Slider from "@radix-ui/react-slider";
import {cn} from "@/lib/utils";

const PreviewPlayer = () => {
    const [open, setOpen] = useState(false);

    const [volume, setVolume] = useState(0.5);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const {src, setSrc} = usePreview();

    useEffect(() => {
        const storageVolume = localStorage.getItem("volume");

        setVolume(storageVolume ? parseFloat(storageVolume) : 0.5);
    }, []);

    useEffect(() => {
        localStorage.setItem("volume", volume.toString());

        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (src) {
            setOpen(true);

            setCurrentTime(0);
            setDuration(0);

            audioRef.current!.src = src;
        }
    }, [src]);

    const audioRef = useRef<HTMLAudioElement>(null);

    return (
        <div
            className={clsx(
                `bg-tertiary-100 sm:m-4 z-40 dark:bg-tertiary-900 shadow-sm p-4 sm:rounded-xl fixed bottom-0 right-0 flex gap-4 items-center sm:w-auto w-full`,
                {"hidden": !src || !open}
            )}>
            <audio ref={audioRef}
                   onTimeUpdate={() => {
                       if (audioRef.current) {
                           setCurrentTime(audioRef.current.currentTime);
                           setDuration(audioRef.current.duration);
                       }
                   }}
                   onLoadedMetadata={async () => {
                       if (audioRef.current) {
                           audioRef.current.volume = volume;

                           setCurrentTime(0);
                           setDuration(audioRef.current.duration);

                           await audioRef.current.play();
                       }
                   }}
            />

            {audioRef.current && audioRef.current.paused && (
                <button onClick={() => audioRef.current!.play()}>
                    <MdPlayArrow className="size-8"/>
                </button>
            )}

            {audioRef.current && !audioRef.current.paused && (
                <button onClick={() => audioRef.current!.pause()}>
                    <MdPause className="size-8"/>
                </button>
            )}

            <div className="flex items-center gap-2">
                <div className="font-bold">
                    {formatTime(Number(currentTime.toFixed()))}
                </div>
                <div className="text-tertiary-500">
                    {isNaN(duration) ? "00:00" : formatTime(Number(duration.toFixed()))}
                </div>
            </div>

            <div className="w-full sm:w-64">
                <Slider.Root
                    min={0}
                    max={1}
                    step={0.01}
                    value={[isNaN(currentTime / duration) ? 0 : currentTime / duration]}
                    onValueChange={(value) => {
                        if (audioRef.current) audioRef.current.currentTime = value[0] * audioRef.current.duration;
                    }}
                    disabled={!src}
                    className={cn(`w-full relative flex items-center select-none touch-none h-6`, !src && "opacity-50")}
                >
                    <Slider.Track className="relative grow bg-tertiary-300 dark:bg-tertiary-700 h-1 rounded-full">
                        <Slider.Range className="absolute bg-primary-500 h-full rounded-full"/>
                    </Slider.Track>
                    <Slider.Thumb
                        className="relative rounded-full flex items-center justify-center size-4 bg-primary-500"
                    />
                </Slider.Root>
            </div>


            <div className="flex items-center gap-2">
                {volume === 0 ? (
                    <MdVolumeOff className="size-6 cursor-pointer" onClick={() => setVolume(0.1)}/>
                ) : (
                    <MdVolumeUp className="size-6 cursor-pointer" onClick={() => setVolume(0)}/>
                )}

                <Slider.Root
                    min={0}
                    max={1}
                    step={0.01}
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    disabled={!src}
                    className={cn(`w-12 sm:w-24 relative flex items-center select-none touch-none h-6`, !src && "opacity-50")}
                >
                    <Slider.Track className="relative grow bg-tertiary-300 dark:bg-tertiary-700 h-1 rounded-full">
                        <Slider.Range className="absolute h-full overflow-hidden rounded-full bg-primary-500"/>
                    </Slider.Track>
                    <Slider.Thumb
                        className="relative rounded-full flex items-center justify-center size-4 bg-primary-500"
                    />
                </Slider.Root>
            </div>

            <MdClose className="size-6 cursor-pointer shrink-0" onClick={() => {
                setOpen(false);
                audioRef.current!.pause();
                setSrc(undefined);
            }}/>
        </div>

    );
};

export default PreviewPlayer;
