"use client";

import React, {FC, useMemo} from "react";
import {BeatmapsetSnapshot, GameMode} from "@/types/beatmapset";
import {MdChevronRight, MdPlayArrow} from "react-icons/md";
import {ColorUtils} from "@/utils/color-utils";
import {formatTime} from "@/utils/time-utils";
import clsx from "clsx";
import {useAuth} from "@/context/auth-context";
import BeatmapsetStatusBadge from "@/components/beatmapsets/beatmapset-status-badge";
import {Button} from "@/components/ui/button";
import {usePreview} from "@/context/preview-context";
import SelectBeatmapsetStatus from "@/components/requests/manage/select-beatmapset-status";
import {BeatmapSnapshot} from "@/types/beatmap";
import RulesetIcon from "@/components/icons/rulesets";

interface BeatmapsetProps {
    beatmapset: BeatmapsetSnapshot,
    editMode?: boolean
}

const ListBeatmapsetCard: FC<BeatmapsetProps> = ({beatmapset, editMode = false}) => {
    const {isAdmin} = useAuth();

    const {setSrc} = usePreview();

    const snapshotsByRuleset = useMemo(() => Object.entries(beatmapset.beatmap_snapshots.reduce((acc, snapshot) => {
        const ruleset = snapshot.mode;

        if (!acc[ruleset]) {
            acc[ruleset] = [];
        }

        acc[ruleset].push(snapshot);

        return acc;
    }, {} as Record<GameMode, BeatmapSnapshot[]>)), [beatmapset.beatmap_snapshots]);

    return (
        <div className="flex rounded-xl overflow-hidden h-24">
            <div
                className="flex-col p-2.5 justify-end gap-3 items-end hidden xl:flex rounded-l-xl h-full aspect-video bg-center bg-no-repeat bg-[size:215%]"
                style={{backgroundImage: `url(${beatmapset.covers["cover"]})`}}>
                <div className="flex gap-1.5">
                    <Button className="px-1.5 gap-1 h-8.5 font-semibold text-sm"
                            onClick={() => {
                                setSrc(beatmapset.preview_url);
                            }}>
                        <MdPlayArrow className="size-4 shrink-0"/>
                        PREVIEW
                    </Button>
                    <div
                        className="bg-black bg-opacity-80 text-white rounded-lg p-1.5 leading-none text-sm overflow-hidden max-h-7 box-border">
                        {formatTime(beatmapset.beatmap_snapshots[0].total_length)}
                    </div>
                </div>
            </div>
            <div
                className={clsx(
                    `bg-tertiary-50 dark:text-white dark:bg-tertiary-900 grid w-full items-center gap-8 px-4 relative tracking-wide rounded-xl xl:rounded-l-none xl:rounded-r-xl`,
                    isAdmin ? "lg:grid-cols-4 sm:grid-cols-3 grid-cols-2" : "lg:grid-cols-3 grid-cols-2"
                )}>
                <div className="truncate">
                    <a href={`https://osu.ppy.sh/beatmapsets/${beatmapset.beatmapset_id}`}
                       className="text-sm font-semibold leading-5" target="_blank">
                        {beatmapset.title}
                    </a>
                    <div className="text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                        by {beatmapset.artist}
                    </div>
                    <div className="block lg:hidden text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                        Mapped by <a href={`https://osu.ppy.sh/users/${beatmapset.user_id}`}
                                     className="font-semibold"
                                     target="_blank">{beatmapset.creator}</a>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 truncate">
                    <a href={`https://osu.ppy.sh/users/${beatmapset.user_id}`}
                       className="size-10 shrink-0 bg-gray-500 rounded-full bg-cover" target="_blank"
                       style={{backgroundImage: `url(${beatmapset.user_profile.avatar_url})`}}></a>
                    <div className="flex flex-col">
                        <div className="text-xs text-tertiary-500 dark:text-tertiary-400">
                            Mapped by
                        </div>
                        <a href={`https://osu.ppy.sh/users/${beatmapset.user_id}`}
                           className="text-sm font-semibold"
                           target="_blank">{beatmapset.creator}</a>
                    </div>
                </div>

                <div
                    className="flex flex-col gap-0 transition-[gap] duration-300 delay-300 ease-out group hover:gap-2 hover:delay-0">
                    <div className="flex items-center gap-1 self-stretch">
                        {snapshotsByRuleset.length > 1 ?
                            snapshotsByRuleset.map(([ruleset, snapshots]) => (
                                <React.Fragment key={ruleset}>
                                    <div className="text-sm shrink-0 text-tertiary-500 dark:text-tertiary-400">
                                        <RulesetIcon ruleset={ruleset as GameMode}/>
                                    </div>

                                    <div className="text-xs ml-1 text-tertiary-500 dark:text-tertiary-400">
                                        {snapshots.length}
                                    </div>
                                </React.Fragment>
                            )) :
                            snapshotsByRuleset.map(([ruleset, snapshots]) => (
                                <React.Fragment key={ruleset}>
                                    <div className="text-sm shrink-0 text-tertiary-500 dark:text-tertiary-400">
                                        <RulesetIcon ruleset={ruleset as GameMode}/>
                                    </div>

                                    <div className="flex items-center gap-0.5">
                                        {snapshots
                                            .sort((a, b) => a.difficulty_rating - b.difficulty_rating)
                                            .slice(0, 6)
                                            .map((beatmap, index) => (
                                                <div key={index} className="w-1.5 h-4 bg-gray-500 rounded-full"
                                                     style={{backgroundColor: ColorUtils.forStarRating(beatmap.difficulty_rating)}}></div>
                                            ))
                                        }

                                        {snapshots.length > 6 && (
                                            <div className="text-xs ml-1 text-tertiary-500 dark:text-tertiary-400">
                                                +{snapshots.length - 6}
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>

                {isAdmin && (
                    editMode ? (
                        <div className="sm:flex items-center justify-center hidden">
                            <SelectBeatmapsetStatus
                                disabled={true}
                                initialStatus={beatmapset.verified ? "verified" : "unverified"}/>
                        </div>
                    ) : (
                        isAdmin && (
                            <div className="sm:flex items-center justify-center hidden">
                                <BeatmapsetStatusBadge
                                    status={beatmapset.verified ? "verified" : "unverified"}/>
                            </div>
                        )
                    )
                )}
            </div>

            <a href={`https://osu.ppy.sh/beatmapsets/${beatmapset.beatmapset_id}`}
               target="_blank"
               className="h-full flex items-center justify-center rounded-r-xl bg-tertiary-100 hover:bg-tertiary-200 active:bg-tertiary-300 dark:bg-tertiary-800 hover:dark:bg-tertiary-700 active:dark:bg-tertiary-600 pl-8 -ml-8 hover:w-20 w-14 transition-all duration-150 ease-in-out">
                <MdChevronRight className="size-6 shrink-0 text-tertiary-500 justify-self-end"/>
            </a>
        </div>
    );
};

export default ListBeatmapsetCard;
