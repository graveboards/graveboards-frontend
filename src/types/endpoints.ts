import {User} from "@/types/user";
import {
    BeatmapsetSnapshotSorting,
    BeatmapsetSorting,
    BeatmapSnapshotSorting,
    BeatmapSorting, QueueSorting, RequestSorting,
    UserSorting
} from "@/types/sorting";
import {
    BeatmapFilter,
    BeatmapsetFilter,
    BeatmapsetSnapshotFilter,
    BeatmapSnapshotFilter, QueueFilter, RequestFilter,
    UserFilter
} from "@/types/filter";
import {
    BeatmapInclude,
    BeatmapsetInclude,
    BeatmapsetSnapshotInclude,
    BeatmapSnapshotInclude, QueueInclude, RequestInclude,
    UserInclude
} from "@/types/include/include";
import {Beatmapset, BeatmapsetSnapshot} from "@/types/beatmapset";
import {Beatmap, BeatmapSnapshot} from "@/types/beatmap";
import {Queue} from "@/types/queue";
import {InfiniteParams} from "@/hooks/use-swr-infinite-wrapper";
import {Request} from "@/types/request";
import {
    DefaultBeatmapListingsInclude,
    DefaultBeatmapsetSnapshotInclude,
    DefaultQueueInclude,
    DefaultRequestInclude
} from "@/types/include/defaults";

export type EndpointSpecification = {
    Users: {
        path: "/users";
        page: User[];
        sorting: UserSorting;
        filters: UserFilter;
        include: UserInclude;
    };

    Beatmapsets: {
        path: "/beatmapsets";
        page: Beatmapset[];
        sorting: BeatmapsetSorting;
        filters: BeatmapsetFilter;
        include: BeatmapsetInclude;
    };

    Beatmaps: {
        path: "/beatmaps";
        page: Beatmap[];
        sorting: BeatmapSorting;
        filters: BeatmapFilter;
        include: BeatmapInclude;
    };

    BeatmapsetListings: {
        path: "/beatmapsets/listings";
        page: BeatmapsetSnapshot[];
        sorting: BeatmapsetSnapshotSorting;
        filters: BeatmapsetSnapshotFilter;
        include: BeatmapsetSnapshotInclude;
    };

    BeatmapListings: {
        path: "/beatmaps/listings";
        page: BeatmapSnapshot[];
        sorting: BeatmapSnapshotSorting;
        filters: BeatmapSnapshotFilter;
        include: BeatmapSnapshotInclude;
    };

    /*Scores: {
        path: "/scores";
        page: Score[];
        sorting: ScoreSorting;
        filters: ScoreFilter;
        include: ScoreInclude;
    };*/

    Queues: {
        path: "/queues";
        page: Queue[];
        sorting: QueueSorting;
        filters: QueueFilter;
        include: QueueInclude;
    };

    Requests: {
        path: "/requests";
        page: Request[];
        sorting: RequestSorting;
        filters: RequestFilter;
        include: RequestInclude;
    };
};

export type EndpointKey = keyof EndpointSpecification;

export type EndpointDefaults<K extends EndpointKey> = Partial<InfiniteParams<K>>;

export type EndpointDefinition<K extends EndpointKey> = {
    key: K;
    path: EndpointSpecification[K]["path"];
    defaults?: EndpointDefaults<K>;
}

export const defineEndpoint = <K extends EndpointKey>(key: K, path: EndpointSpecification[K]["path"], defaults?: EndpointDefaults<K>) => ({
    key,
    path,
    defaults
} as const);


export const UsersEndpoint = defineEndpoint("Users", "/users");
export const BeatmapsetsEndpoint = defineEndpoint("Beatmapsets", "/beatmapsets");
export const BeatmapsEndpoint = defineEndpoint("Beatmaps", "/beatmaps");
export const BeatmapsetListingsEndpoint = defineEndpoint("BeatmapsetListings", "/beatmapsets/listings", { include: DefaultBeatmapsetSnapshotInclude});
export const BeatmapListingsEndpoint = defineEndpoint("BeatmapListings", "/beatmaps/listings", { include: DefaultBeatmapListingsInclude});
export const QueuesEndpoint = defineEndpoint("Queues", "/queues", {include: DefaultQueueInclude});
export const RequestsEndpoint = defineEndpoint("Requests", "/requests", {include: DefaultRequestInclude});
/*export const ScoresEndpoint = defineEndpoint("Scores", "/scores");*/

