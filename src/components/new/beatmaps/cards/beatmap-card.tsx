'use client'

import {FC} from "react";
import ListBeatmapCard from "@/components/new/beatmaps/cards/list/list-beatmap-card";
import GridBeatmapCard from "@/components/new/beatmaps/cards/grid/grid-beatmap-card";
import {BeatmapSnapshot} from "@/types/beatmap";

interface BeatmapCardProps {
    beatmap: BeatmapSnapshot;
    view?: "list" | "grid";
}

const BeatmapCard: FC<BeatmapCardProps> = ({beatmap, view = "grid"}) => {
    return view === "grid" ? (
        <GridBeatmapCard beatmap={beatmap}/>
    ) : (
        <ListBeatmapCard beatmap={beatmap}/>
    );
}

export default BeatmapCard;
