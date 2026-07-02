import {NextRequest} from "next/server";
import {SERVER_API_URL} from "@/lib/server-api-url";
import {verifySession} from "@/actions/session";

type RouteContext = {
    params: Promise<{
        path: string[];
    }>;
};

const HOP_BY_HOP_HEADERS = new Set([
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "host",
]);

const createBackendUrl = async (request: NextRequest, context: RouteContext) => {
    const {path} = await context.params;
    const url = new URL(`${SERVER_API_URL}/${path.map(encodeURIComponent).join("/")}`);
    url.search = request.nextUrl.search;

    return url;
};

const createHeaders = (headers: Headers, token?: string) => {
    const forwardedHeaders = new Headers(headers);

    HOP_BY_HOP_HEADERS.forEach((header) => forwardedHeaders.delete(header));
    forwardedHeaders.delete("content-length");
    forwardedHeaders.delete("content-encoding");
    forwardedHeaders.delete("transfer-encoding");

    // The browser authenticates to the Next app via the httpOnly `session` cookie, but the backend expects a Bearer JWT.
    // Never leak the session cookie downstream; instead inject the token decrypted from the session.
    forwardedHeaders.delete("cookie");
    forwardedHeaders.delete("authorization");

    if (token) {
        forwardedHeaders.set("authorization", `Bearer ${token}`);
    }

    return forwardedHeaders;
};

const proxyRequest = async (request: NextRequest, context: RouteContext) => {
    const method = request.method.toUpperCase();
    const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

    const session = await verifySession();

    const response = await fetch(await createBackendUrl(request, context), {
        method,
        headers: createHeaders(request.headers, session?.token),
        body,
        cache: "no-store",
        redirect: "manual",
    });

    const responseHeaders = createHeaders(response.headers);

    const text = await response.text();
    return new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
    });
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;