"use client";

import React, {FC, useEffect} from "react";
import ManageQueueHeader from "@/components/new/queues/manage/manage-queue-header";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import QueueHeaderSkeleton from "@/components/new/queues/queue-header-skeleton";
import {Queue} from "@/types/queue";
import Requests from "@/components/new/requests";
import {Order, RequestSortingEnum} from "@/types/sorting";
import {useAuth} from "@/context/auth-context";
import {notFound, useRouter} from "next/navigation";
import {API_URL} from "@/lib/constants";

export const ManageQueueContent: FC<{ id: number }> = ({id}) => {
    const {user, isLoading: authLoading} = useAuth();
    const {replace} = useRouter();

    const {
        data: queue,
        error,
        isLoading: queueLoading
    } = useSWR<Queue>(`${API_URL}/queues/${id}?include[user_profile]=true&include[manager_profiles]=true`, fetcher);

    const isManager = queue?.manager_profiles.some(manager => manager.id === user?.id) || queue?.user_id === user?.id;

    useEffect(() => {
        if (!queueLoading && queue && !authLoading && !isManager) {
            replace(`/queues/${id}`);
        }
    }, [isManager, queue, queueLoading, authLoading, replace, id]);

    if (error) {
        return <div>Failed to load queue</div>;
    }

    if (queueLoading || authLoading) {
        return <QueueHeaderSkeleton/>;
    }

    if (!isManager) {
        return null;
    }

    if (!queue) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <ManageQueueHeader queue={queue}/>
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
