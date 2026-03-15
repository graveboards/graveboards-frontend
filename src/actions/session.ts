import "server-only";
import {cookies} from "next/headers";
import {JWTPayload, jwtVerify, SignJWT} from "jose";

interface Session extends JWTPayload {
    userId: string;
    token: string;
    iat?: number;
    exp?: number;
    sub?: string;
    iss?: string;
}

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export const decrypt = async (session?: string) => {
    try {
        if (!session) {
            return null;
        }

        const {payload} = await jwtVerify(session, key, {algorithms: ["HS256"]});

        return payload;
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ERR_JWT_EXPIRED"
        ) {
            return null;
        }

        console.error(error);
        return null;
    }
}

export const encrypt = async (payload: JWTPayload) => {
    return new SignJWT(payload)
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime('1day')
        .sign(key)
}

export const createSession = async (token: string, payload: JWTPayload) => {
    const expires = payload.exp ? new Date(payload.exp * 1000) : new Date(Date.now() + 1000 * 60 * 60 * 24);

    const userId = payload.sub;

    if (!userId) {
        throw new Error("User ID is missing in payload");
    }

    const session = await encrypt({
        userId,
        token,
        ...payload
    });

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires,
    });
};

export const verifySession = async () => {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
        return null;
    }

    return session as Session;
}

export const deleteSession = async () => {
    const cookieStore = await cookies();

    if (cookieStore.get("session")) {
        cookieStore.delete("session");
    }
}
