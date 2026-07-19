import React, {FC} from "react";
import {forbidden, notFound} from "next/navigation";
import {QueueSettingsContent} from "@/components/new/queues/settings/queue-settings-content";
import {getQueueRouteAccess} from "@/lib/queue-route-access";

interface QueueSettingsPageProps {
    params: Promise<{id: string}>;
}

const QueueSettingsPage: FC<QueueSettingsPageProps> = async ({params}) => {
    const id = Number((await params).id);

    if (!Number.isInteger(id) || id < 0) {
        notFound();
    }

    const {queue, canEditSettings} = await getQueueRouteAccess(id);

    if (!canEditSettings) {
        forbidden();
    }

    return <QueueSettingsContent queue={queue}/>;
};

export default QueueSettingsPage;
