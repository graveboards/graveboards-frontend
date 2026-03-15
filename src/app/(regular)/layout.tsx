import React from 'react';
import Topbar from "@/components/new/layout/topbar/topbar";

const Layout = async ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Topbar />
            <div className="px-5 pb-5">
                {children}
            </div>
        </>
    );
};

export default Layout;