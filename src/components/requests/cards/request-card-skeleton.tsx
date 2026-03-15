import React from 'react';
import GridRequestCardSkeleton from "@/components/requests/cards/grid/grid-request-card-skeleton";
import ListRequestCardSkeleton from "@/components/requests/cards/list/list-request-card-skeleton";

interface BeatmapsetPanelSkeletonProps {
    view?: "list" | "grid"
}

const RequestCardSkeleton = ({view}: BeatmapsetPanelSkeletonProps) => {
    return view === "grid" ? (
        <GridRequestCardSkeleton/>
    ) : (
        <ListRequestCardSkeleton/>
    );
};

export default RequestCardSkeleton;
