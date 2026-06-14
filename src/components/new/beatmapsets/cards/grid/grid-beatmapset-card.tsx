"use client";

import {FC, useState} from "react";
import clsx from "clsx";
import {BeatmapsetSnapshot} from "@/types/beatmapset";
import {MdPlayArrow} from "react-icons/md";
import {formatTime} from "@/utils/time-utils";
import {Button} from "@/components/ui/button";
import {usePreview} from "@/context/preview-context";
import {cn} from "@/lib/utils";
import {GridBeatmapsetCardDetails} from "@/components/new/beatmapsets/cards/grid/grid-beatmapset-card-details";

interface GridBeatmapsetCardProps {
    beatmapset: BeatmapsetSnapshot,
}

const GridBeatmapsetCard: FC<GridBeatmapsetCardProps> = ({beatmapset}) => {
    const [hover, setHover] = useState(false);

    const {setSrc} = usePreview();

    return (
        <div className="flex flex-col items-start shrink-0 rounded-xl overflow-hidden self-stretch min-w-72 h-64">
            <div
                className={clsx("relative flex flex-col items-end p-2.5 justify-end gap-3 grow shrink-0 basis-0 self-stretch transition-[filter] duration-300 ease-in-out bg-center bg-no-repeat bg-size-[215%] tracking-[0.25px]", {"delay-300": hover})}
                style={{backgroundImage: `url(${beatmapset.covers["cover"]})`}}>
                <div
                    className={cn("flex gap-1.5 transition-opacity duration-300 ease-in-out delay-300 z-10", hover && "opacity-0 delay-0")}>
                    <Button
                        onClick={() => setSrc(beatmapset.preview_url)}
                        className="px-1.5 gap-1 h-6.5 font-semibold text-sm box-border"
                    >
                        <MdPlayArrow className="size-4 shrink-0"/>
                        PREVIEW
                    </Button>
                    <div
                        className="bg-black bg-opacity-80 text-white rounded-lg p-1.5 leading-none text-sm overflow-hidden transition-max-height box-border duration-300 ease-in-out">
                        {formatTime(beatmapset.beatmap_snapshots[0]?.total_length ?? 0)}
                    </div>
                </div>
                <div
                    className={clsx("absolute w-full h-full backdrop-blur-sm backdrop-brightness-75 -mb-2.5 -mr-2.5 duration-300 delay-300 z-0", !hover && "opacity-0 delay-0")}/>
            </div>
            <div
                className="bg-tertiary-50 hover:bg-tertiary-100 dark:hover:bg-tertiary-800 dark:text-white dark:bg-tertiary-900 flex gap-3 p-2.5 self-stretch min-w-24 transition-colors duration-300 ease-in-out overflow-hidden relative tracking-wide">
                <a href={`https://osu.ppy.sh/users/${beatmapset.user_id}`}
                   className="size-10 bg-gray-500 rounded-full bg-cover" target="_blank"
                   style={{backgroundImage: `url(${beatmapset.user_profile.avatar_url})`}}></a>
                <div className="overflow-hidden flex-1 truncate">
                    <a href={`https://osu.ppy.sh/beatmapsets/${beatmapset.beatmapset_id}`}
                       className="text-sm font-semibold leading-5" target="_blank">
                        {beatmapset.title}
                    </a>
                    <div className="text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                        by {beatmapset.artist}
                    </div>
                    <div className="text-xs text-tertiary-500 dark:text-tertiary-400">
                        Hosted by <a href={`https://osu.ppy.sh/users/${beatmapset.user_id}`}
                                     className="font-semibold"
                                     target="_blank">{beatmapset.creator}</a>
                    </div>
                    <GridBeatmapsetCardDetails
                        beatmapset={beatmapset}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default GridBeatmapsetCard;
