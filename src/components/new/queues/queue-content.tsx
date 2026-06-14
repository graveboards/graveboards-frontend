"use client";

import React, {FC} from "react";
import QueueHeader from "@/components/new/queues/queue-header";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import QueueHeaderSkeleton from "@/components/new/queues/queue-header-skeleton";
import {API_URL} from "@/lib/constants";
import Requests from "@/components/new/requests";
import {Order, RequestSortingEnum} from "@/types/sorting";
import {Queue} from "@/types/queue";

export const QueueContent: FC<{ id: number }> = ({ id }) => {
    const { data: queue, error, isLoading } = useSWR<Queue>(`${API_URL}/queues/${id}?include[user_profile]=true&include[manager_profiles]=true`, fetcher);

    if (!isLoading && (error || !queue)) {
        return <div>Failed to load queue</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            { (isLoading || !queue) ? <QueueHeaderSkeleton /> : <QueueHeader queue={queue} /> }
            <Requests
                title="Queue Requests"
                defaultFilters={{
                    queue_id: {
                        eq: id,
                    }
                }}
                defaultSorting={[
                    {
                        field: RequestSortingEnum.CreatedAt,
                        order: Order.Descending,
                    }
                ]}
            />
        </div>
    );
};
