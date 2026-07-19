"use client";

import React, {FC, useEffect} from 'react';
import {Button} from "@/components/ui/button";
import {MdSearch} from "react-icons/md";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useSearch} from "@/context/search/search-context";
import {useDebouncedValue} from "@/hooks/use-debounced-value";

const SEARCH_DEBOUNCE_MS = 500;

const SearchBar: FC = () => {
    const {setSearch} = useSearch();

    const {replace} = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const q = searchParams.get("q") ?? "";
    const scope = searchParams.get("scope") || "beatmapsets";

    const [value, setValue] = React.useState(q);
    const debouncedSearch = useDebouncedValue(value, SEARCH_DEBOUNCE_MS);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const pushedQueryRef = React.useRef(q);
    const pendingUrlSyncRef = React.useRef<string | null>(null);

    useEffect(() => {
        if (q !== pushedQueryRef.current) {
            pendingUrlSyncRef.current = q;
            pushedQueryRef.current = q;
            setValue((prev) => prev === q ? prev : q);
        }

        setSearch(q);
    }, [q, setSearch]);

    useEffect(() => {
        if (pendingUrlSyncRef.current !== null) {
            if (debouncedSearch !== pendingUrlSyncRef.current) {
                return;
            }

            pendingUrlSyncRef.current = null;
        }

        setSearch(debouncedSearch);

        if (debouncedSearch === q) {
            return;
        }

        if (pathname !== "/search" && debouncedSearch.trim().length === 0) {
            return;
        }

        const params = new URLSearchParams();

        params.set("scope", scope);

        if (debouncedSearch) {
            params.set("q", debouncedSearch);
        }

        const nextUrl = `/search?${params.toString()}`;
        pushedQueryRef.current = debouncedSearch;

        replace(nextUrl);
    }, [debouncedSearch, pathname, q, replace, scope, setSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        pendingUrlSyncRef.current = null;
        setValue(newValue);
    }

    return (
        <div className="relative flex h-12 min-w-0 flex-1 items-center rounded-full">
            <div className="absolute">
                <Button rounded="full" variant="clear" className="px-2.5 ml-1 text-xl">
                    <MdSearch/>
                </Button>
            </div>
            <input
                ref={inputRef}
                value={value}
                onChange={handleChange}
                className="h-full w-0 min-w-0 flex-1 rounded-full px-12 caret-primary-500 outline-tertiary-400 dark:outline-hidden border-2 border-tertiary-200 dark:border-0 bg-white dark:bg-tertiary-900 dark:focus:bg-tertiary-800 transition-colors"
                placeholder="Type to search..."
            />
            {/*<div className="absolute right-0">
                <Button rounded="full" variant="clear" className="px-2.5 mr-1 text-xl">
                    <MdFilterList/>
                </Button>
            </div>*/}
        </div>
    );
}

export default SearchBar;
