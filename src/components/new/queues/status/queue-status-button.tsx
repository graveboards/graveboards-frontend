"use client";

import type {FC} from "react";
import {FaCircleNotch} from "react-icons/fa6";
import {MdCheck, MdClose} from "react-icons/md";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useQueuePatch} from "@/hooks/use-queue-patch";
import type {Queue} from "@/types/queue";
import {useAuth} from "@/context/auth-context";
import {canEditQueueSettings} from "@/lib/queue-permissions";

interface QueueStatusButtonProps {
    queue: Queue;
    isOpen?: boolean;
    disabled?: boolean;
    onClick?: (status: boolean) => void;
}

const QueueStatusButton: FC<QueueStatusButtonProps> = ({
    queue,
    isOpen = queue.is_open,
    disabled = false,
    onClick,
}) => {
    const {user, isAdmin} = useAuth();
    const canUpdateStatus = canEditQueueSettings(queue, user, isAdmin);
    const {
        submit,
        isPending,
    } = useQueuePatch(queue.id, {
        successMessage: "Queue status updated successfully.",
        errorMessage: "Failed to update queue status.",
    });

    const handleClick = async () => {
        const nextStatus = !isOpen;
        const result = await submit({is_open: nextStatus});

        if (result.ok) {
            onClick?.(nextStatus);
        }
    };

    if (!canUpdateStatus) {
        return null;
    }

    return (
        <Button
            className={cn(
                isOpen
                    ? "border-primary-500 hover:border-primary-400 active:border-primary-300"
                    : "bg-green-500 hover:bg-green-400 active:bg-green-300",
            )}
            disabled={disabled || isPending}
            onClick={() => void handleClick()}
            rounded="full"
            size="lg"
            type="button"
            variant="fill"
        >
            {isPending ? (
                <>
                    <FaCircleNotch className="size-4 animate-spin" aria-hidden="true"/>
                    {isOpen ? "Closing queue…" : "Opening queue…"}
                </>
            ) : isOpen ? (
                <>
                    <MdClose className="size-6" aria-hidden="true"/>
                    Close Queue
                </>
            ) : (
                <>
                    <MdCheck className="size-6" aria-hidden="true"/>
                    Open Queue
                </>
            )}
        </Button>
    );
};

export default QueueStatusButton;
