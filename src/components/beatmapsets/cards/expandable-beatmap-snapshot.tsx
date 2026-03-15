import {BeatmapSnapshot} from "@/types/beatmap";
import {useLayoutEffect, useRef, useState} from "react";
import {ColorUtils} from "@/utils/color-utils";
import RulesetIcon from "@/components/icons/rulesets";

const ExpandableBeatmapSnapshot = ({beatmap}: { beatmap: BeatmapSnapshot }) => {
    const diffTextRef = useRef<HTMLSpanElement | null>(null);
    const versionRef = useRef<HTMLAnchorElement | null>(null);

    const [diffW, setDiffW] = useState(0);
    const [versionW, setVersionW] = useState(0);
    const [hover, setHover] = useState(false);

    const measureDiff = () => {
        if (!diffTextRef.current) return;
        setDiffW(Math.ceil(diffTextRef.current.getBoundingClientRect().width));
    };

    const measureVersion = () => {
        if (!versionRef.current) return;
        setVersionW(Math.ceil(versionRef.current.getBoundingClientRect().width));
    };

    useLayoutEffect(() => {
        measureDiff();
        measureVersion();

        const ro1 = new ResizeObserver(measureDiff);
        if (diffTextRef.current) ro1.observe(diffTextRef.current);

        const ro2 = new ResizeObserver(measureVersion);
        if (versionRef.current) ro2.observe(versionRef.current);

        return () => {
            ro1.disconnect();
            ro2.disconnect();
        };
    }, [beatmap.difficulty_rating, beatmap.version]);

    const backgroundColor = ColorUtils.forStarRating(beatmap.difficulty_rating);
    const color = beatmap.difficulty_rating >= 6.5 ? "#fff" : "#000";

    const collapsedPillW = 6;
    const pillPadX = 8;

    const collapsedLinkW = 0;

    return (
        <div
            className="snap-start flex items-center gap-1 flex-1 shrink-0 overflow-x-hidden text-xs group"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="text-md shrink-0 text-tertiary-500 dark:text-tertiary-400">
                <RulesetIcon ruleset={beatmap.mode}/>
            </div>

            <div
                className="h-4 rounded-full font-semibold overflow-hidden whitespace-nowrap
                   transition-[width,padding] duration-300 ease-in-out delay-300"
                style={{
                    backgroundColor,
                    color,
                    width: hover ? diffW + pillPadX * 2 : collapsedPillW,
                    paddingLeft: hover ? pillPadX : 0,
                    paddingRight: hover ? pillPadX : 0,
                }}
            >
                <span ref={diffTextRef}
                      className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out delay-300">
                  ★ {beatmap.difficulty_rating.toFixed(2)}
                </span>
            </div>

            <span
                className="inline-block overflow-hidden whitespace-nowrap
                   transition-[width,padding] duration-300 ease-in-out delay-300"
                style={{
                    width: hover ? versionW * 2 : collapsedLinkW,
                }}
            >
                <a
                    ref={versionRef}
                    href={`https://osu.ppy.sh/beatmaps/${beatmap.beatmap_id}`}
                    className="inline-block truncate hover:underline"
                    target="_blank"
                    rel="noreferrer"
                >
                  {beatmap.version}
                </a>
          </span>
        </div>
    );
};

export default ExpandableBeatmapSnapshot;