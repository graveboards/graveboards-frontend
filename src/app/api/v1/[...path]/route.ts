import {NextRequest} from "next/server";
import {SERVER_API_URL} from "@/lib/server-api-url";

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

const createHeaders = (headers: Headers) => {
    const forwardedHeaders = new Headers(headers);

    HOP_BY_HOP_HEADERS.forEach((header) => forwardedHeaders.delete(header));

    return forwardedHeaders;
};

const proxyRequest = async (request: NextRequest, context: RouteContext) => {
    const method = request.method.toUpperCase();
    const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

    const response = await fetch(await createBackendUrl(request, context), {
        method,
        headers: createHeaders(request.headers),
        body,
        cache: "no-store",
        redirect: "manual",
    });

    const responseHeaders = createHeaders(response.headers);

    return new Response(response.body, {
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
