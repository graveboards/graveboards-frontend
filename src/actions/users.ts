'use server'

import { User } from "@/types/user";
import { verifySession } from "@/actions/session";
import { cache } from "react";
import {SERVER_API_URL} from "@/lib/server-api-url";

const API_URL = SERVER_API_URL;

export const getUserById = cache(async (userId: string) => {
    const session = await verifySession();

    if (!session) {
        return;
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.token}`,
        },
    });

    if (!response.ok) {
        return;
    }

    return await response.json() as User;
});

export const getUsers = cache(async () => {
    const session = await verifySession();

    if (!session) {
        return;
    }

    const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.token}`,
        },
    });

    if (!response.ok) {
        return;
    }

    return await response.json() as User[];
});
