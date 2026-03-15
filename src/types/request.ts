import { BeatmapsetSnapshot } from "@/types/beatmapset";
import { Queue } from "@/types/queue";
import {UserProfile} from "@/types/user";

export const RequestStatuses = {
    Pending: 0,
    Rejected: -1,
    Accepted: 1,
} as const;

export type RequestStatus = typeof RequestStatuses[keyof typeof RequestStatuses];

export interface Request {
    id: number;
    user_id: number;
    beatmapset_id: number;
    beatmapset_snapshot_id: number;
    queue_id: number;
    comment: string | null;
    mv_checked: boolean;
    created_at: string;
    updated_at: string;
    status: RequestStatus;
    beatmapset_snapshot?: BeatmapsetSnapshot;
    user_profile?: UserProfile;
    queue?: Queue;
}
