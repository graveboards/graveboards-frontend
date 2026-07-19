import type { Metadata } from 'next';
import {BeatmapSnapshotSortingEnum, Order} from "@/types/sorting";
import BeatmapListings from "@/components/new/beatmap-listings";
import PageContent from "@/components/new/layout/page-content";

export const metadata: Metadata = {
    title: 'Home | Graveboards',
};

const Home = () => {
    return (
        <PageContent>
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
        </PageContent>
    );
};

export default Home;
