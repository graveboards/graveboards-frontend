import React from 'react';
import GridBeatmapsetCardSkeleton from "@/components/beatmapsets/cards/grid/grid-beatmapset-card-skeleton";
import ListBeatmapsetCardSkeleton from "@/components/beatmapsets/cards/list/list-beatmapset-card-skeleton";

interface BeatmapsetPanelSkeletonProps {
    view?: "list" | "grid"
}

const BeatmapsetCardSkeleton = ({view}: BeatmapsetPanelSkeletonProps) => {
    return view === "grid" ? (
        <GridBeatmapsetCardSkeleton/>
    ) : (
        <ListBeatmapsetCardSkeleton/>
    );
};

export default BeatmapsetCardSkeleton;
