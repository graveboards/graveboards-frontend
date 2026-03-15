import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import {ColorUtils} from "@/utils/color-utils";

const StarRatingSlider = ({values, setValues}: { values: number[], setValues: React.Dispatch<React.SetStateAction<number[]>> }) => {
    const min = 0;
    const max = 10.01;

    const normalizedValue = Number.isFinite(values[0]) ? values[0] : 5;
    const clampedValue = Math.min(max, Math.max(min, normalizedValue));

    const handleValuesChange = (values: number[]) => {
        const nextValue = Number.isFinite(values[0]) ? values[0] : 5;
        setValues([Math.min(max, Math.max(min, nextValue))]);
    }

    return (
        <div className="flex flex-col gap-2 dark:p-2 dark:rounded-lg dark:bg-tertiary-900 dark:border dark:border-tertiary-700">
            <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-6"
                min={min}
                max={max}
                step={0.01}
                value={[clampedValue]}
                onValueChange={handleValuesChange}
            >
                <Slider.Track className="relative grow bg-tertiary-800 h-1 rounded-full">
                    <div className="absolute inset-0 star-rating rounded-full"/>

                    <Slider.Range className="absolute h-full overflow-hidden rounded-full"/>
                </Slider.Track>
                <Slider.Thumb
                    className="relative rounded-full flex items-center justify-center px-2 py-0.5 text-xs whitespace-nowrap transition-[color]"
                    style={{
                        backgroundColor: ColorUtils.forStarRating(clampedValue),
                        color: clampedValue >= 6.5 ? "#fff" : "#000",
                    }}
                >
                    ★ {clampedValue.toFixed(2) === "10.01" ? "10.00+" : clampedValue.toFixed(2)}
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

export default StarRatingSlider;
