import React from 'react';
import GridBeatmapsetCardSkeleton from "@/components/new/beatmapsets/cards/grid/grid-beatmapset-card-skeleton";
import ListBeatmapsetCardSkeleton from "@/components/new/beatmapsets/cards/list/list-beatmapset-card-skeleton";

interface BeatmapsetPanelSkeletonProps {
    view?: "list" | "grid"
}

const BeatmapCardSkeleton = ({view}: BeatmapsetPanelSkeletonProps) => {
    return view === "grid" ? (
        <GridBeatmapsetCardSkeleton/>
    ) : (
        <ListBeatmapsetCardSkeleton/>
    );
};

export default BeatmapCardSkeleton;
