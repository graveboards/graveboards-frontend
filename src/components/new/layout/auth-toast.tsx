"use client";

import {useEffect, useRef} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import toast from "react-hot-toast";

const messages: Record<string, string> = {
    cancelled: "Sign-in was cancelled.",
    failed: "We couldn't finish signing you in. Please try again.",
};

const AuthToast = () => {
    const pathname = usePathname();
    const {replace} = useRouter();
    const searchParams = useSearchParams();
    const lastShownError = useRef<string | null>(null);

    useEffect(() => {
        const authError = searchParams.get("auth_error");

        if (!authError || lastShownError.current === authError) {
            return;
        }

        lastShownError.current = authError;
        toast.error(messages[authError] ?? messages.failed);

        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete("auth_error");

        const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;
        replace(nextUrl, {scroll: false});
    }, [pathname, replace, searchParams]);

    return null;
};

export default AuthToast;
