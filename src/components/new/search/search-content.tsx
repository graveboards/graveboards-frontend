"use client"

import React from 'react';
import {SearchQueryScope} from "@/types/search";
import BeatmapsetListings from "@/components/new/beatmapset-listings";
import {useSearch} from "@/context/search/search-context";
import BeatmapListings from "@/components/new/beatmap-listings";
import Queues from "@/components/new/queues";
import Requests from "@/components/new/requests";

const SearchContent = ({scope}: { scope: SearchQueryScope }) => {
    const {search} = useSearch();

    if (!search) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-2xl font-semibold text-tertiary-400">Looking for nothing?</p>
                <p className="text-center text-md text-muted-foreground text-tertiary-500">
                    Try searching for something specific or explore popular beatmaps and queues.
                </p>
            </div>
        );
    }

    const renderScope = () => {
        switch (scope) {
            case "beatmapsets":
                return (
                    <BeatmapsetListings
                        title={"Most Relevant Beatmapsets"}
                        defaultSearch={search || undefined}
                        showSearch={false}
                        showFilters={false}
                        showSorting={false}
                    />
                );
            case "beatmaps":
                return (
                    <BeatmapListings
                        title={"Most Relevant Beatmaps"}
                        defaultSearch={search || undefined}
                        showSearch={false}
                        showFilters={false}
                        showSorting={false}
                    />
                );
            case "queues":
                return (
                    <Queues
                        title={"Most Relevant Queues"}
                        defaultSearch={search || undefined}
                        showSearch={false}
                        showFilters={false}
                        showSorting={false}
                        showLayoutSwitch={false}
                    />
                );
            case "requests":
                return (
                    <Requests
                        title={"Most Relevant Requests"}
                        defaultSearch={search || undefined}
                        showSearch={false}
                        showFilters={false}
                        showSorting={false}
                    />
                );
        }
    }

    return (
        <div className="pt-5">
            {renderScope()}
        </div>
    );
};

export default SearchContent;
