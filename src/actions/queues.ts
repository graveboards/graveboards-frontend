"use server";

import {Queue, QueuePatch} from "@/types/queue";
import { cache } from "react";
import { verifySession } from "@/actions/session";
import { revalidatePath } from "next/cache";
import {SERVER_API_URL} from "@/lib/server-api-url";

const API_URL = SERVER_API_URL;

export type QueueResult =
    | {ok: true; queue: Queue}
    | {ok: false; status: number};

export type QueuePatchResult =
    | {ok: true}
    | {ok: false; status: number};

const QUEUE_INCLUDE_QUERY = new URLSearchParams({
    "include[user_profile]": "true",
    "include[manager_profiles]": "true",
}).toString();

export const getQueues = cache(async (params?: URLSearchParams) => {
    const session = await verifySession();

    if (!session) {
        return;
    }

    const url = new URL(`${API_URL}/queues`);

    if (params) {
        url.search = params.toString();
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
        }
    });

    return await response.json() as Queue[];
});

export const getQueue = async (id: number): Promise<QueueResult> => {
    const session = await verifySession();

    if (!session) {
        return {ok: false, status: 401};
    }

    const response = await fetch(`${API_URL}/queues/${id}?${QUEUE_INCLUDE_QUERY}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
        },
        cache: "no-store",
    });

    if (!response.ok) {
        return {ok: false, status: response.status};
    }

    return {
        ok: true,
        queue: await response.json() as Queue,
    };
};

export const postQueue = async (queue: Partial<Queue>) => {
    const session = await verifySession();

    if (!session) {
        return;
    }

    const response = await fetch(`${API_URL}/queues`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
        },
        body: JSON.stringify(queue)
    });

    const q = await response.json() as Queue;

    revalidatePath("/queues");

    return q;
};

export const patchQueue = async (id: number, queue: QueuePatch): Promise<QueuePatchResult> => {
    const session = await verifySession();

    if (!session) {
        return {ok: false, status: 401};
    }

    const response = await fetch(`${API_URL}/queues/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
        },
        body: JSON.stringify(queue)
    });

    if (!response.ok) {
        return {ok: false, status: response.status};
    }

    revalidatePath("/queues");
    revalidatePath(`/queues/${id}`, "layout");

    return {ok: true};
};
