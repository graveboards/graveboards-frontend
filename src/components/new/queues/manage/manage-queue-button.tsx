import React, { FC } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { Queue } from "@/types/queue";
import {canManageQueue} from "@/lib/queue-permissions";

interface ManageQueueButtonProps {
    queue: Queue;
}

const ManageQueueButton: FC<ManageQueueButtonProps> = ({ queue }) => {
    const { user, isAdmin } = useAuth();
    const canManage = canManageQueue(queue, user, isAdmin);

    return canManage && (
        <Link
            href={`/queues/${queue.id}/manage`}>
            <Button rounded="full" size="lg">
                <MdEdit className="size-6" />
                <p className="lg:block hidden">Manage Queue</p>
            </Button>
        </Link>
    );
};

export default ManageQueueButton;
