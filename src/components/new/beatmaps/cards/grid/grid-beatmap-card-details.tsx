import {FC} from "react";
import {BeatmapSnapshotLink} from "@/components/new/beatmapsets/cards/beatmap-snapshots";
import {BeatmapSnapshot} from "@/types/beatmap";
import React from "react";

interface BeatmapDetailsProps {
    beatmap: BeatmapSnapshot;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const GridBeatmapCardDetails: FC<BeatmapDetailsProps> = ({
                                                                       beatmap,
                                                                       onMouseEnter,
                                                                       onMouseLeave
                                                                   }) => {
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="flex flex-col mt-2 gap-0 transition-[gap] duration-300 delay-300 ease-out group hover:gap-2 hover:delay-0"
        >
            <div className="flex items-center gap-1 self-stretch">
                <BeatmapSnapshotLink beatmap={beatmap}/>
            </div>
        </div>
    )
}