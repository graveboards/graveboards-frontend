import {FC, useMemo} from "react";
import {useAuth} from "@/context/auth-context";
import BeatmapsetStatusBadge from "@/components/beatmapsets/beatmapset-status-badge";
import {ColorUtils} from "@/utils/color-utils";
import {BeatmapSnapshots} from "@/components/beatmapsets/cards/beatmap-snapshots";
import {BeatmapsetSnapshot, GameMode} from "@/types/beatmapset";
import {BeatmapSnapshot} from "@/types/beatmap";
import RulesetIcon from "@/components/icons/rulesets";
import React from "react";

interface BeatmapsetDetailsProps {
    beatmapset: BeatmapsetSnapshot;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const GridBeatmapsetCardDetails: FC<BeatmapsetDetailsProps> = ({
                                                                          beatmapset,
                                                                          onMouseEnter,
                                                                          onMouseLeave
                                                                      }) => {
    const {isAdmin} = useAuth();

    const snapshotsByRuleset = useMemo(() => Object.entries(beatmapset.beatmap_snapshots.reduce((acc, snapshot) => {
        const ruleset = snapshot.mode;

        if (!acc[ruleset]) {
            acc[ruleset] = [];
        }

        acc[ruleset].push(snapshot);

        return acc;
    }, {} as Record<GameMode, BeatmapSnapshot[]>)), [beatmapset.beatmap_snapshots])

    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="flex flex-col mt-2 gap-0 transition-[gap] duration-300 delay-300 ease-out group hover:gap-2 hover:delay-0"
        >
            <div className="flex items-center gap-1 self-stretch">
                {isAdmin && (
                    <div className="flex items-center justify-center">
                        <BeatmapsetStatusBadge
                            status={beatmapset.verified ? "verified" : "unverified"}/>
                    </div>
                )}


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
                                    .slice(0, 14)
                                    .map((beatmap, index) => (
                                        <div key={index} className="w-1.5 h-4 bg-gray-500 rounded-full"
                                             style={{backgroundColor: ColorUtils.forStarRating(beatmap.difficulty_rating)}}></div>
                                    ))
                                }

                                {beatmapset.beatmap_snapshots.length > 14 && (
                                    <div className="text-xs ml-1 text-tertiary-500 dark:text-tertiary-400">
                                        +{beatmapset.beatmap_snapshots.length - 14}
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
                    <BeatmapSnapshots snapshots={beatmapset.beatmap_snapshots}/>
                </div>
            </div>
        </div>
    )
}