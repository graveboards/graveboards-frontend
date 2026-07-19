import React, {FC} from 'react';
import {forbidden, notFound} from "next/navigation";
import {ManageQueueContent} from "@/components/new/queues/manage/manage-queue-content";
import {getQueueRouteAccess} from "@/lib/queue-route-access";

interface QueuePageProps {
    params: Promise<{ id: string }>;
}

const ManageQueuePage: FC<QueuePageProps> = async ({params}) => {
    const id = Number((await params).id);

    if (!Number.isInteger(id) || id < 0) {
        notFound();
    }

    const {queue, canManage} = await getQueueRouteAccess(id);

    if (!canManage) {
        forbidden();
    }

    return <ManageQueueContent queue={queue}/>;
};

export default ManageQueuePage;

