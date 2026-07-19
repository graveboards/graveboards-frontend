"use client";

import React, { FC } from "react";
import { Queue } from "@/types/queue";
import QueueStatus from "@/components/new/queues/status/queue-status";
import ManageQueueButton from "@/components/new/queues/manage/manage-queue-button";
import QueueVisibility from "@/components/new/queues/visibility/queue-visibility";
import QueueAbout from "@/components/new/queues/description/queue-about";

interface QueueHeaderProps {
    queue: Queue;
}

const QueueHeader: FC<QueueHeaderProps> = ({ queue }) => {

    return (
        <div
            className="px-8 py-6 flex-col gap-8 lg:flex-row flex justify-between items-center rounded-xl dark:text-white self-stretch transition-colors duration-300 ease-in-out">
            <div className="flex w-full flex-1 flex-col items-center gap-6 lg:flex-row lg:items-start">
                <div className="flex w-full flex-1 flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <div className="size-24 rounded-xl shrink-0 bg-cover"
                         style={{ backgroundImage: `url(${queue.user_profile.avatar_url})` }}></div>
                    <div className="flex w-full min-w-0 flex-1 flex-col gap-1.5">
                        <div>
                            <div className="font-semibold">{queue.name}</div>
                            <div className="text-sm text-tertiary-500">Owned by <a
                                href={`https://osu.ppy.sh/users/${queue.user_id}`}
                                className="font-semibold"
                                rel="noopener noreferrer"
                                target="_blank">{queue.user_profile.username}</a>
                                {
                                    queue.manager_profiles.length > 0 && (
                                        <>
                                            • Managed by
                                            {
                                                queue.manager_profiles.map((manager, index) => (
                                                    <span key={index}>
                                                    <a href={`https://osu.ppy.sh/users/${manager.user_id}`}
                                                       className="font-semibold"
                                                       rel="noopener noreferrer"
                                                       target="_blank">{manager.username}</a>
                                                        {index < queue.manager_profiles.length - 1 && ", "}
                                                </span>
                                                ))
                                            }
                                        </>
                                    )
                                }
                            </div>
                        </div>
                        <QueueAbout description={queue.description}/>
                    </div>
                </div>

                <div className="flex h-fit shrink-0 items-center justify-self-end gap-4 lg:h-24">
                    <div className="flex flex-col items-center gap-1">
                        <QueueStatus isOpen={queue.is_open} />
                        <QueueVisibility visibility={queue.visibility}/>
                    </div>
                    <ManageQueueButton queue={queue} />
                </div>
            </div>
        </div>
    );
};

export default QueueHeader;
