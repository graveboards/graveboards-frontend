import React, {FC} from "react";
import {QueueContent} from "@/components/new/queues/queue-content";

interface QueuePageProps {
    params: Promise<{ id: string }>;
}

const QueuePage: FC<QueuePageProps> = async ({params}) => {
    const id = Number((await params).id);

    if (isNaN(id)) {
        return <div>Invalid queue ID</div>;
    }

    return <QueueContent id={id}/>;
};

export default QueuePage;

