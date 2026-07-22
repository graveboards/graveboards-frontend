"use client";

import React, {FC, useActionState, useEffect, useState} from "react";
import {Request, RequestStatus} from "@/types/request";
import {MdCheck, MdChevronRight, MdClose, MdComment, MdPlayArrow, MdRadioButtonChecked} from "react-icons/md";
import {ColorUtils} from "@/utils/color-utils";
import RequestStatusBadge from "@/components/requests/request-status-badge";
import SelectRequestStatus from "@/components/requests/manage/select-request-status";
import clsx from "clsx";
import {formatTime} from "@/utils/time-utils";
import {Button} from "@/components/ui/button";
import {useBeatmapPreview} from "@/context/preview-context";
import {patchRequest} from "@/actions/requests";
import Link from "next/link";
import toast from "react-hot-toast";
import {createBeatmapPreviewSelection, getDefaultBeatmapPreview} from "@/lib/beatmap-preview-selection";

interface RequestCardProps {
    request: Request,
    editMode?: boolean;
}

const ListRequestCard: FC<RequestCardProps> = ({request, editMode = false}) => {
    const [status, setStatus] = useState<RequestStatus>(request.status);

    const {selectBeatmap} = useBeatmapPreview();
    const previewBeatmap = request.beatmapset_snapshot
        ? getDefaultBeatmapPreview(request.beatmapset_snapshot)
        : undefined;

    const [commentHovered, setCommentHovered] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);
    const commentRef = React.useRef<HTMLDivElement>(null);

    const formRef = React.useRef<HTMLFormElement>(null);

    const [requestStatusState, dispatchRequestStatus, isRequestStatusPending] = useActionState(async (prevState: {
        status: RequestStatus
    }, {status}: {status: RequestStatus}) => {
        const result = await patchRequest(request.id, {status});

        if (result) {
            toast.success("Request status updated");
            return {status};
        } else {
            toast.error("Failed to update request status");
            return prevState;
        }
    }, {status: request.status});

    useEffect(() => {
        if (status !== requestStatusState.status) {
            formRef.current?.requestSubmit();
        }
    }, [status, requestStatusState.status]);

    useEffect(() => {
        if (!commentOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (commentRef.current && !commentRef.current.contains(event.target as Node)) {
                setCommentOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [commentOpen]);

    return (
        <div className="flex rounded-xl h-24">
            <div
                className="flex-col p-2.5 justify-end gap-3 items-end hidden xl:flex rounded-l-xl h-full aspect-video bg-tertiary-800 dark:bg-tertiary-950 bg-center bg-no-repeat bg-size-[215%]"
                style={{backgroundImage: `url(${request.beatmapset_snapshot?.covers["cover"]})`}}>
                <div className="flex gap-1.5">
                    <Button className="px-1.5 gap-1 h-6.5 font-semibold text-sm"
                            onClick={() => {
                                if (previewBeatmap && request.beatmapset_snapshot) {
                                    selectBeatmap(createBeatmapPreviewSelection(
                                        previewBeatmap,
                                        request.beatmapset_snapshot,
                                    ));
                                }
                            }}
                            disabled={!previewBeatmap}>
                        <MdPlayArrow className="size-4 shrink-0"/>
                        PREVIEW
                    </Button>
                    <div
                        className="bg-black bg-opacity-80 text-white rounded-lg p-1.5 leading-none text-sm overflow-hidden max-h-7 box-border">
                        {formatTime(request.beatmapset_snapshot?.beatmap_snapshots[0]?.total_length || 0)}
                    </div>
                </div>
            </div>
            <div
                className={clsx(
                    `bg-tertiary-50 dark:text-white dark:bg-tertiary-900 grid w-full items-center gap-4 px-4 relative tracking-wide rounded-xl xl:rounded-l-none xl:rounded-r-xl`,
                    editMode
                        ? "lg:grid-cols-[repeat(3,minmax(0,1fr))_2.25rem_minmax(0,1fr)_auto] sm:grid-cols-[repeat(2,minmax(0,1fr))_2.25rem_minmax(0,1fr)_auto] grid-cols-[minmax(0,1fr)_auto_auto]"
                        : "lg:grid-cols-[repeat(3,minmax(0,1fr))_2.25rem_repeat(1,minmax(0,1fr))] sm:grid-cols-[repeat(2,minmax(0,1fr))_2.25rem_repeat(1,minmax(0,1fr))] grid-cols-2"
                )}>
                <div className="truncate">
                    <a href={`https://osu.ppy.sh/beatmapsets/${request.beatmapset_id}`}
                       className="text-sm font-semibold leading-5 truncate" target="_blank">
                        {request.beatmapset_snapshot?.title}
                    </a>

                    <div className="text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                        by {request.beatmapset_snapshot?.artist}
                    </div>

                    <div className="text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                        Hosted by <a href={`https://osu.ppy.sh/users/${request.beatmapset_snapshot?.user_id}`}
                                     className="font-semibold"
                                     target="_blank">{request.beatmapset_snapshot?.user_profile.username}</a>
                    </div>

                    <div className="block lg:hidden text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                        Requested by <a href={`https://osu.ppy.sh/users/${request.user_id}`}
                                        className="font-semibold"
                                        target="_blank">{request.user_profile?.username}</a>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 truncate">
                    <a href={`https://osu.ppy.sh/users/${request.user_id}`}
                       className="size-10 shrink-0 bg-gray-500 rounded-full bg-cover" target="_blank"
                       style={{backgroundImage: `url(${request.user_profile?.avatar_url})`}}></a>
                    <div className="leading-5 truncate">
                        <div className="text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                            Requested by
                        </div>

                        <a href={`https://osu.ppy.sh/users/${request.user_id}`}
                           className="text-sm font-semibold"
                           target="_blank">{request.user_profile?.username}</a>

                        <div className="lg:block hidden text-xs text-tertiary-500 dark:text-tertiary-400 truncate">
                            on <Link href={`/queues/${request.queue_id}`}
                                     className="font-semibold"
                                     target="_blank">{request.queue?.name}</Link>
                        </div>
                    </div>
                </div>

                <div
                    className="hidden sm:flex flex-col gap-0 transition-[gap] duration-300 delay-300 ease-out group hover:gap-2 hover:delay-0">
                    <div className="flex items-center gap-1 self-stretch">
                        <MdRadioButtonChecked className="size-4 shrink-0 text-tertiary-500 dark:text-tertiary-400"/>
                        <div className="flex items-center gap-0.5">
                            {
                                request.beatmapset_snapshot?.beatmap_snapshots
                                    .sort((a, b) => a.difficulty_rating - b.difficulty_rating)
                                    .slice(0, 6)
                                    .map((beatmap, index) => (
                                        <div key={index} className="w-1.5 h-4 bg-gray-500 rounded-full"
                                             style={{backgroundColor: ColorUtils.forStarRating(beatmap.difficulty_rating)}}></div>
                                    ))
                            }

                            {request.beatmapset_snapshot?.beatmap_snapshots && request.beatmapset_snapshot?.beatmap_snapshots?.length > 6 && (
                                <div className="text-xs ml-1 text-tertiary-500 dark:text-tertiary-400">
                                    +{request.beatmapset_snapshot?.beatmap_snapshots?.length - 6}
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <div className="hidden items-center justify-center text-tertiary-500 sm:flex">
                    {
                        request.comment && request.comment.length > 0 && (
                            <div
                                ref={commentRef}
                                className="relative"
                                onMouseEnter={() => setCommentHovered(true)}
                                onMouseLeave={() => setCommentHovered(false)}
                            >
                                <button
                                    type="button"
                                    aria-expanded={commentOpen}
                                    aria-label={commentOpen ? "Hide request comment" : "Show request comment"}
                                    className="flex size-9 cursor-pointer items-center justify-center"
                                    onClick={() => setCommentOpen((open) => !open)}
                                >
                                    <MdComment className="size-6 shrink-0"/>
                                </button>
                                {(commentHovered || commentOpen) && (
                                    <div
                                        className="absolute bottom-full right-0 z-10 mb-2 w-64 rounded-lg border bg-white p-2 text-tertiary-500 dark:border-tertiary-700 dark:bg-tertiary-800 dark:text-tertiary-400"
                                    >
                                        {request.comment}
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>

                {editMode ? (
                    <form
                        ref={formRef}
                        action={() => dispatchRequestStatus({status})}
                        className="flex min-w-0 items-center justify-center"
                    >
                        <SelectRequestStatus
                            key={requestStatusState.status}
                            name="status"
                            className="w-18 xl:w-32"
                            initialStatus={requestStatusState.status}
                            onSelect={setStatus}
                            isPending={isRequestStatusPending}
                        />
                    </form>
                ) : (
                    <div className="flex items-center justify-center">
                        <RequestStatusBadge status={requestStatusState.status}/>
                    </div>
                )}

                {editMode && (
                    <div className="flex flex-col items-center justify-center gap-1 xl:pr-4">
                        <Button
                            type="button"
                            size="xs"
                            rounded="md"
                            disabled={isRequestStatusPending || requestStatusState.status === 1}
                            onClick={() => setStatus(1)}
                            aria-label="Accept request"
                            title="Accept request"
                            className="w-24 px-2 text-xs bg-request-accepted hover:bg-request-accepted active:bg-request-accepted hover:opacity-85 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <MdCheck className="size-4 shrink-0"/>
                            ACCEPT
                        </Button>
                        <Button
                            type="button"
                            size="xs"
                            rounded="md"
                            disabled={isRequestStatusPending || requestStatusState.status === -1}
                            onClick={() => setStatus(-1)}
                            aria-label="Reject request"
                            title="Reject request"
                            className="w-24 px-2 text-xs bg-request-rejected hover:opacity-85 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <MdClose className="size-4 shrink-0"/>
                            REJECT
                        </Button>
                    </div>
                )}
            </div>

            <a href={`https://osu.ppy.sh/beatmapsets/${request.beatmapset_id}`}
               target="_blank"
               className={`h-full flex items-center justify-center rounded-r-xl bg-tertiary-100 hover:bg-tertiary-200 active:bg-tertiary-300 dark:bg-tertiary-800 dark:hover:bg-tertiary-700 dark:active:bg-tertiary-600 pl-8 -ml-8 hover:w-20 w-14 transition-all duration-150 ease-in-out`}>
                <MdChevronRight className="size-6 shrink-0 text-tertiary-500 justify-self-end"/>
            </a>
        </div>
    );
};

export default ListRequestCard;
