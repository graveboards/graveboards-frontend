import React, {ComponentProps, useCallback, useEffect} from 'react';
import {InfiniteParams, useAPIInfinite} from "@/hooks/use-swr-infinite-wrapper";
import {cn} from "@/lib/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import {MdClose, MdGridView, MdOutlineViewAgenda, MdSearch} from "react-icons/md";
import clsx from "clsx";
import {EndpointDefinition, EndpointKey, EndpointSpecification} from "@/types/endpoints";
import {useDebouncedValue} from "@/hooks/use-debounced-value";

export enum Layout {
    List = "list",
    Grid = "grid",
}

const SEARCH_DEBOUNCE_MS = 500;

type ItemOf<K extends EndpointKey> = EndpointSpecification[K]["page"][number];

type Props<K extends EndpointKey> = {
    title: string;

    defaultLayout?: Layout;

    endpoint: EndpointDefinition<K>;
    params: InfiniteParams<K>;
    defaults?: InfiniteParams<K>;

    showControls?: boolean;
    showLayoutSwitch?: boolean;
    showSearch?: boolean;
    showFilters?: boolean;
    showSorting?: boolean;
    editMode?: boolean;

    loader: (view: Layout) => React.ReactNode;
    itemKey: (item: ItemOf<K>, index: number) => React.Key;
    renderItem: (item: ItemOf<K>, view: Layout, editMode?: boolean) => React.ReactNode;

    classNames?: {
        list?: string;
    }
} & ComponentProps<"div">;

export function InfiniteResourceList<K extends EndpointKey>({
                                                                title,
                                                                endpoint,
                                                                defaultLayout,
                                                                params = {},
                                                                defaults,
                                                                loader,
                                                                itemKey,
                                                                renderItem,
                                                                className,
                                                                classNames,
                                                                showControls = true,
                                                                showLayoutSwitch = true,
                                                                showSearch = true,
                                                                showFilters = true,
                                                                showSorting = true,
                                                                editMode = false,
                                                                ...props
                                                            }: Props<K>) {
    if (editMode) {
        showLayoutSwitch = false;
    }

    showControls = showControls || (showLayoutSwitch && showSearch && showFilters && showSorting);

    const [layout, setLayout] = React.useState<Layout>(editMode ? Layout.List : defaultLayout ?? Layout.Grid);
    const [search, setSearch] = React.useState(params.search ?? defaults?.search ?? '');
    const [filters] = React.useState(params.filters);

    useEffect(() => {
        setSearch(params.search ?? defaults?.search ?? '');
    }, [params.search, defaults?.search]);

    const {items, error, size, setSize, isReachingEnd, isEmpty, isValidating} = useAPIInfinite(
        endpoint,
        {
            ...params,
            search,
            filters,
        },
        defaults
    );

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (isEmpty || isReachingEnd || isValidating) {
            return;
        }

        const isPageScrollable = document.documentElement.scrollHeight > window.innerHeight;
        if (isPageScrollable) {
            return;
        }

        const timeout = setTimeout(() => {
            setSize(size + 1);
        }, 0);

        return () => clearTimeout(timeout);
    }, [isEmpty, isReachingEnd, isValidating, items.length, setSize, size]);

    if (error) {
        console.error("InfiniteResourceList error:", error);
        return (
            <div className="text-center text-2xl font-semibold text-red-500">
                Failed to load resources
            </div>
        );
    }

    return (
        <section
            className={cn("flex flex-col gap-4", className)}
            {...props}
        >
            <header className="flex flex-col lg:flex-row justify-between gap-2">
                <h1 className="text-2xl font-semibold truncate transition-all duration-300 ease-in-out">
                    {title}
                </h1>

                {showControls && (
                    <div className="flex flex-row items-center justify-center self-end gap-4 max-w-full relative">
                        {showLayoutSwitch && <LayoutSwitch layout={layout} setLayout={setLayout}/>}
                        {showLayoutSwitch && (showSearch || showFilters || showSorting) && <ControlsDivider/>}
                        {(showSearch || showFilters || showSorting) && (
                            <div className="flex gap-2 relative">
                                {showSearch && <Search search={search} setSearch={setSearch}/>}
                            </div>
                        )}
                    </div>
                )}
            </header>

            <InfiniteScroll
                next={() => setSize(size + 1)}
                hasMore={!isReachingEnd}
                loader={loader(layout)}
                dataLength={items.length}
                style={{overflow: "visible"}}
                className={cn("gap-4 overflow-visible", layout === Layout.Grid ? "grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]" : "flex flex-col", classNames?.list)}
                scrollThreshold={0.9}
            >
                {items.map((item, idx) => (
                    <React.Fragment key={itemKey(item, idx)}>
                        {renderItem(item, layout, editMode)}
                    </React.Fragment>
                ))}
            </InfiniteScroll>
            {isEmpty && (
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-center text-2xl font-semibold text-tertiary-400">No results found</p>
                    <p className="text-center text-md text-muted-foreground text-tertiary-500">Try adjusting your search
                        criteria or filters.</p>
                </div>
            )}
        </section>
    );
}

