'use client';

import React from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import clsx from "clsx";
import {SearchQueryScope} from "@/types/search";

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

    const handleScopeChange = async (scope: SearchQueryScope) => {
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
        <div
            className="flex flex-1 border-b justify-center border-tertiary-200 dark:border-tertiary-800 items-center gap-6 sticky top-0 z-10 backdrop-blur-sm bg-white dark:bg-transparent dark:backdrop-brightness-[0.1]">
            {Object.entries(items).map(([key, item], index) => (
                <button
                    onClick={() => handleScopeChange(key as SearchQueryScope)}
                    key={index}
                    className={clsx(
                        `group relative h-8 transition-colors duration-300 ease-in-out cursor-pointer`,
                        isActive(key as SearchQueryScope) ? 'text-primary-500 dark:hover:text-primary-400' : 'text-tertiary-400 hover:text-tertiary-500 dark:text-tertiary-600'
                    )}
                >
                    {item.label}
                    <div
                        className={clsx(
                            "absolute inset-x-0 -bottom-0.75 h-1.25 rounded-full ",
                            "transform-gpu origin-center scale-x-0 transition-transform,colors duration-300 ease-in-out",
                            "group-hover:scale-x-100",
                            isActive(key as SearchQueryScope) ? "scale-x-100 bg-primary-500" : "bg-tertiary-700"
                        )}
                    />
                </button>
            ))}
        </div>
    );
};

export default SearchScopeBar;
