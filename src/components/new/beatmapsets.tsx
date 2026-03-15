"use client";

import React, {FC} from "react";

import BeatmapsetCard from "@/components/beatmapsets/cards/beatmapset-card";
import BeatmapsetCardSkeleton from "@/components/beatmapsets/cards/beatmapset-card-skeleton";

import {InfiniteResourceList} from "@/components/new/infinite-resource-list";
import {BeatmapsetsEndpoint, EndpointSpecification} from "@/types/endpoints";

interface BeatmapsetsProps {
    title: string;
    filters?: EndpointSpecification["Beatmapsets"]["filters"];
    defaultFilters?: EndpointSpecification["Beatmapsets"]["filters"];
    sorting?: EndpointSpecification["Beatmapsets"]["sorting"];
    defaultSorting?: EndpointSpecification["Beatmapsets"]["sorting"];
    showControls?: boolean;
    showLayoutSwitch?: boolean;
    showSorting?: boolean;
    showFilters?: boolean;
    showSearch?: boolean;
    editMode?: boolean;
}

const Beatmapsets: FC<BeatmapsetsProps> = ({
                                         title,
                                         filters,
                                         defaultFilters,
                                         sorting,
                                         defaultSorting,
                                         showControls = true,
                                         showLayoutSwitch = true,
                                         showSorting = true,
                                         showFilters = true,
                                         showSearch = true,
                                         editMode = false
                                     }) => {
    const id = title?.toLowerCase().replace(" ", "-");

    return (
        <InfiniteResourceList
            title={title}
            id={id}
            endpoint={BeatmapsetsEndpoint}
            params={{filters, sorting}}
            defaults={{filters: defaultFilters, sorting: defaultSorting}}
            loader={(view) => <BeatmapsetCardSkeleton view={view}/>}
            itemKey={(beatmapset) => beatmapset.id}
            renderItem={(beatmapset, view, editMode) => (
                <BeatmapsetCard
                    beatmapset={beatmapset.snapshots[0]}
                    view={view}
                    editMode={editMode}
                />
            )}
            showControls={showControls}
            showLayoutSwitch={showLayoutSwitch}
            showSorting={showSorting}
            showFilters={showFilters}
            showSearch={showSearch}
            editMode={editMode}
        />
    );
};

export default Beatmapsets;