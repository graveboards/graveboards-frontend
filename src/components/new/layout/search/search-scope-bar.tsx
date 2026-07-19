'use client';

import React from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import {SearchQueryScope} from "@/types/search";
import {PageTab, PageTabs} from "@/components/new/layout/page-tabs";

const items: Record<SearchQueryScope, { label: string }> = {
    beatmapsets: {label: "Beatmapsets"},
    beatmaps: {label: "Beatmaps"},
    requests: {label: "Requests"},
    queues: {label: "Queues"},
}

const SearchScopeBar = () => {
    const {replace, push} = useRouter();
    const searchParams = useSearchParams();

    const scope = searchParams.get("scope") as SearchQueryScope ?? "beatmapsets";
    const q = searchParams.get("q");

    const isActive = (queryScope: SearchQueryScope) => scope === queryScope;

    const handleScopeChange = (scope: SearchQueryScope) => {
        const params = new URLSearchParams();
        params.set("scope", scope);
        if (q) {
            params.set("q", q);
        }

        const nextUrl = `/search?${params.toString()}`;

        if (isActive(scope)) {
            replace(nextUrl);
        } else {
            push(nextUrl);
        }
    }

    return (
        <PageTabs aria-label="Search scopes">
            {Object.entries(items).map(([key, item]) => {
                const itemScope = key as SearchQueryScope;

                return (
                <PageTab
                    isActive={isActive(itemScope)}
                    key={key}
                    onClick={() => handleScopeChange(key as SearchQueryScope)}
                >
                    {item.label}
                </PageTab>
                );
            })}
        </PageTabs>
    );
};

export default SearchScopeBar;
