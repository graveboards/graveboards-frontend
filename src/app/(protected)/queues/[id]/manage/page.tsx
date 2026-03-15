import React, {FC} from 'react';
import {ManageQueueContent} from "@/components/queues/manage/manage-queue-content";
import {verifySession} from "@/actions/session";
import {redirect} from "next/navigation";

interface QueuePageProps {
    params: Promise<{ id: string }>;
}

const ManageQueuePage: FC<QueuePageProps> = async ({params}) => {
    const session = await verifySession();

    if (!session?.userId) {
        redirect("/home");
    }

    const id = (await params).id;

    return <ManageQueueContent id={Number(id)} />;
};

export default ManageQueuePage;

