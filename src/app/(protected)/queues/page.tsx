import React from 'react';
import CreateQueueButton from "@/components/queues/create-queue-button";
import Queues from "@/components/queues/queues";

const QueuesPage = () => {
    return (
        <div className="flex flex-col flex-1 gap-8">
            <div className="flex items-center justify-between gap-4">
                <div className="text-2xl font-semibold">
                    Queues
                </div>
                <CreateQueueButton />
            </div>
            <Queues />
        </div>
    );
};

export default QueuesPage;
