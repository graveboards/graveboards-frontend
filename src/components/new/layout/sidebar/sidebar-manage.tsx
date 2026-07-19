import {useAuth} from "@/context/auth-context";
import React from "react";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {Queue} from "@/types/queue";
import {SidebarSection, SidebarSectionContent, SidebarSectionLabel} from "@/components/new/layout/sidebar/sidebar";
import SidebarManageQueueButton from "@/components/new/layout/sidebar/sidebar-manage-queue-button";
import {API_URL} from "@/lib/constants";

const SidebarManage = () => {
    const {isAuthenticated, user} = useAuth();

    const {
        data: queues,
        isLoading,
        error
    } = useSWR<Queue[]>(user ? `${API_URL}/queues?user_id=${user.id}&include[user_profile]=true` : null, fetcher, {
        revalidateOnFocus: false
    });

    if (!isAuthenticated || isLoading || error || !queues?.length) {
        return null;
    }

    return (
        <SidebarSection>
            <SidebarSectionContent>
                <SidebarSectionLabel>
                    Manage
                </SidebarSectionLabel>
                {queues?.map(queue => (
                    <SidebarManageQueueButton queue={queue} key={queue.id} />
                ))}
            </SidebarSectionContent>

        </SidebarSection>
    );
};

export default SidebarManage;
