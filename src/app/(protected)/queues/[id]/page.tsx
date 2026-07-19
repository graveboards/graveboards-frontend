import React, {FC} from "react";
import {notFound} from "next/navigation";
import {QueueContent} from "@/components/new/queues/queue-content";
import {getQueueRouteAccess} from "@/lib/queue-route-access";

interface QueuePageProps {
    params: Promise<{ id: string }>;
}

const QueuePage: FC<QueuePageProps> = async ({params}) => {
    const id = Number((await params).id);

    if (!Number.isInteger(id) || id < 0) {
        notFound();
    }

    const {queue} = await getQueueRouteAccess(id);

    return <QueueContent queue={queue}/>;
};

export default QueuePage;

