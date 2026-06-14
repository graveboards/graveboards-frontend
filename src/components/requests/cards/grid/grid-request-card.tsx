"use client";

import React, {FC, useMemo, useState} from "react";
import clsx from "clsx";
import {Request} from "@/types/request";
import {MdPlayArrow} from "react-icons/md";
import {ColorUtils} from "@/utils/color-utils";
import {formatTime} from "@/utils/time-utils";
import {Button} from "@/components/ui/button";
import RequestStatusBadge from "@/components/requests/request-status-badge";
import {usePreview} from "@/context/preview-context";
import Link from "next/link";
import RulesetIcon from "@/components/new/icons/rulesets";
import {GameMode} from "@/types/beatmapset";
import {BeatmapSnapshot} from "@/types/beatmap";
import {BeatmapSnapshots} from "@/components/new/beatmapsets/cards/beatmap-snapshots";

interface RequestPanelProps {
    request: Request,
    showQueue?: boolean;
}

const GridRequestCard: FC<RequestPanelProps> = ({request, showQueue = true}) => {
    const [hover, setHover] = useState(false);

    const {setSrc} = usePreview();

    const snapshotsByRuleset = useMemo(() => Object.entries(request.beatmapset_snapshot!.beatmap_snapshots.reduce((acc, snapshot) => {
        const ruleset = snapshot.mode;

        if (!acc[ruleset]) {
            acc[ruleset] = [];
        }

        acc[ruleset].push(snapshot);

        return acc;
    }, {} as Record<GameMode, BeatmapSnapshot[]>)), [request.beatmapset_snapshot])

    return (
        <div className="flex flex-col items-start shrink-0 rounded-xl overflow-hidden self-stretch min-w-72 h-70">
            <div
                className={clsx(
                    "relative flex flex-col items-end p-2.5 justify-end gap-3 grow shrink-0 basis-0 self-stretch transition-[filter] duration-300 ease-in-out bg-center bg-no-repeat bg-size-[215%] tracking-[0.25px]",
                    {"delay-300": hover}
                )}
                style={{backgroundImage: `url(${request.beatmapset_snapshot?.covers.cover})`}}>
                <div className="flex gap-1.5 z-10">
                    <Button className={clsx(
                        "px-1.5 gap-1 h-6.5 font-semibold text-sm transition-[opacity, max-height] box-border duration-300 ease-in-out",
                        {"opacity-0": hover}
                    )}
                            onClick={() => {
                                setSrc(request.beatmapset_snapshot?.preview_url);
                            }}>

                        <MdPlayArrow className="size-4 shrink-0"/>
                        PREVIEW
                    </Button>
                    <div
                        className={clsx(
                            "bg-black bg-opacity-80 text-white rounded-lg p-1.5 leading-none text-sm overflow-hidden transition-[opacity, max-height] box-border duration-300 ease-in-out",
                            {"opacity-0": hover}
                        )}>
                        {formatTime(request.beatmapset_snapshot?.beatmap_snapshots[0].total_length ?? 0)}
                    </div>
                </div>
                <div
                    className={clsx("absolute w-full h-full backdrop-blur-sm backdrop-brightness-75 -mb-2.5 -mr-2.5 duration-300", {"opacity-0": !hover})}></div>
            </div>
            <div
                className={clsx(`bg-tertiary-50 hover:bg-tertiary-100 dark:hover:bg-tertiary-800 dark:text-white dark:bg-tertiary-900 flex gap-3 p-2.5 self-stretch min-w-24 transition-colors duration-300 ease-in-out overflow-hidden relative tracking-wide`, {"rounded-b-xl": showQueue})}>
                <a href={`https://osu.ppy.sh/users/${request.beatmapset_snapshot?.user_profile.user_id}`}
                   className="size-10 bg-gray-500 rounded-full bg-cover" target="_blank"
                   style={{backgroundImage: `url(${request.beatmapset_snapshot?.user_profile.avatar_url})`}}></a>
                <div className="overflow-hidden flex-1 truncate">
                    <a href={`https://osu.ppy.sh/beatmapsets/${request.beatmapset_id}`}
                       className="text-sm font-semibold leading-5" target="_blank">
                        {request.beatmapset_snapshot?.title}
                    </a>
                    <div className="text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                        by {request.beatmapset_snapshot?.artist}
                    </div>
                    <div className="text-xs text-tertiary-500 dark:text-tertiary-400">
                        Hosted by <a href={`https://osu.ppy.sh/users/${request.beatmapset_snapshot?.user_id}`}
                                     className="font-semibold"
                                     target="_blank">{request.beatmapset_snapshot?.user_profile.username}</a>
                    </div>
                    <div onMouseEnter={() => setHover(true)}
                         onMouseLeave={() => setHover(false)}
                         className="flex flex-col mt-2 gap-0 transition-[gap] duration-300 delay-300 ease-out group hover:gap-2 hover:delay-0">
                        <div className="flex items-center gap-1 self-stretch">
                            <div className="flex items-center justify-center">
                                <RequestStatusBadge status={request.status}/>
                            </div>

                            {snapshotsByRuleset.length > 1 ?
                                snapshotsByRuleset.map(([ruleset, snapshots]) => (
                                    <div key={ruleset} className="flex items-center mr-1">
                                        <div className="text-sm shrink-0 text-tertiary-500 dark:text-tertiary-400">
                                            <RulesetIcon ruleset={ruleset as GameMode}/>
                                        </div>

                                        <div className="text-xs ml-1 text-tertiary-500 dark:text-tertiary-400">
                                            {snapshots.length}
                                        </div>
                                    </div>
                                )) :
                                snapshotsByRuleset.map(([ruleset, snapshots]) => (
                                    <React.Fragment key={ruleset}>
                                        <div className="text-sm shrink-0 text-tertiary-500 dark:text-tertiary-400">
                                            <RulesetIcon ruleset={ruleset as GameMode}/>
                                        </div>

                                        <div className="flex items-center gap-0.5">
                                            {snapshots
                                                .sort((a, b) => a.difficulty_rating - b.difficulty_rating)
                                                .slice(0, 14)
                                                .map((beatmap, index) => (
                                                    <div key={index} className="w-1.5 h-4 bg-gray-500 rounded-full"
                                                         style={{backgroundColor: ColorUtils.forStarRating(beatmap.difficulty_rating)}}></div>
                                                ))
                                            }

                                            {snapshots.length > 14 && (
                                                <div className="text-xs ml-1 text-tertiary-500 dark:text-tertiary-400">
                                                    +{snapshots.length - 14}
                                                </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))
                            }
                        </div>

                        <div
                            className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-in-out group-hover:grid-rows-[1fr] group-hover:delay-300">
                            <div className="overflow-hidden grid-rows-[1fr]">
                                <BeatmapSnapshots snapshots={request.beatmapset_snapshot!.beatmap_snapshots}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Link
                href={`/queues/${request.queue_id}`}
                className="bg-tertiary-100 dark:bg-tertiary-800 w-full flex items-center justify-center text-tertiary-500 h-10 -mt-4 pt-4 text-sm">
                {request.queue?.name}
            </Link>
        </div>
    );
}

export default GridRequestCard;
