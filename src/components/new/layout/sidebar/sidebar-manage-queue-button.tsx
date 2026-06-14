"use client";

import React, {FC} from "react";
import {Queue} from "@/types/queue";
import Link from "next/link";
import {SidebarButton} from "@/components/new/layout/sidebar/sidebar";
import {usePathname} from "next/navigation";

interface SidebarManageQueueButtonProps {
    queue: Queue;
}

const SidebarManageQueueButton: FC<SidebarManageQueueButtonProps> = ({queue}) => {
    const pathname = usePathname();

    return (
        <SidebarButton asChild isActive={pathname ===`/queues/${queue.id}/manage`} key={queue.id}>
            <Link href={`/queues/${queue.id}/manage`}>
                <div className="size-6 bg-tertiary-500 rounded-sm bg-cover"
                     style={{backgroundImage: `url(${queue.user_profile?.avatar_url})`}}/>
                {queue.name}
            </Link>
        </SidebarButton>
    );
};

export default SidebarManageQueueButton;
