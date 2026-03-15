'use client'

import {FC} from "react";
import {BeatmapsetSnapshot} from "@/types/beatmapset";
import GridBeatmapsetCard from "@/components/beatmapsets/cards/grid/grid-beatmapset-card";
import ListBeatmapsetCard from "@/components/beatmapsets/cards/list/list-beatmapset-card";

interface BeatmapsetProps {
    beatmapset: BeatmapsetSnapshot;
    view?: "list" | "grid";
    editMode?: boolean;
}

const BeatmapsetCard: FC<BeatmapsetProps> = ({beatmapset, view = "grid", editMode = false}) => {
    return view === "grid" ? (
        <GridBeatmapsetCard beatmapset={beatmapset}/>
    ) : (
        <ListBeatmapsetCard beatmapset={beatmapset} editMode={editMode}/>
    );
}

export default BeatmapsetCard;
