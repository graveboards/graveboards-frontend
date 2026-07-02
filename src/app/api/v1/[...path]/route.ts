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

// Resolved lazily (not at module load): during `next build` page-data
// collection, INTERNAL_API_URL is unset so SERVER_API_URL falls back to the
// relative "/api/v1", and `new URL()` on a relative string throws. At request
// time in the container INTERNAL_API_URL is always an absolute URL.
const getBackendOrigin = (): string | null => {
    try {
        return new URL(SERVER_API_URL).origin;
    } catch {
        return null;
    }
};

const createBackendUrl = async (request: NextRequest, context: RouteContext) => {
    const {path} = await context.params;
    // Preserve a trailing slash: the catch-all segments drop it, but the backend
    // (Connexion) distinguishes "/api/v1/ui" from "/api/v1/ui/" and redirects the
    // former to the latter. Forwarding the slash verbatim avoids a redirect loop
    // and keeps Swagger UI's relative asset URLs resolving correctly.
    const trailingSlash = request.nextUrl.pathname.endsWith("/") ? "/" : "";
    const encodedPath = path.map(encodeURIComponent).join("/");
    const url = new URL(`${SERVER_API_URL}/${encodedPath}${trailingSlash}`);
    url.search = request.nextUrl.search;

    return url;
};

const stripHopByHopHeaders = (headers: Headers) => {
    const forwardedHeaders = new Headers(headers);

    HOP_BY_HOP_HEADERS.forEach((header) => forwardedHeaders.delete(header));
    forwardedHeaders.delete("content-length");
    forwardedHeaders.delete("content-encoding");
    forwardedHeaders.delete("transfer-encoding");

    return forwardedHeaders;
};

const createRequestHeaders = (headers: Headers, token?: string) => {
    const forwardedHeaders = stripHopByHopHeaders(headers);

    // Never leak the browser's httpOnly `session` cookie to the backend.
    forwardedHeaders.delete("cookie");

    // Authenticate same-origin website calls with the token decrypted from the
    // session. An explicit Authorization header (e.g. a Bearer token typed into
    // Swagger UI's "Authorize" box, or a direct API consumer) is left untouched
    // so the public API stays usable without a session.
    if (token && !forwardedHeaders.has("authorization")) {
        forwardedHeaders.set("authorization", `Bearer ${token}`);
    }

    return forwardedHeaders;
};

// Rewrite redirect targets that point back at the internal backend origin so the
// browser follows them against the public origin (graveboards.net) instead of the
// unreachable "http://graveboards-backend:8000".
const rewriteLocationHeader = (headers: Headers) => {
    const location = headers.get("location");
    const backendOrigin = getBackendOrigin();

    if (!location || !backendOrigin) {
        return;
    }

    try {
        const resolved = new URL(location, backendOrigin);

        if (resolved.origin === backendOrigin) {
            headers.set("location", resolved.pathname + resolved.search + resolved.hash);
        }
    } catch {
        // Non-absolute / malformed Location: leave it as the backend sent it.
    }
};

const proxyRequest = async (request: NextRequest, context: RouteContext) => {
    const method = request.method.toUpperCase();
    const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

    const session = await verifySession();

    const response = await fetch(await createBackendUrl(request, context), {
        method,
        headers: createRequestHeaders(request.headers, session?.token),
        body,
        cache: "no-store",
        redirect: "manual",
    });

    const responseHeaders = stripHopByHopHeaders(response.headers);
    rewriteLocationHeader(responseHeaders);

    // Buffer the (already decompressed) body as bytes so binary assets such as
    // Swagger UI's fonts and icons pass through intact — `response.text()` would
    // corrupt them, and a raw stream can mismatch the recomputed content-length.
    const responseBody = response.status === 204 || response.status === 304
        ? null
        : await response.arrayBuffer();

    return new Response(responseBody, {
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