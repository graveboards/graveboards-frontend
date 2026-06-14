"use client";

import React, { useState } from "react";
import QueueCard from "@/components/new/queues/panels/queue-card";
import QueueCardSkeleton from "@/components/new/queues/panels/queue-card-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import {QueuesEndpoint} from "@/types/endpoints";
import {useAPIInfinite} from "@/hooks/use-swr-infinite-wrapper";

const Queues = () => {
    const [page, setPage] = useState(0);

    const { items: queues, error, isReachingEnd } = useAPIInfinite(QueuesEndpoint, {});

    if (error) {
        return null;
    }

    return (
        <InfiniteScroll
            dataLength={queues.length}
            next={() => setPage(page + 1)}
            hasMore={!isReachingEnd}
            loader={<QueueCardSkeleton />}
            style={{overflow: "visible"}}
            className="flex flex-col gap-4">
            {queues.map((queue) => (
                    <QueueCard key={queue.id} queue={queue} />
                )
            )}
        </InfiniteScroll>
    );
};

export default Queues;
