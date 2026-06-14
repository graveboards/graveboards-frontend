import React, {Suspense} from 'react';
import {Metadata} from "next";
import SearchTopbar from "@/components/new/layout/search/search-topbar";
import SearchScopeBar from "@/components/new/layout/search/search-scope-bar";
import {SearchProvider} from "@/context/search/search-context";

export const metadata: Metadata = {
    title: 'Search | Graveboards',
}

const Layout = async ({children}: { children: React.ReactNode }) => {
    return (
        <SearchProvider>
            <SearchTopbar/>
            <Suspense fallback={null}>
                <SearchScopeBar/>
            </Suspense>
            <div className="px-5 pb-5">
                {children}
            </div>
        </SearchProvider>
    )
};

export default Layout;
