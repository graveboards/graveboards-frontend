"use client";

import React, {FC} from "react";

import {InfiniteResourceList, Layout} from "@/components/new/infinite-resource-list";
import {BeatmapListingsEndpoint, EndpointSpecification} from "@/types/endpoints";
import BeatmapCard from "@/components/new/beatmaps/cards/beatmap-card";
import BeatmapCardSkeleton from "@/components/new/beatmaps/cards/beatmap-card-skeleton";

interface BeatmapListingsProps {
    title: string;
    filters?: EndpointSpecification["BeatmapListings"]["filters"];
    defaultFilters?: EndpointSpecification["BeatmapListings"]["filters"];
    sorting?: EndpointSpecification["BeatmapListings"]["sorting"];
    defaultSorting?: EndpointSpecification["BeatmapListings"]["sorting"];
    search?: string;
    defaultSearch?: string;
    showControls?: boolean;
    showLayoutSwitch?: boolean;
    showSorting?: boolean;
    showFilters?: boolean;
    showSearch?: boolean;
    editMode?: boolean;
}

const BeatmapListings: FC<BeatmapListingsProps> = ({
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
            endpoint={BeatmapListingsEndpoint}
            params={{filters, sorting, search}}
            defaults={{filters: defaultFilters, sorting: defaultSorting, search: defaultSearch}}
            loader={(view) => <BeatmapCardSkeleton view={view}/>}
            itemKey={(beatmap) => beatmap.beatmap_id}
            renderItem={(beatmap, view) => (
                <BeatmapCard
                    beatmap={beatmap}
                    view={view}
                />
            )}
            showControls={showControls}
            showLayoutSwitch={showLayoutSwitch}
            showSorting={showSorting}
            showFilters={showFilters}
            showSearch={showSearch}
            editMode={editMode}
            defaultLayout={Layout.List}
        />
    );
};

export default BeatmapListings;