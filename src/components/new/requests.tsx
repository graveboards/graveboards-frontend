"use client";

import React, {FC} from "react";

import RequestCard from "@/components/requests/cards/request-card";
import RequestCardSkeleton from "@/components/requests/cards/request-card-skeleton";
import {InfiniteResourceList} from "@/components/new/infinite-resource-list";
import {EndpointSpecification, RequestsEndpoint} from "@/types/endpoints";

interface RequestsProps {
    title: string;
    filters?: EndpointSpecification["Requests"]["filters"];
    defaultFilters?: EndpointSpecification["Requests"]["filters"];
    sorting?: EndpointSpecification["Requests"]["sorting"];
    defaultSorting?: EndpointSpecification["Requests"]["sorting"];
    showControls?: boolean;
    showLayoutSwitch?: boolean;
    showSorting?: boolean;
    showFilters?: boolean;
    showSearch?: boolean;
    editMode?: boolean;
}

const Requests: FC<RequestsProps> = ({
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
            endpoint={RequestsEndpoint}
            params={{filters, sorting}}
            defaults={{filters: defaultFilters, sorting: defaultSorting}}
            loader={(view) => <RequestCardSkeleton view={view}/>}
            itemKey={(request) => request.id}
            renderItem={(request, view, editMode) => (
                <RequestCard
                    request={request}
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

export default Requests;