import type { Metadata } from 'next';
import BeatmapsetListings from "@/components/new/beatmapset-listings";
import {BeatmapsetSnapshotSortingEnum, Order} from "@/types/sorting";

export const metadata: Metadata = {
    title: 'Home | Graveboards',
};

const Home = () => {
    return (
        <div className="flex flex-col gap-6">
            <BeatmapsetListings
                title="Latest Beatmapsets"
                defaultSorting={[
                    {
                        field: BeatmapsetSnapshotSortingEnum.LastUpdated,
                        order: Order.Descending,
                    }
                ]}
                showSorting={false}
                showFilters={false}
                showSearch={false}
            />
        </div>
    );
};

export default Home;
