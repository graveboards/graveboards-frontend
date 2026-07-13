import {SearchSorting} from "@/types/sorting";
import {SearchFilters} from "@/types/filter";

export type SearchQuery = {
    scope: SearchQueryScope;
    search_terms?: SearchQueryTerm;
    sorting?: SearchSorting;
    filters?: SearchFilters;
    search_mode?: SearchQueryMode;
}

export type SearchResource = {
    message: string;
    q: string;
}

export type SearchQueryScope = "beatmaps" | "beatmapsets" | "queues" | "requests";

export type SearchQueryMode = "simple" | "engine";

export type SearchQueryTerm = {
    terms?: string | string[];
    case_sensitive?: boolean;
    pattern_multipliers?: {
        exact?: number;
        prefix?: number;
        suffix?: number;
        substring?: number;
    };
    field_weights?: {
        beatmap?: BeatmapFieldWeights;
        beatmapset?: BeatmapsetFieldWeights;
        queue?: QueueFieldWeights;
        request?: RequestFieldWeights;
    };
}

type BeatmapFieldWeights = {
    version?: number;
};

type BeatmapsetFieldWeights = {
    title?: number;
    title_unicode?: number;
    artist?: number;
    artist_unicode?: number;
    creator?: number;
    source?: number;
    tags?: number;
    description?: number;
};

type QueueFieldWeights = {
    name?: number;
    description?: number;
};

type RequestFieldWeights = {
    comment?: number;
}