"use client";

import {type FC, useEffect, useState} from "react";
import type {Queue} from "@/types/queue";
import QueueStatus from "@/components/new/queues/status/queue-status";
import QueueStatusButton from "@/components/new/queues/status/queue-status-button";
import QueueVisibility from "@/components/new/queues/visibility/queue-visibility";
import QueueAbout from "@/components/new/queues/description/queue-about";

interface ManageQueueHeaderProps {
    queue: Queue;
}

const ManageQueueHeader: FC<ManageQueueHeaderProps> = ({queue}) => {
    const [isOpen, setIsOpen] = useState(queue.is_open);

    useEffect(() => {
        setIsOpen(queue.is_open);
    }, [queue.is_open]);

    return (
        <header className="flex flex-col items-center gap-8 rounded-xl px-8 py-6 transition-colors duration-300 ease-in-out dark:text-white lg:flex-row lg:items-start">
            <div className="flex w-full flex-1 flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div
                    aria-hidden="true"
                    className="size-24 shrink-0 rounded-xl bg-cover bg-center bg-tertiary-800"
                    style={{backgroundImage: `url(${queue.user_profile.avatar_url})`}}
                />

                <div className="flex w-full min-w-0 flex-1 flex-col gap-1.5">
                    <div>
                        <div className="font-semibold">{queue.name}</div>
                        <div className="text-sm text-tertiary-500">
                            Owned by{" "}
                            <a
                                className="font-semibold"
                                href={`https://osu.ppy.sh/users/${queue.user_id}`}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {queue.user_profile.username}
                            </a>
                            {queue.manager_profiles.length > 0 && (
                                <>
                                    {" • Managed by "}
                                    {queue.manager_profiles.map((manager, index) => (
                                        <span key={manager.user_id ?? manager.id ?? index}>
                                            <a
                                                className="font-semibold"
                                                href={`https://osu.ppy.sh/users/${manager.user_id}`}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            >
                                                {manager.username}
                                            </a>
                                            {index < queue.manager_profiles.length - 1 && ", "}
                                        </span>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    <QueueAbout description={queue.description}/>
                </div>
            </div>

            <div className="flex h-fit shrink-0 items-center gap-4 lg:h-24">
                <div className="flex flex-col items-start gap-1 sm:items-center">
                    <QueueStatus isOpen={isOpen}/>
                    <QueueVisibility visibility={queue.visibility}/>
                </div>
                <QueueStatusButton
                    isOpen={isOpen}
                    onClick={setIsOpen}
                    queue={queue}
                />
            </div>
        </header>
    );
};

export default ManageQueueHeader;
