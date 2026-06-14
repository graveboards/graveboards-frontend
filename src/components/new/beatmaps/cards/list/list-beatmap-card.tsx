"use client";

import React, {FC} from "react";
import {MdChevronRight, MdPlayArrow} from "react-icons/md";
import {formatTime} from "@/utils/time-utils";
import clsx from "clsx";
import {Button} from "@/components/ui/button";
import {usePreview} from "@/context/preview-context";
import {BeatmapSnapshot} from "@/types/beatmap";
import {BeatmapSnapshotLink} from "@/components/new/beatmapsets/cards/beatmap-snapshots";
import {ColorUtils} from "@/utils/color-utils";
import RulesetIcon from "@/components/new/icons/rulesets";

interface ListBeatmapCardProps {
    beatmap: BeatmapSnapshot,
}

const ListBeatmapCard: FC<ListBeatmapCardProps> = ({beatmap}) => {
    const {setSrc} = usePreview();

    return (
        <div
            className="flex p-px rounded-xl"
            style={{
                backgroundColor: ColorUtils.forStarRating(beatmap.difficulty_rating),
            }}
        >
            <div className="flex rounded-xl overflow-hidden h-24 grow">
                <div
                    className="h-full flex items-center justify-center rounded-l-xl pr-8 -mr-8 w-14 transition-all duration-150 ease-in-out text-xs"
                    style={{
                        backgroundColor: ColorUtils.forStarRating(beatmap.difficulty_rating),
                        color: beatmap.difficulty_rating >= 6.5 ? "#fff" : "#000",
                    }}
                >
                    <RulesetIcon ruleset={beatmap.mode}/>
                </div>
                <div
                    className="flex-col p-2.5 justify-end gap-3 items-end hidden xl:flex rounded-l-xl h-full aspect-video bg-center bg-no-repeat bg-size-[215%]"
                    style={{backgroundImage: `url(${beatmap.beatmapset_snapshots[0].covers["cover"]})`}}>
                    <div className="flex gap-1.5">
                        <Button className="px-1.5 gap-1 h-6.5 font-semibold text-sm"
                                onClick={() => {
                                    setSrc(beatmap.beatmapset_snapshots[0].preview_url);
                                }}>
                            <MdPlayArrow className="size-4 shrink-0"/>
                            PREVIEW
                        </Button>
                        <div
                            className="bg-black bg-opacity-80 text-white rounded-lg p-1.5 leading-none text-sm overflow-hidden max-h-7 box-border">
                            {formatTime(beatmap.total_length)}
                        </div>
                    </div>
                </div>
                <div
                    className={clsx(
                        `bg-tertiary-50 dark:text-white dark:bg-tertiary-900 grid w-full items-center gap-8 px-4 relative tracking-wide rounded-xl xl:rounded-l-none xl:rounded-r-xl xl:grid-cols-4 lg:grid-cols-3 grid-cols-2`
                    )}>
                    <div className="truncate">
                        <a href={`https://osu.ppy.sh/beatmaps/${beatmap.beatmap_id}`}
                           className="text-sm font-semibold leading-5" target="_blank">
                            {beatmap.beatmapset_snapshots[0].title}
                        </a>
                        <div className="text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                            by {beatmap.beatmapset_snapshots[0].artist}
                        </div>
                        <div className="text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                            Hosted by <a href={`https://osu.ppy.sh/users/${beatmap.beatmapset_snapshots[0].user_id}`}
                                         className="font-semibold"
                                         target="_blank">{beatmap.beatmapset_snapshots[0].creator}</a>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-2 truncate min-w-0">
                        <div className="flex -space-x-6">
                            {beatmap.owner_profiles.slice(0, 5).map((profile, index) => (
                                <a
                                    key={index}
                                    href={`https://osu.ppy.sh/users/${profile.user_id}`}
                                    className="size-10 shrink-0 bg-tertiary-500 rounded-full bg-cover ring-tertiary-50 dark:ring-tertiary-900 ring-4"
                                    target="_blank"
                                    style={{backgroundImage: `url(${profile.avatar_url})`,}}
                                />
                            ))}
                        </div>

                        <div className="truncate min-w-0">
                            <div className="text-xs text-tertiary-500 dark:text-tertiary-400">
                                Mapped by
                            </div>
                            {beatmap.owner_profiles.length > 1 ? (
                                <div className="text-sm w-full truncate">
                                    <a key={beatmap.owner_profiles[0].user_id}
                                       href={`https://osu.ppy.sh/users/${beatmap.owner_profiles[0].user_id}`}
                                       className="font-semibold"
                                       target="_blank">{beatmap.owner_profiles[0].username}</a>
                                    {beatmap.owner_profiles.length > 2 ? ", " : " and "}
                                    <a
                                        key={beatmap.owner_profiles[1].user_id}
                                        href={`https://osu.ppy.sh/users/${beatmap.owner_profiles[1].user_id}`}
                                        className="text-sm font-semibold"
                                        target="_blank">{beatmap.owner_profiles[1].username}</a>
                                    {beatmap.owner_profiles.length > 2 && ` and ${beatmap.owner_profiles.length - 2} more`}
                                </div>
                            ) : (
                                <a href={`https://osu.ppy.sh/users/${beatmap.owner_profiles[0].user_id}`}
                                   className="text-sm font-semibold truncate block"
                                   target="_blank">{beatmap.owner_profiles[0].username}</a>
                            )}
                        </div>
                    </div>

                    <BeatmapSnapshotLink beatmap={beatmap}/>

                    <div className="hidden xl:flex gap-4 text-sm items-center justify-between p-2 px-4 bg-tertiary-100 dark:bg-tertiary-850 rounded-xl w-full max-w-72 justify-self-end">
                        <div className="flex flex-col items-center gap-1 w-full">
                            <div className="flex justify-between items-center gap-2 w-full">
                                <div>
                                    AR
                                </div>
                                <div className="font-semibold">
                                    {beatmap.ar % 1 === 0 ? beatmap.ar.toFixed(0) : beatmap.ar.toFixed(1)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-2 w-full">
                                <div>
                                    CS
                                </div>
                                <div className="font-semibold">
                                    {beatmap.cs % 1 === 0 ? beatmap.cs.toFixed(0) : beatmap.cs.toFixed(1)}
                                </div>
                            </div>
                        </div>
                        <div className="w-px rounded-full h-14 bg-tertiary-200 dark:bg-tertiary-800 shrink-0"/>
                        <div className="flex flex-col items-center gap-1 w-full">
                            <div className="flex justify-between items-center gap-2 w-full">
                                <div>
                                    OD
                                </div>
                                <div className="font-semibold">
                                    {beatmap.accuracy % 1 === 0 ? beatmap.accuracy.toFixed(0) : beatmap.accuracy.toFixed(1)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-2 w-full">
                                <div>
                                    HP
                                </div>
                                <div className="font-semibold">
                                    {beatmap.drain % 1 === 0 ? beatmap.drain.toFixed(0) : beatmap.drain.toFixed(1)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <a href={`https://osu.ppy.sh/beatmaps/${beatmap.beatmap_id}`}
                   target="_blank"
                   className="h-full flex items-center justify-center rounded-r-xl pl-8 -ml-8 hover:w-20 w-14 transition-all duration-150 ease-in-out"
                   style={{
                       backgroundColor: ColorUtils.forStarRating(beatmap.difficulty_rating),
                       color: beatmap.difficulty_rating >= 6.5 ? "#fff" : "#000",
                   }}
                >
                    <MdChevronRight className="size-6 shrink-0 justify-self-end"/>
                </a>
            </div>
        </div>

    );
};

export default ListBeatmapCard;
