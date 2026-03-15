"use client";

import React, {startTransition, useActionState, useState} from "react";
import {FaCircleNotch} from "react-icons/fa6";
import {MdLogin} from "react-icons/md";
import {startOAuth} from "@/actions/auth";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "@/context/auth-context";
import {SidebarButton} from "@/components/new/layout/sidebar/sidebar";

const SidebarLoginButton = () => {
    const currentPath = usePathname();
    const {replace} = useRouter();
    const isCallback = currentPath === "/callback";

    const [state, action] = useActionState(startOAuth, null);
    const [disabled, setDisabled] = useState(false);

    if (state?.authorization_url) {
        replace(state.authorization_url);
    }

    const {isLoading} = useAuth();

    const isDisabled = disabled || isCallback || isLoading;

    return (
        <SidebarButton
            onClick={() => {
                startTransition(action);
                setDisabled(true);
            }}
            disabled={isDisabled}
        >
            {isDisabled ? (
                <>
                    <FaCircleNotch className="animate-spin"/>
                    Loading...
                </>
            ) : (
                <>
                    <MdLogin/>
                    Log In
                </>
            )}
        </SidebarButton>
    );
};

export default SidebarLoginButton;
