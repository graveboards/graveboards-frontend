"use client";

import React, {FC} from "react";
import QueueHeader from "@/components/new/queues/queue-header";
import Requests from "@/components/new/requests";
import {Order, RequestSortingEnum} from "@/types/sorting";
import {Queue} from "@/types/queue";

export const QueueContent: FC<{queue: Queue}> = ({queue}) => {
    return (
        <div className="flex flex-col gap-6">
            <QueueHeader queue={queue}/>
            <Requests
                title="Queue Requests"
                defaultFilters={{
                    queue_id: {
                        eq: queue.id,
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
