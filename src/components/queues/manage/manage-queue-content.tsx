"use client";

import React, {FC} from "react";
import ManageQueueHeader from "@/components/queues/manage/manage-queue-header";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import QueueHeaderSkeleton from "@/components/queues/queue-header-skeleton";
import {Queue} from "@/types/queue";
import Requests from "@/components/new/requests";
import {Order, RequestSortingEnum} from "@/types/sorting";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("Please define NEXT_PUBLIC_API_URL in .env.local");
}

export const ManageQueueContent: FC<{ id: number }> = ({id}) => {
    const {
        data: queue,
        error,
        isLoading
    } = useSWR<Queue>(`${API_URL}/queues/${id}?include[user_profile]=true&include[manager_profiles]=true`, fetcher);

    if (!isLoading && (error || !queue)) {
        return <div>Failed to load queue</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            {(isLoading || !queue) ? <QueueHeaderSkeleton/> : <ManageQueueHeader queue={queue}/>}
            <Requests
                title="Queue Requests"
                filters={{
                    queue_id: {
                        eq: id
                    },
                }}
                sorting={[
                    {
                        field: RequestSortingEnum.CreatedAt,
                        order: Order.Descending
                    }
                ]}
                editMode={true}
            />
        </div>
    );
};
