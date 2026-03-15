import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import {ColorUtils} from "@/utils/color-utils";

const StarRatingRangeSlider = ({values, setValues}: { values: number[], setValues: React.Dispatch<React.SetStateAction<number[]>> }) => {

    const min = 0;
    const max = 10.01;

    const first = Number.isFinite(values[0]) ? values[0] : 5;
    const second = Number.isFinite(values[1]) ? values[1] : max;
    const start = Math.min(max, Math.max(min, Math.min(first, second)));
    const end = Math.min(max, Math.max(min, Math.max(first, second)));

    const startPercent = ((start - min) / (max - min)) * 100;
    const endPercent = ((end - min) / (max - min)) * 100;

    const handleValuesChange = (values: number[]) => {
        const first = Number.isFinite(values[0]) ? values[0] : 5;
        const second = Number.isFinite(values[1]) ? values[1] : max;
        const nextStart = Math.min(max, Math.max(min, Math.min(first, second)));
        const nextEnd = Math.min(max, Math.max(min, Math.max(first, second)));
        setValues([nextStart, nextEnd]);
    }

    return (
        <div
            className="flex flex-col gap-2 dark:p-2 dark:rounded-lg dark:bg-tertiary-900 dark:border dark:border-tertiary-700">
            <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-6"
                min={min}
                max={max}
                step={0.01}
                value={[start, end]}
                onValueChange={handleValuesChange}
                minStepsBetweenThumbs={1}
                onValueCommit={(newValue) =>
                    handleValuesChange([Math.min(newValue[0], newValue[1]), Math.max(newValue[0], newValue[1])])
                }
            >
                <Slider.Track className="relative grow bg-tertiary-800 h-1 rounded-full">
                    <div className="absolute inset-0 star-rating rounded-full"/>

                    <div
                        className="absolute top-0 bottom-0 left-0 bg-tertiary-700 rounded-l-full"
                        style={{right: `${100 - startPercent}%`}}
                    />

                    <div
                        className="absolute top-0 bottom-0 right-0 bg-tertiary-700 rounded-r-full"
                        style={{left: `${endPercent}%`}}
                    />

                    <Slider.Range className="absolute h-full overflow-hidden rounded-full"/>
                </Slider.Track>
                <Slider.Thumb
                    className="relative rounded-full flex items-center justify-center px-2 py-0.5 text-xs whitespace-nowrap transition-[color]"
                    style={{
                        backgroundColor: ColorUtils.forStarRating(start),
                        color: start >= 6.5 ? "#fff" : "#000",
                    }}
                >
                    ★ {start.toFixed(2)}
                </Slider.Thumb>
                <Slider.Thumb
                    className="relative rounded-full flex items-center justify-center px-2 py-0.5 text-xs whitespace-nowrap transition-[color]"
                    style={{
                        backgroundColor: ColorUtils.forStarRating(end),
                        color: end >= 6.5 ? "#fff" : "#000",
                    }}
                >
                    ★ {end.toFixed(2) === "10.01" ? "10.00+" : end.toFixed(2)}
                </Slider.Thumb>
            </Slider.Root>
            <div className="flex justify-between items-center w-full">
                <div className="whitespace-nowrap text-xs text-tertiary-400">
                    ★ 0
                </div>
                <div className="whitespace-nowrap text-xs text-tertiary-400">
                    ★ 10
                </div>
            </div>
        </div>

    );
};

export default StarRatingRangeSlider;
