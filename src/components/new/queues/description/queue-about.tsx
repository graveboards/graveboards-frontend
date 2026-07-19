"use client";

import {type FC, useCallback, useEffect, useId, useRef, useState} from "react";
import {MdExpandMore} from "react-icons/md";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {QueueDescriptionMarkdown} from "@/components/new/queues/description/queue-description-markdown";

const COLLAPSED_HEIGHT = 72;

interface QueueAboutProps {
    description: string | null;
}

const QueueAbout: FC<QueueAboutProps> = ({description}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const contentId = useId();
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [contentHeight, setContentHeight] = useState(COLLAPSED_HEIGHT);

    const measureOverflow = useCallback(() => {
        const content = contentRef.current;

        if (content) {
            const nextContentHeight = content.scrollHeight;

            setContentHeight(nextContentHeight);
            setHasOverflow(nextContentHeight > COLLAPSED_HEIGHT + 1);
        }
    }, []);

    useEffect(() => {
        setIsExpanded(false);
        setHasOverflow(false);
        setContentHeight(COLLAPSED_HEIGHT);
    }, [description]);

    useEffect(() => {
        measureOverflow();

        const content = contentRef.current;
        if (!content) return;

        const resizeObserver = new ResizeObserver(measureOverflow);
        resizeObserver.observe(content);

        return () => resizeObserver.disconnect();
    }, [measureOverflow, description]);

    useEffect(() => {
        const content = contentRef.current;

        if (!content) {
            return;
        }

        if (hasOverflow && !isExpanded) {
            content.setAttribute("inert", "");
        } else {
            content.removeAttribute("inert");
        }
    }, [hasOverflow, isExpanded]);

    if (!description?.trim()) {
        return null;
    }

    return (
        <div className="min-w-0">
            <div
                aria-label="Queue description"
                className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none"
                id={contentId}
                role="region"
                style={{maxHeight: isExpanded ? contentHeight : COLLAPSED_HEIGHT}}
            >
                <div ref={contentRef}>
                    <QueueDescriptionMarkdown description={description}/>
                </div>

                {hasOverflow && !isExpanded && (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white to-transparent dark:from-black"
                    />
                )}
            </div>

            {hasOverflow && (
                <Button
                    aria-controls={contentId}
                    aria-expanded={isExpanded}
                    className="-ml-2 mt-1"
                    onClick={() => setIsExpanded((expanded) => !expanded)}
                    size="sm"
                    type="button"
                    variant="clear"
                >
                    {isExpanded ? "Show less" : "Show more"}
                    <MdExpandMore
                        aria-hidden="true"
                        className={cn("size-5 transition-transform", isExpanded && "rotate-180")}
                    />
                </Button>
            )}
        </div>
    );
};

export default QueueAbout;
