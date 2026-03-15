'use client'

import { useAuth } from "@/context/auth-context";
import React from "react";
import {BeatmapsetSnapshotSortingEnum, Order} from "@/types/sorting";
import BeatmapsetListings from "@/components/new/beatmapset-listings";

const ManageRequestsContent = () => {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="flex flex-col gap-6">
            <BeatmapsetListings
                title="Unverified Beatmapsets"
                defaultSorting={[
                    {
                        field: BeatmapsetSnapshotSortingEnum.LastUpdated,
                        order: Order.Descending,
                    }
                ]}
                editMode={true}
            />
        </div>
    );
};

export default ManageRequestsContent;
