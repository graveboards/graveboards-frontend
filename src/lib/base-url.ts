import "server-only";
import type {NextRequest} from "next/server";

// Resolve the public origin of the app (e.g. "https://graveboards.net").
//
// Preference order:
//   1. APP_URL         — explicit canonical origin, un-spoofable. Set this in prod.
//   2. X-Forwarded-*   — set by the reverse proxy (Traefik) when TLS is terminated
//                        upstream. Client-supplied, so only trusted as a fallback.
//   3. Host header     — direct connections / local dev.
//
// Building URLs from `request.url` alone is unreliable behind a proxy: the Next
// standalone server falls back to its bind address (HOSTNAME:PORT), which is how
// redirects end up pointing at https://0.0.0.0:3000 in prod.
export const getBaseUrl = (request: NextRequest): string => {
    const configured = process.env.APP_URL?.replace(/\/$/, "");
    if (configured) {
        return configured;
    }

    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost ?? request.headers.get("host");

    if (host) {
        // Prefer the proxy's proto; otherwise use whatever protocol Next actually saw.
        const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(/:$/, "");
        return `${proto}://${host}`;
    }

    // Last resort: whatever Next derived (may be the internal bind address).
    return request.nextUrl.origin;
};

// Convenience: build an absolute URL for a path against the resolved origin.
export const absoluteUrl = (request: NextRequest, path: string): URL => {
    return new URL(path, getBaseUrl(request));
};