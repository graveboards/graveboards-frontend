"use client";

import {useAuth} from "@/context/auth-context";
import Image from "next/image";

const ProfileButton = () => {
    const {user} = useAuth();
    const avatarUrl = user?.profile?.avatar_url;

    return (
        <button
            className="h-14 w-14 items-center gap-2 rounded-full shrink-0 hidden sm:flex justify-center transition-all duration-300 ease-in-out overflow-hidden">
            {avatarUrl && (
                <Image
                    src={avatarUrl}
                    alt="User avatar"
                    width={56}
                    height={56}
                    className="size-full object-cover"
                />
            )}
        </button>
    );
}

export default ProfileButton;
