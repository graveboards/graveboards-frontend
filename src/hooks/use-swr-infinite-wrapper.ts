//noinspection JSUnusedGlobalSymbols

import useSWRInfinite, {
    SWRInfiniteConfiguration,
    SWRInfiniteResponse,
} from "swr/infinite";
import qs from "qs";
import {fetcher} from "@/utils/fetcher";
import {EndpointDefinition, EndpointKey, EndpointSpecification} from "@/types/endpoints";

function deepMerge<T>(base?: T, override?: T): T | undefined {
    if (base == null) return override;
    if (override == null) return base;
    if (typeof base !== "object" || typeof override !== "object") return override;

    if (Array.isArray(base) || Array.isArray(override)) return override;

    const out: any = {...(base as any)};
    for (const [k, v] of Object.entries(override as any)) {
        const bv = (base as any)[k];
        out[k] =
            v &&
            bv &&
            typeof v === "object" &&
            typeof bv === "object" &&
            !Array.isArray(v) &&
            !Array.isArray(bv)
                ? deepMerge(bv, v)
                : v;
    }
    return out;
}

export type InfiniteParams<K extends EndpointKey> = {
    limit?: number;
    offset?: number;
    search?: string;
    sorting?: EndpointSpecification[K]["sorting"];
    filters?: EndpointSpecification[K]["filters"];
    include?: EndpointSpecification[K]["include"];
}

export function makeSWRInfiniteWrapper(apiUrl: string, fetcher: <T>(url: string) => Promise<T>) {
    return function useSWRInfiniteWrapper<K extends EndpointKey>(endpoint: EndpointDefinition<K>, params: InfiniteParams<K>, defaults?: InfiniteParams<K>, config?: SWRInfiniteConfiguration<EndpointSpecification[K]["page"]>): SWRInfiniteResponse<EndpointSpecification[K]["page"]> & {
        items: EndpointSpecification[K]["page"][number][];
        isEmpty: boolean;
        isReachingEnd: boolean
    } {
        const effectiveDefaults = deepMerge(defaults, endpoint.defaults) ?? {};

        const limit = params.limit ?? effectiveDefaults.limit ?? 10;
        const baseOffset = params.offset ?? effectiveDefaults.offset ?? 0;

        const sorting = deepMerge(params.sorting, effectiveDefaults.sorting);
        const filters = deepMerge(params.filters, effectiveDefaults.filters);
        const include = deepMerge(params.include, effectiveDefaults.include);

        const getKey = (pageIndex: number, previousPageData: EndpointSpecification[K]["page"] | null) => {
            if (previousPageData && previousPageData.length < limit) return null;

            const offset = baseOffset + pageIndex * limit;

            const query = qs.stringify(
                {
                    limit,
                    offset,
                    search: params.search && params.search?.length > 0 ? params.search : undefined,
                    sorting: sorting?.map((s) => JSON.stringify(s)),
                    filters,
                    include,
                },
                {
                    arrayFormat: "repeat",
                    encodeValuesOnly: true,
                }
            );

            return `${apiUrl}${endpoint.path}?${query}`;
        }

        const swr = useSWRInfinite<EndpointSpecification[K]["page"]>(
            getKey,
            (url: string) => fetcher<EndpointSpecification[K]["page"]>(url),
            config
        );

        const items = (swr.data ? swr.data.flat() : []) as EndpointSpecification[K]["page"][number][];
        const isEmpty = swr.data?.[0]?.length === 0;
        const isReachingEnd =
            isEmpty || Boolean(swr.data && swr.data[swr.data.length - 1]?.length < limit);

        return {
            ...swr,
            items,
            isEmpty: Boolean(isEmpty),
            isReachingEnd,
        };
    }
}

export const useAPIInfinite = makeSWRInfiniteWrapper(process.env.NEXT_PUBLIC_API_URL!, fetcher);