import type { Metadata } from 'next';
import {BeatmapSnapshotSortingEnum, Order} from "@/types/sorting";
import BeatmapListings from "@/components/new/beatmap-listings";

export const metadata: Metadata = {
    title: 'Home | Graveboards',
};

const Home = () => {
    return (
        <div className="flex flex-col gap-6">
            <BeatmapListings
                title="Latest Beatmaps"
                defaultSorting={[
                    {
                        field: BeatmapSnapshotSortingEnum.LastUpdated,
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
