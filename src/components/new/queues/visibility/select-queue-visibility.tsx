"use client";

import React, {FC} from "react";
import {FaCircleNotch} from "react-icons/fa6";
import Select from "@/components/ui/select";
import QueueVisibility from "@/components/new/queues/visibility/queue-visibility";
import type {QueueVisibility as QueueVisibilityValue} from "@/types/queue";

interface SelectQueueVisibilityProps {
    visibility: QueueVisibilityValue;
    disabled?: boolean;
    isPending?: boolean;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    onSelect: (visibility: QueueVisibilityValue) => void;
}

const visibilityOptions: QueueVisibilityValue[] = [0, 1, 2];

const SelectQueueVisibility: FC<SelectQueueVisibilityProps> = ({
    visibility,
    disabled = false,
    isPending = false,
    ariaLabelledBy,
    ariaDescribedBy,
    onSelect,
}) => (
    <Select
        items={visibilityOptions}
        renderItem={(item) => (
            <QueueVisibility visibility={item} className="text-black dark:text-white"/>
        )}
        renderSelected={(item) => (
            <div className="flex items-center gap-1">
                <QueueVisibility visibility={item} className="text-black dark:text-white"/>
                {isPending && <FaCircleNotch className="ml-1.5 size-4 animate-spin"/>}
            </div>
        )}
        onItemSelect={(item) => {
            if (item !== null && item !== visibility) {
                onSelect(item);
            }
        }}
        selected={visibility}
        isSelected={(item) => item === visibility}
        className="w-full sm:w-auto"
        disabled={disabled || isPending}
        triggerAriaLabelledBy={ariaLabelledBy}
        triggerAriaDescribedBy={ariaDescribedBy}
    />
);

export default SelectQueueVisibility;