export const ControlsDivider = () => {
    return (
        <div className="block h-6 w-px bg-tertiary-200 dark:bg-tertiary-700"/>
    );
}

export const LayoutSwitch = ({layout, setLayout}: {
    layout: Layout,
    setLayout: React.Dispatch<React.SetStateAction<Layout>>
}) => {
    const toggleLayout = useCallback(() => setLayout(layout === Layout.Grid ? Layout.List : Layout.Grid), [layout, setLayout]);

    return (
        <>
            <div className="block sm:hidden">
                <LayoutSwitchButton onClick={toggleLayout} isActive={true}>
                    <div
                        className={cn("items-center gap-1.5 pr-1", layout === Layout.Grid ? 'flex' : 'hidden')}>
                        <MdGridView className="size-5"/>
                        Grid
                    </div>
                    <div
                        className={cn("items-center gap-1.5 pr-1", layout === Layout.List ? 'flex' : 'hidden')}>
                        <MdOutlineViewAgenda className="size-5"/>
                        List
                    </div>
                </LayoutSwitchButton>
            </div>
            <div className="hidden sm:flex gap-2">
                <LayoutSwitchButton onClick={toggleLayout} isActive={layout === Layout.List}>
                    <MdOutlineViewAgenda className="size-5"/>
                </LayoutSwitchButton>
                <LayoutSwitchButton onClick={toggleLayout} isActive={layout === Layout.Grid}>
                    <MdGridView className="size-5"/>
                </LayoutSwitchButton>
            </div>
        </>
    )
}

const LayoutSwitchButton = ({onClick, isActive, children}: {
    onClick: () => void,
    isActive: boolean,
    children: React.ReactNode
}) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                `p-1.5 h-9 rounded-lg dark:active:border-tertiary-800 hover:bg-tertiary-100 active:bg-tertiary-200 dark:hover:bg-tertiary-900 dark:active:bg-tertiary-800 flex items-center border-2 justify-center transition-colors duration-300 ease-in-out`,
                isActive ? 'text-primary-500 border-primary-500' : 'text-tertiary-500 border-transparent'
            )}>
            {children}
        </button>
    )
}

export const Search = ({search, setSearch}: {
    search?: string,
    setSearch: React.Dispatch<React.SetStateAction<string>>
}) => {
    const [open, setOpen] = React.useState(Boolean(search));
    const [value, setValue] = React.useState(search ?? "");
    const debouncedValue = useDebouncedValue(value, SEARCH_DEBOUNCE_MS);

    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        setValue(search ?? "");
        if (search && search.length > 0) {
            setOpen(true);
        }
    }, [search]);

    useEffect(() => {
        setSearch(debouncedValue);
    }, [debouncedValue, setSearch]);

    const toggleOpen = () => {
        setOpen(prev => !prev);

        if (!open) {
            inputRef.current?.focus();
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
    }

    const clearValue = () => {
        setValue('');
        setSearch('');
    }

    return (
        <div
            className={cn(
                open && 'bg-tertiary-100 dark:bg-tertiary-900',
                "flex items-center rounded-lg transition-all duration-300 ease-in-out relative"
            )}>
            <div
                className={cn("absolute inset-0 flex border-primary-500 border-2 rounded-lg duration-300 ease-in-out pointer-events-none z-1", value.length > 0 ? "opacity-100" : "opacity-0")}/>
            <button onClick={toggleOpen}
                    className={cn(
                        "p-1 size-9 rounded-lg hover:bg-tertiary-100 active:bg-tertiary-200 dark:hover:bg-tertiary-900 dark:active:bg-tertiary-800 flex items-center justify-center transition-all duration-300 ease-in-out box-border border-2 border-transparent",
                        value.length > 0 ? "text-primary-500" : "text-tertiary-500 dark:hover:border-tertiary-900 dark:active:border-tertiary-800"
                    )}>
                <MdSearch className="size-5"/>
            </button>
            <input
                ref={inputRef}
                className={cn(
                    "bg-transparent outline-hidden ring-none transition-all duration-300 ease-in-out",
                    open ? "opacity-100 max-[400px]:w-24 max-w-32 sm:max-w-40" : "opacity-0 max-w-0"
                )}
                type="text"
                value={value}
                onChange={handleChange}
            />
            <button
                onClick={clearValue}
                disabled={value.length === 0}
                className={cn(
                    "rounded-lg enabled:hover:bg-tertiary-100 enabled:active:bg-tertiary-200 dark:enabled:hover:bg-tertiary-900 dark:enabled:active:bg-tertiary-800 flex items-center justify-center transition-all duration-300 ease-in-out z-0",
                    open ? "p-1 size-9" : "p-0 w-0",
                    value.length > 0 ? "text-primary-500 opacity-100" : "opacity-0 dark:hover:border-tertiary-900 dark:active:border-tertiary-800"
                )}
            >
                <MdClose className="size-5"/>
            </button>
        </div>
    );
};
