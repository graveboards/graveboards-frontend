import {NextRequest, NextResponse} from "next/server";
import {loginUser} from "@/actions/auth";
import {absoluteUrl} from "@/lib/base-url";

const redirectWithAuthError = (request: NextRequest, reason: string) => {
    const url = absoluteUrl(request, "/home");
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
    } catch {
        return redirectWithAuthError(request, "failed");
    }

    return NextResponse.redirect(absoluteUrl(request, "/home"));
}