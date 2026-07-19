import "server-only";

import {cache} from "react";
import {notFound} from "next/navigation";
import {getQueue} from "@/actions/queues";
import {fetchUser} from "@/actions/auth";
import {
    canAccessQueue,
    canEditQueueSettings,
    canManageQueue,
    isAdminUser,
} from "@/lib/queue-permissions";

export const getQueueRouteAccess = cache(async (queueId: number) => {
    const result = await getQueue(queueId);

    if (!result.ok) {
        if (result.status === 403 || result.status === 404) {
            notFound();
        }

        throw new Error(`Failed to load queue ${queueId}: backend returned ${result.status}.`);
    }

    const user = await fetchUser();

    if (user?.id === undefined) {
        throw new Error("Failed to determine the current user for queue authorization.");
    }

    const isAdmin = isAdminUser(user);

    if (!canAccessQueue(result.queue, user, isAdmin)) {
        notFound();
    }

    return {
        queue: result.queue,
        user,
        isAdmin,
        canManage: canManageQueue(result.queue, user, isAdmin),
        canEditSettings: canEditQueueSettings(result.queue, user, isAdmin),
    };
});
