import React from 'react';
import {Metadata} from "next";
import SearchTopbar from "@/components/new/layout/search/search-topbar";
import SearchScopeBar from "@/components/new/layout/search/search-scope-bar";

export const metadata: Metadata = {
    title: 'Search | Graveboards',
}

const Layout = async ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <SearchTopbar/>
            <SearchScopeBar/>
            <div className="px-5 pb-5">
                {children}
            </div>
        </>
    )
};

export default Layout;