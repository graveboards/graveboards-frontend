import {FC} from "react";
import {ColorUtils} from "@/utils/color-utils";
import {BeatmapSnapshot} from "@/types/beatmap";
import RulesetIcon from "@/components/new/icons/rulesets";

interface BeatmapSnapshotsProps {
    snapshots: BeatmapSnapshot[];
}

export const BeatmapSnapshots: FC<BeatmapSnapshotsProps> = ({snapshots}) => {
    return (
        <div className="flex flex-col gap-1 overflow-y-scroll snap-y max-h-24">
            {snapshots
                .sort((a, b) => b.difficulty_rating - a.difficulty_rating)
                .map((beatmap, index) => (
                    <BeatmapSnapshotLink key={index} beatmap={beatmap}/>
                ))}
        </div>
    )
};

export const BeatmapSnapshotLink = ({beatmap}: { beatmap: BeatmapSnapshot }) => {
    return (
        <div className="snap-start flex items-center gap-1 flex-1 shrink-0 overflow-x-hidden text-xs">
            <div className="text-sm shrink-0 text-tertiary-500 dark:text-tertiary-400">
                <RulesetIcon ruleset={beatmap.mode}/>
            </div>
            <div
                className="px-2 rounded-full font-semibold whitespace-nowrap select-none"
                style={{
                    backgroundColor: ColorUtils.forStarRating(beatmap.difficulty_rating),
                    color: beatmap.difficulty_rating >= 6.5 ? "#fff" : "#000"
                }}
            >
                ★ {beatmap.difficulty_rating.toFixed(2)}
            </div>
            <a href={`https://osu.ppy.sh/beatmaps/${beatmap.beatmap_id}`}
               className="truncate hover:underline">
                {beatmap.version}
            </a>
        </div>
    )
}
