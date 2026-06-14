"use client";

import React, {FC} from "react";

import BeatmapsetCard from "@/components/new/beatmapsets/cards/beatmapset-card";
import BeatmapsetCardSkeleton from "@/components/new/beatmapsets/cards/beatmapset-card-skeleton";
import {InfiniteResourceList} from "@/components/new/infinite-resource-list";
import {BeatmapsetListingsEndpoint, EndpointSpecification} from "@/types/endpoints";

interface BeatmapsetListingsProps {
    title: string;
    filters?: EndpointSpecification["BeatmapsetListings"]["filters"];
    defaultFilters?: EndpointSpecification["BeatmapsetListings"]["filters"];
    sorting?: EndpointSpecification["BeatmapsetListings"]["sorting"];
    defaultSorting?: EndpointSpecification["BeatmapsetListings"]["sorting"];
    search?: string;
    defaultSearch?: string;
    showControls?: boolean;
    showLayoutSwitch?: boolean;
    showSorting?: boolean;
    showFilters?: boolean;
    showSearch?: boolean;
    editMode?: boolean;
}

const BeatmapsetListings: FC<BeatmapsetListingsProps> = ({
                                                             title,
                                                             filters,
                                                             defaultFilters,
                                                             sorting,
                                                             defaultSorting,
                                                             search,
                                                             defaultSearch,
                                                             showControls = true,
                                                             showLayoutSwitch = true,
                                                             showSorting = true,
                                                             showFilters = true,
                                                             showSearch = true,
                                                             editMode = false,
                                                         }) => {
    const id = title?.toLowerCase().replace(" ", "-");

    return (
        <InfiniteResourceList
            title={title}
            id={id}
            endpoint={BeatmapsetListingsEndpoint}
            params={{filters, sorting, search}}
            defaults={{filters: defaultFilters, sorting: defaultSorting, search: defaultSearch}}
            loader={(view) => <BeatmapsetCardSkeleton view={view}/>}
            itemKey={(beatmapset) => beatmapset.beatmapset_id}
            renderItem={(beatmapset, view, editMode) => (
                <BeatmapsetCard
                    beatmapset={beatmapset}
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

export default BeatmapsetListings;