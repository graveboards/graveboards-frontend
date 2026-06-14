"use client";

import React, {FC, useState} from "react";
import {Queue} from "@/types/queue";
import QueueStatus from "@/components/new/queues/status/queue-status";
import QueueStatusButton from "@/components/new/queues/status/queue-status-button";
import {MdCheck, MdEdit, MdPersonAdd} from "react-icons/md";
import {Button} from "@/components/ui/button";
import {BiTransferAlt} from "react-icons/bi";

interface ManageQueueHeaderProps {
    queue: Queue;
}

const ManageQueueHeader: FC<ManageQueueHeaderProps> = ({queue}) => {
    const [isOpen, setIsOpen] = useState(queue.is_open);

    return (
        <div
            className="px-8 py-6 flex-col gap-8 lg:flex-row flex justify-between items-center rounded-xl dark:text-white self-stretch transition-colors duration-300 ease-in-out">
            <div className="flex sm:flex-row flex-col items-center gap-6 flex-1">
                <div className="size-24 rounded-xl shrink-0 bg-cover"
                     style={{backgroundImage: `url(${queue.user_profile.avatar_url})`}}/>
                <div className="flex flex-col gap-1.5 flex-1">
                    <div>
                        <QueueNameInput queue={queue}/>
                        <QueueOwnership queue={queue}/>
                    </div>
                    <QueueDescriptionInput queue={queue}/>
                </div>
                <div className="flex items-center justify-self-end gap-4">
                    <QueueStatus isOpen={isOpen}/>

                    <QueueStatusButton
                        onClick={(status) => setIsOpen(status)}
                        queue={queue}/>
                </div>
            </div>
        </div>
    );
};

export default ManageQueueHeader;

const QueueNameInput = ({queue}: { queue: Queue }) => {
    const [name, setName] = useState(queue.name);
    const [editMode, setEditMode] = useState(false);

    if (editMode) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-b-2 border-tertiary-800 focus:outline-none focus:border-primary-500"
                />
                <Button
                    onClick={() => {
                        setEditMode(false);
                        queue.name = name;
                    }}
                    variant="clear"
                    size="sm"
                >
                    <MdCheck/>
                </Button>
            </div>
        )
    }

    return (
        <button onClick={() => setEditMode(true)}
                className="flex items-center font-semibold gap-2 group cursor-pointer text-left">
            {queue.name}
            <div className="group-hover:opacity-100 opacity-0 transition-opacity"><MdEdit/></div>
        </button>
    )
}

const QueueOwnership = ({queue}: { queue: Queue }) => {
    return (
        <div className="flex gap-2 items-center group flex-wrap">
            <div className="text-sm text-tertiary-500">Owned by <a
                href={`https://osu.ppy.sh/users/${queue.user_id}`}
                className="font-semibold" target="_blank">{queue.user_profile.username}</a>
                {queue.manager_profiles.length > 0 && (
                    <>
                        • Managed by
                        {queue.manager_profiles.map((manager, index) => (
                            <span key={index}>
                                                    <a href={`https://osu.ppy.sh/users/${manager.id}`}
                                                       className="font-semibold" target="_blank">{manager.username}</a>
                                {index < queue.manager_profiles.length - 1 && ", "}
                                        </span>
                        ))}
                    </>
                )}
            </div>
            <Button variant="clear" size="xs" className="text-xs opacity-0 group-hover:opacity-100">
                <BiTransferAlt/>
                Transfer ownership
            </Button>

            <Button variant="clear" size="xs" className="text-xs opacity-0 group-hover:opacity-100">
                <MdPersonAdd/>
                Add a manager
            </Button>
        </div>

    )
}

const QueueDescriptionInput = ({queue}: { queue: Queue }) => {
    const [description, setDescription] = useState(queue.description ?? "");
    const [editMode, setEditMode] = useState(false);

    if (editMode) {
        return (
            <div className="flex items-center gap-2">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-b-2 border-tertiary-800 focus:outline-none focus:border-primary-500 w-full text-sm"
                    rows={2}
                />
                <Button
                    onClick={() => {
                        setEditMode(false);
                        queue.description = description;
                    }}
                    variant="clear"
                    size="sm"
                >
                    <MdCheck/>
                </Button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setEditMode(true)}
            className="group flex gap-2 items-center cursor-pointer"
        >
            <div className="text-sm text-tertiary-500 line-clamp-2 text-ellipsis text-left">
                {queue.description}
            </div>

            <span className="group-hover:opacity-100 opacity-0 transition-opacity inline text-tertiary-500"><MdEdit/></span>
        </button>
    )
}
