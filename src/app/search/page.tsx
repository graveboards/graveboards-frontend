import React from 'react';
import SearchContent from "@/components/new/search/search-content";
import {SearchQueryScope} from "@/types/search";

interface PageProps {
    searchParams: Promise<{ scope?: string }>;
}

const Page = async ({searchParams}: PageProps) => {
    const sp = await searchParams;

    const scope = sp.scope;

    if (scope) {
        return <SearchContent scope={scope as SearchQueryScope}/>;
    }

    return <SearchContent scope={'all' as SearchQueryScope}/>;
};

export default Page;