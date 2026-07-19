"use client";

import React, {FC} from "react";
import {Queue} from "@/types/queue";
import Requests from "@/components/new/requests";
import {Order, RequestSortingEnum} from "@/types/sorting";
import ManageQueueHeader from "@/components/new/queues/manage/manage-queue-header";

export const ManageQueueContent: FC<{queue: Queue}> = ({queue}) => {
    return (
        <div className="flex flex-col gap-6">
            <ManageQueueHeader queue={queue}/>
            <Requests
                title="Queue Requests"
                filters={{
                    queue_id: {
                        eq: queue.id
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
