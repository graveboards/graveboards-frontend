import React, {FC} from 'react';
import {MdLock, MdQuestionMark, MdVisibility, MdVisibilityOff} from "react-icons/md";
import type {QueueVisibility as QueueVisibilityValue} from "@/types/queue";
import {cn} from "@/lib/utils";

interface QueueVisibilityProps {
    visibility: QueueVisibilityValue;
    className?: string;
}

const QueueVisibility: FC<QueueVisibilityProps> = ({visibility, className}) => {
    const statuses = [
        { value: 2, icon: <MdLock/>, label: "Private" },
        { value: 1, icon: <MdVisibilityOff/>, label: "Unlisted" },
        { value: 0, icon: <MdVisibility/>, label: "Public" }
    ];

    return (
        <div
            className={cn("flex items-center gap-1.5 text-tertiary-500", className)}>
            {statuses.find(s => s.value === visibility)?.icon || <MdQuestionMark />}
            <p>{statuses.find(s => s.value === visibility)?.label || "Unknown"}</p>
        </div>
    );
};

export default QueueVisibility;
