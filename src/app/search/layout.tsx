import React, {Suspense} from 'react';
import {Metadata} from "next";
import SearchScopeBar from "@/components/new/layout/search/search-scope-bar";
import {SearchProvider} from "@/context/search/search-context";
import Topbar from "@/components/new/layout/topbar/topbar";
import PageContent from "@/components/new/layout/page-content";

export const metadata: Metadata = {
    title: 'Search | Graveboards',
}

const Layout = async ({children}: { children: React.ReactNode }) => {
    return (
        <SearchProvider>
            <Topbar/>
            <Suspense fallback={null}>
                <SearchScopeBar/>
            </Suspense>
            <PageContent>
                {children}
            </PageContent>
        </SearchProvider>
    )
};

export default Layout;
