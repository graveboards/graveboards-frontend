import React, { FC } from "react";
import { QueueContent } from "@/components/queues/queue-content";
import {verifySession} from "@/actions/session";
import {redirect} from "next/navigation";

interface QueuePageProps {
    params: Promise<{ id: string }>;
}

const QueuePage: FC<QueuePageProps> = async ({ params }) => {
    const session = await verifySession();

    if (!session?.userId) {
        redirect("/home");
    }

    const id = Number((await params).id);

    if (id === null) {
        return null;
    }

    return <QueueContent id={id} />;
};

export default QueuePage;

