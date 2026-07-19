"use client";

import {FC} from "react";
import clsx from "clsx";
import {MdPlayArrow} from "react-icons/md";
import {formatTime} from "@/utils/time-utils";
import {Button} from "@/components/ui/button";
import {useBeatmapPreview} from "@/context/preview-context";
import {cn} from "@/lib/utils";
import {BeatmapSnapshot} from "@/types/beatmap";
import {GridBeatmapCardDetails} from "@/components/new/beatmaps/cards/grid/grid-beatmap-card-details";
import {createBeatmapPreviewSelection} from "@/lib/beatmap-preview-selection";

interface GridBeatmapCardProps {
    beatmap: BeatmapSnapshot,
}

const GridBeatmapCard: FC<GridBeatmapCardProps> = ({beatmap}) => {
    const {selectBeatmap} = useBeatmapPreview();

    return (
        <div className="flex min-w-0 flex-col items-start shrink-0 rounded-xl overflow-hidden self-stretch h-64">
            <div
                className={clsx("relative flex flex-col items-end p-2.5 justify-end gap-3 grow shrink-0 basis-0 self-stretch transition-[filter] duration-300 ease-in-out bg-tertiary-800 dark:bg-tertiary-950 bg-center bg-no-repeat bg-size-[215%] tracking-[0.25px]")}
                style={{backgroundImage: `url(${beatmap.beatmapset_snapshots[0].covers["cover"]})`}}>
                <div
                    className={cn("flex gap-1.5 transition-opacity duration-300 ease-in-out delay-300 z-10")}>
                    <Button
                        onClick={() => selectBeatmap(createBeatmapPreviewSelection(
                            beatmap,
                            beatmap.beatmapset_snapshots[0],
                        ))}
                        className="px-1.5 gap-1 h-6.5 font-semibold text-sm box-border"
                    >
                        <MdPlayArrow className="size-4 shrink-0"/>
                        PREVIEW
                    </Button>
                    <div
                        className="bg-black bg-opacity-80 text-white rounded-lg p-1.5 leading-none text-sm overflow-hidden transition-max-height box-border duration-300 ease-in-out">
                        {formatTime(beatmap.total_length)}
                    </div>
                </div>
            </div>
            <div
                className="bg-tertiary-50 hover:bg-tertiary-100 dark:hover:bg-tertiary-800 dark:text-white dark:bg-tertiary-900 flex gap-3 p-2.5 self-stretch min-w-24 transition-colors duration-300 ease-in-out overflow-hidden relative tracking-wide">
                <a href={`https://osu.ppy.sh/users/${beatmap.beatmapset_snapshots[0].user_id}`}
                   className="size-10 bg-gray-500 rounded-full bg-cover" target="_blank"
                   style={{backgroundImage: `url(${beatmap.beatmapset_snapshots[0].user_profile.avatar_url})`}}></a>
                <div className="overflow-hidden flex-1 truncate">
                    <a href={`https://osu.ppy.sh/beatmapsets/${beatmap.beatmapset_snapshots[0].beatmapset_id}`}
                       className="text-sm font-semibold leading-5" target="_blank">
                        {beatmap.beatmapset_snapshots[0].title}
                    </a>
                    <div className="text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                        by {beatmap.beatmapset_snapshots[0].artist}
                    </div>
                    <div className="text-xs text-tertiary-500 dark:text-tertiary-400">
                        Hosted by <a href={`https://osu.ppy.sh/users/${beatmap.beatmapset_snapshots[0].user_id}`}
                                     className="font-semibold"
                                     target="_blank">{beatmap.beatmapset_snapshots[0].creator}</a>
                    </div>
                    <GridBeatmapCardDetails beatmap={beatmap}/>
                </div>
            </div>
        </div>
    );
};

export default GridBeatmapCard;
