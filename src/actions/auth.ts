"use server";

import {createSession, deleteSession, verifySession} from "@/actions/session";
import {cache} from "react";
import {User} from "@/types/user";
import {redirect} from "next/navigation";
import {JWTPayload} from "jose";
import {SERVER_API_URL} from "@/lib/server-api-url";

const API_URL = SERVER_API_URL;

export interface LoginResponse {
    authorization_url: string;
    state: string;
}

export const startOAuth = async () => {
    const response = await fetch(`${API_URL}/login`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        return;
    }

    return await response.json() as LoginResponse;
};

export interface CodeResponse {
    token: string;
}

export const loginUser = async (code: string, state: string) => {
    const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ code, state }).toString()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch token");
    }

    const {token} = await response.json() as CodeResponse;

    try {
        const payload = await verifyToken(token);

        await createSession(token, payload);
    } catch {
        throw new Error("Authentication failed");
    }

};

export const verifyToken = async (token: string) => {
    const response = await fetch(`${API_URL}/token?token=${token}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    if (!response.ok) {
        throw new Error("Token is invalid");
    }

    return await response.json() as JWTPayload;
};

export const logoutUser = async () => {
    await deleteSession();
    redirect("/");
}

export const fetchUser = cache(async () => {
    const session = await verifySession();

    if (!session) {
        return;
    }

    const response = await fetch(`${API_URL}/users/${session.userId}?include[profile]=true&include[roles][id]=true`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`,
        },
    });

    if (!response.ok) {
        return;
    }

    return await response.json() as User;
});

