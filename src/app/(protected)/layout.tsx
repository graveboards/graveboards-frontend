import React from 'react';
import {redirect} from "next/navigation";
import {verifySession} from "@/actions/session";
import Topbar from "@/components/new/layout/topbar/topbar";

const Layout = async ({children}: {children: React.ReactNode}) => {
    const session = await verifySession();

    if (!session?.userId) {
        redirect("/home");
    }

    return (
        <>
            <Topbar />
            {children}
        </>
    );
};

export default Layout;
