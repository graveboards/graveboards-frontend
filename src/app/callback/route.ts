import {NextRequest, NextResponse} from "next/server";
import {loginUser} from "@/actions/auth";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    if (error || !code || !state) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        await loginUser(code, state);
        return NextResponse.redirect(new URL("/", request.url));
    } catch (e) {
        console.error("Error during login:", e);
        return NextResponse.redirect(new URL("/", request.url));
    }
}