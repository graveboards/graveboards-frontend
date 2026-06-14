"use client";

import React, {FC} from "react";

import {InfiniteResourceList, Layout} from "@/components/new/infinite-resource-list";
import {EndpointSpecification, QueuesEndpoint} from "@/types/endpoints";
import QueueCard from "@/components/new/queues/panels/queue-card";
import QueueCardSkeleton from "@/components/new/queues/panels/queue-card-skeleton";

interface RequestsProps {
    title: string;
    filters?: EndpointSpecification["Queues"]["filters"];
    defaultFilters?: EndpointSpecification["Queues"]["filters"];
    sorting?: EndpointSpecification["Queues"]["sorting"];
    defaultSorting?: EndpointSpecification["Queues"]["sorting"];
    search?: string;
    defaultSearch?: string;
    showControls?: boolean;
    showLayoutSwitch?: boolean;
    showSorting?: boolean;
    showFilters?: boolean;
    showSearch?: boolean;
    editMode?: boolean;
}

const Queues: FC<RequestsProps> = ({
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
                                         editMode = false
                                     }) => {
    const id = title?.toLowerCase().replace(" ", "-");

    return (
        <InfiniteResourceList
            title={title}
            id={id}
            endpoint={QueuesEndpoint}
            params={{filters, sorting, search}}
            defaults={{filters: defaultFilters, sorting: defaultSorting, search: defaultSearch}}
            loader={() => <QueueCardSkeleton />}
            itemKey={(queue) => queue.id}
            renderItem={(queue) => (
                <QueueCard queue={queue}/>
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

export default Queues;
