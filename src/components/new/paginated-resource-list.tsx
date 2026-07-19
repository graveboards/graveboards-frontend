import React, {ComponentProps} from 'react';
import {InfiniteParams, useAPIInfinite} from "@/hooks/use-swr-infinite-wrapper";
import {cn} from "@/lib/utils";
import {EndpointDefinition, EndpointKey, EndpointSpecification} from "@/types/endpoints";
import {ControlsDivider, Layout, LayoutSwitch, Search} from "@/components/new/infinite-resource-list";
import {Button} from "@/components/ui/button";

type ItemOf<K extends EndpointKey> = EndpointSpecification[K]["page"][number];

type Props<K extends EndpointKey> = {
    title: string;
    id: string;

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

export function PaginatedResourceList<K extends EndpointKey>({
                                                                 title,
                                                                 endpoint,
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

    const [layout, setLayout] = React.useState<Layout>(editMode ? Layout.List : Layout.Grid);
    const [search, setSearch] = React.useState('');
    const [filters] = React.useState(params.filters);

    const {items, error, isEmpty, size, setSize, isLoading} = useAPIInfinite(
        endpoint,
        {
            ...params,
            search,
            filters,
        },
        defaults
    );

    if (error) {
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

            <div id="scrollable-div">
                <div
                    className={cn("gap-4 overflow-visible", layout === Layout.Grid ? "grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]" : "flex flex-col", classNames?.list)}
                >
                    {isLoading ? (
                        loader(layout)
                    ) : (
                        items.map((item, idx) => (
                            <React.Fragment key={itemKey(item, idx)}>
                                {renderItem(item, layout, editMode)}
                            </React.Fragment>
                        ))
                    )}
                </div>
                {isEmpty && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-center text-2xl font-semibold text-tertiary-400">No results found</p>
                        <p className="text-center text-md text-muted-foreground text-tertiary-500">Try adjusting your
                            search criteria or filters.</p>
                    </div>
                )}
                <div>
                    {items.length}
                    <Button onClick={() => setSize(size - 1)}>previous</Button>
                    <Button onClick={() => setSize(size + 1)}>next</Button>
                </div>
            </div>
        </section>
    );
}
