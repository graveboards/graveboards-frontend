import React from "react";
import {notFound} from "next/navigation";
import QueueNavigation from "@/components/new/queues/queue-navigation";
import {getQueueRouteAccess} from "@/lib/queue-route-access";
import PageContent from "@/components/new/layout/page-content";

interface QueueLayoutProps {
    children: React.ReactNode;
    params: Promise<{id: string}>;
}

const QueueLayout = async ({children, params}: QueueLayoutProps) => {
    const queueId = Number((await params).id);

    if (!Number.isInteger(queueId) || queueId < 0) {
        notFound();
    }

    const {canManage, canEditSettings} = await getQueueRouteAccess(queueId);

    return (
        <>
            <QueueNavigation
                queueId={queueId}
                showManage={canManage}
                showSettings={canEditSettings}
            />
            <PageContent>
                {children}
            </PageContent>
        </>
    );
};

export default QueueLayout;
