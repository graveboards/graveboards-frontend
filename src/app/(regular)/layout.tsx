import React from 'react';
import Topbar from "@/components/new/layout/topbar/topbar";
import PageContent from "@/components/new/layout/page-content";

const Layout = async ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Topbar />
            <PageContent>
                {children}
            </PageContent>
        </>
    );
};

export default Layout;
