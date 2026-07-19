"use client";

import React, {startTransition, useActionState, useEffect, useState} from "react";
import {FaCircleNotch} from "react-icons/fa6";
import {MdLogin} from "react-icons/md";
import {startOAuth} from "@/actions/auth";
import {usePathname} from "next/navigation";
import {useAuth} from "@/context/auth-context";
import {SidebarButton} from "@/components/new/layout/sidebar/sidebar";

const SidebarLoginButton = () => {
    const currentPath = usePathname();
    const isCallback = currentPath === "/callback";

    const [state, action] = useActionState(startOAuth, null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (state?.authorization_url) {
            window.location.assign(state.authorization_url);
        }
    }, [state?.authorization_url]);

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
