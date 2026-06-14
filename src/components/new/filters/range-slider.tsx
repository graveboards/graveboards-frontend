import React from 'react';
import * as Slider from '@radix-ui/react-slider';

const RangeSlider = ({
    values,
    setValues,
    min,
    max,
    step = 0.01,
}: {
    values: number[];
    setValues: React.Dispatch<React.SetStateAction<number[]>>;
    min: number;
    max: number;
    step?: number;
}) => {
    const isRange = values.length === 2;

    const clamp = (value: number) => Math.min(max, Math.max(min, value));
    const first = Number.isFinite(values[0]) ? clamp(values[0]) : min;
    const second = Number.isFinite(values[1]) ? clamp(values[1]) : max;
    const normalizedValues = isRange
        ? [Math.min(first, second), Math.max(first, second)]
        : [first];

    const handleValuesChange = (nextValues: number[]) => {
        if (isRange) {
            const nextStart = clamp(Math.min(nextValues[0], nextValues[1]));
            const nextEnd = clamp(Math.max(nextValues[0], nextValues[1]));
            setValues([nextStart, nextEnd]);
            return;
        }

        setValues([clamp(nextValues[0])]);
    };

    return (
        <div className="flex flex-col gap-2">
            <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-6"
                min={min}
                max={max}
                step={step}
                value={normalizedValues}
                onValueChange={handleValuesChange}
                minStepsBetweenThumbs={isRange ? 1 : undefined}
            >
                <Slider.Track className="relative grow bg-tertiary-800 h-1 rounded-full">
                    <Slider.Range className="absolute h-full overflow-hidden rounded-full bg-primary-500"/>
                </Slider.Track>

                {normalizedValues.map((value, index) => (
                    <Slider.Thumb
                        key={`${index}-${value}`}
                        className="relative rounded-full flex items-center justify-center size-4 bg-primary-500"
                    />
                ))}
            </Slider.Root>

            <div className="flex justify-between items-center w-full">
                <div className="whitespace-nowrap text-xs text-tertiary-400">
                    {min}
                </div>
                <div className="whitespace-nowrap text-xs text-tertiary-400">
                    {max}
                </div>
            </div>
        </div>
    );
};

export default RangeSlider;
