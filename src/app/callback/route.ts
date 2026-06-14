import {NextRequest, NextResponse} from "next/server";
import {loginUser} from "@/actions/auth";

const redirectWithAuthError = (request: NextRequest, reason: string) => {
    const url = new URL("/home", request.url);
    url.searchParams.set("auth_error", reason);

    return NextResponse.redirect(url);
};

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    if (error || !code || !state) {
        return redirectWithAuthError(request, "cancelled");
    }

    try {
        await loginUser(code, state);
        return NextResponse.redirect(new URL("/home", request.url));
    } catch {
        return redirectWithAuthError(request, "failed");
    }
}
