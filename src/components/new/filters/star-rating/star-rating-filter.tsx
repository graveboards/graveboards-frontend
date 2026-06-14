"use client";

import React, {useEffect, useState} from 'react';
import FilterRangeField from "@/components/new/filters/filter-range-field";
import StarRatingRangeSlider from "@/components/new/filters/star-rating/star-rating-range-slider";
import StarRatingSlider from "@/components/new/filters/star-rating/star-rating-slider";

const MIN_RATING = 0;
const MAX_RATING = 10.01;
const DEFAULT_RATING = 5;

const clamp = (value: number) => Math.min(MAX_RATING, Math.max(MIN_RATING, value));

const normalizeSingle = (values: number[]) => {
    const first = Number.isFinite(values[0]) ? values[0] : DEFAULT_RATING;
    return [clamp(first)];
};

const normalizeRange = (values: number[]) => {
    const first = Number.isFinite(values[0]) ? values[0] : DEFAULT_RATING;
    const second = Number.isFinite(values[1]) ? values[1] : MAX_RATING;
    const start = clamp(Math.min(first, second));
    const end = clamp(Math.max(first, second));
    return [start, end];
};

const StarRatingFilter = () => {
    const [isRange, setIsRange] = useState(false);
    const [values, setValues] = useState([DEFAULT_RATING]);
    const [lastRangeMax, setLastRangeMax] = useState(MAX_RATING);

    useEffect(() => {
        if (!isRange) return;
        const nextMax = Number.isFinite(values[1]) ? clamp(values[1]) : undefined;
        if (nextMax !== undefined) {
            setLastRangeMax(nextMax);
        }
    }, [isRange, values]);

    const handleRangeChange = (isRange: boolean) => {
        if (!isRange && values.length === 2 && Number.isFinite(values[1])) {
            setLastRangeMax(clamp(values[1]));
        }

        setIsRange(isRange);
        setValues((prevValues) => {
            if (isRange) {
                const single = Number.isFinite(prevValues[0]) ? clamp(prevValues[0]) : DEFAULT_RATING;
                const restoredMax = Math.max(single, clamp(lastRangeMax));
                return normalizeRange([single, restoredMax]);
            }
            return normalizeSingle(prevValues);
        });
    }

    const normalizedValues = isRange ? normalizeRange(values) : normalizeSingle(values);

    return (
        <div className="flex flex-col gap-2">
            <FilterRangeField title="Star Rating" onRangeChange={handleRangeChange} values={normalizedValues}
                              setValues={setValues}/>
            {isRange ? (
                <StarRatingRangeSlider values={normalizedValues} setValues={setValues}/>
            ) : (
                <StarRatingSlider values={normalizedValues} setValues={setValues}/>
            )}
        </div>
    );
};

export default StarRatingFilter;
