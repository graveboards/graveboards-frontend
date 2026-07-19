"use client";

import {Select as SelectPrimitive} from "radix-ui";
import {MdCheck, MdKeyboardArrowDown} from "react-icons/md";
import type {BeatmapPreviewDifficulty} from "@/types/beatmap-preview";
import {ColorUtils} from "@/utils/color-utils";
import {cn} from "@/lib/utils";

interface PreviewPlayerDifficultySelectProps {
    difficulties: BeatmapPreviewDifficulty[];
    selected: BeatmapPreviewDifficulty;
    disabled?: boolean;
    onSelect: (difficulty: BeatmapPreviewDifficulty) => void;
}

const difficultyValue = (difficulty: BeatmapPreviewDifficulty) => (
    `${difficulty.beatmapId}:${difficulty.snapshotNumber}`
);

const DifficultyLabel = ({
    difficulty,
    constrainVersion = false,
}: {
    difficulty: BeatmapPreviewDifficulty;
    constrainVersion?: boolean;
}) => (
    <span className="flex min-w-0 items-center gap-2">
        <div
            className="px-2 py-0.5 rounded-full font-semibold whitespace-nowrap select-none text-xs"
            style={{
                backgroundColor: ColorUtils.forStarRating(difficulty.difficultyRating),
                color: difficulty.difficultyRating >= 6.5 ? "#fff" : "#000"
            }}
        >
                ★ {difficulty.difficultyRating.toFixed(2)}
            </div>
        <span className={cn(
            "truncate font-semibold text-tertiary-900 dark:text-white",
            constrainVersion && "max-w-24",
        )}>
            {difficulty.version}
        </span>
    </span>
);

const PreviewPlayerDifficultySelect = ({
    difficulties,
    selected,
    disabled = false,
    onSelect,
}: PreviewPlayerDifficultySelectProps) => {
    const selectedValue = difficultyValue(selected);

    return (
        <SelectPrimitive.Root
            value={selectedValue}
            disabled={disabled}
            onValueChange={(value) => {
                const difficulty = difficulties.find((item) => difficultyValue(item) === value);

                if (difficulty) {
                    onSelect(difficulty);
                }
            }}
        >
            <SelectPrimitive.Trigger
                aria-label={`Select difficulty. Current difficulty: ${selected.version}, ${selected.difficultyRating.toFixed(2)} stars`}
                className="group flex h-10 max-w-52 shrink-0 items-center justify-center gap-2.5 rounded-lg bg-white dark:bg-tertiary-850 p-2 text-tertiary-900 dark:text-white shadow-md outline-none transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-400 disabled:cursor-default"
            >
                <SelectPrimitive.Value>
                    <DifficultyLabel difficulty={selected} constrainVersion/>
                </SelectPrimitive.Value>
                <SelectPrimitive.Icon asChild>
                    <MdKeyboardArrowDown
                        aria-hidden="true"
                        className="size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                    />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    position="popper"
                    sideOffset={4}
                    align="end"
                    collisionPadding={8}
                    className="z-70 max-h-72 min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg bg-white dark:bg-tertiary-850 p-1 text-tertiary-900 dark:text-white shadow-xl"
                >
                    <SelectPrimitive.Viewport>
                        {difficulties.map((difficulty) => (
                            <SelectPrimitive.Item
                                key={difficultyValue(difficulty)}
                                value={difficultyValue(difficulty)}
                                textValue={`${difficulty.difficultyRating.toFixed(2)} stars, ${difficulty.version}`}
                                className="relative flex min-h-8 cursor-pointer select-none items-center rounded px-2 pr-7 outline-none data-highlighted:bg-tertiary-100 data-[state=checked]:bg-tertiary-100 dark:data-highlighted:bg-tertiary-700 dark:data-[state=checked]:bg-tertiary-700"
                            >
                                <SelectPrimitive.ItemText>
                                    <span className="sr-only">
                                        {difficulty.difficultyRating.toFixed(2)} stars, {difficulty.version}
                                    </span>
                                    <span aria-hidden="true" className="contents">
                                        <DifficultyLabel difficulty={difficulty}/>
                                    </span>
                                </SelectPrimitive.ItemText>
                                <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
                                    <MdCheck className="size-3" aria-hidden="true"/>
                                </SelectPrimitive.ItemIndicator>
                            </SelectPrimitive.Item>
                        ))}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
};

export default PreviewPlayerDifficultySelect;
