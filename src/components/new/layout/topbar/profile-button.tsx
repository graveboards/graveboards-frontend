"use client";

import {useAuth} from "@/context/auth-context";

const ProfileButton = () => {
    const {user} = useAuth();

    return (
        <button
            className="h-14 w-14 items-center gap-2 rounded-full shrink-0 hidden sm:flex justify-center transition-all duration-300 ease-in-out overflow-hidden">
            <img src={user?.profile?.avatar_url} alt="User avatar" className="object-cover"/>
        </button>
    );
}

export default ProfileButton;
