import {UserProfile} from "@/types/user";

export type QueueVisibility = 0 | 1 | 2;

export interface Queue {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    is_open: boolean;
    visibility: QueueVisibility;
    user_profile: UserProfile;
    manager_profiles: UserProfile[];
}

export interface QueuePatch {
    name?: string;
    description?: string;
    is_open?: boolean;
    visibility?: QueueVisibility;
}
