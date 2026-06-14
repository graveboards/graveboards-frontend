import React, {FC} from 'react';
import {ManageQueueContent} from "@/components/new/queues/manage/manage-queue-content";

interface QueuePageProps {
    params: Promise<{ id: string }>;
}

const ManageQueuePage: FC<QueuePageProps> = async ({params}) => {
    const id = Number((await params).id);

    if (isNaN(id)) {
        return <div>Invalid queue ID</div>;
    }

    return <ManageQueueContent id={id}/>;
};

export default ManageQueuePage;

