import React from 'react';
import CreateQueueButton from "@/components/new/queues/create-queue-button";
import Queues from "@/components/new/queues/queues";
import PageContent from "@/components/new/layout/page-content";

const QueuesPage = () => {
    return (
        <PageContent>
            <div className="flex flex-col flex-1 gap-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="text-2xl font-semibold">
                        Queues
                    </div>
                    <CreateQueueButton/>
                </div>
                <Queues/>
            </div>
        </PageContent>
    );
};

export default QueuesPage;
