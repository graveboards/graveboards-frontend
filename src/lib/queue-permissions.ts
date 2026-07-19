import type {Queue} from "@/types/queue";
import type {User} from "@/types/user";

export const isAdminUser = (user: User | null | undefined): boolean => (
    user?.roles?.some((role) => role.name?.toLowerCase() === "admin") ?? false
);

export const canManageQueue = (
    queue: Queue,
    user: User | null | undefined,
    isAdmin = isAdminUser(user),
): boolean => {
    const userId = user?.id;

    if (isAdmin) {
        return true;
    }

    if (userId === undefined) {
        return false;
    }

    return queue.user_id === userId
        || queue.manager_profiles.some((manager) => manager.user_id === userId);
};

export const canEditQueueSettings = (
    queue: Queue,
    user: User | null | undefined,
    isAdmin = isAdminUser(user),
): boolean => {
    if (isAdmin) {
        return true;
    }

    return user?.id !== undefined && queue.user_id === user.id;
};

export const canAccessQueue = (
    queue: Queue,
    user: User | null | undefined,
    isAdmin = isAdminUser(user),
): boolean => (
    queue.visibility !== 2 || canManageQueue(queue, user, isAdmin)
);
