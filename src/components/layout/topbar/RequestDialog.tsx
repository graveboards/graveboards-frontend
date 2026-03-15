"use client";

import {type ChangeEvent, forwardRef, useCallback, useState} from "react";
import {createPortal} from "react-dom";
import Dialog from "@/components/shared/dialog";
import {Button} from "@/components/ui/button";
import QueuesSelect from "@/components/queues/queues-select";

interface RequestDialogProps {
    onClose: () => void;
}

const RequestDialog = forwardRef<HTMLDialogElement, RequestDialogProps>(
    ({onClose}, ref) => {
        const [formState, setFormState] = useState<{
            beatmapLink: string;
            queues: number[];
            comment: string;
        }>({
            beatmapLink: "",
            queues: [],
            comment: "",
        })

        const handleBeatmapLinkChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
            setFormState((prev) => ({
                ...prev,
                beatmapLink: e.target.value
            }));
        }, []);

        const handleQueuesChange = useCallback((queues: number[]) => {
            if (queues.length < 3) setFormState((prev) => ({
                ...prev,
                queues: queues
            }));
        }, []);

        const handleCommentChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
            setFormState((prev) => ({
                ...prev,
                comment: e.target.value
            }));
        }, []);

        return (
            createPortal(
                <Dialog title="Request a Map" ref={ref} onClose={onClose}>
                    <form className="flex flex-col gap-3 mt-2">
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold dark:text-white">
                                Beatmapset Link<span className="text-red-500">*</span>
                            </span>
                            <input
                                className=
                                    "w-full sm:w-auto placeholder-tertiary-500 dark:placeholder-tertiary-400 whitespace-nowrap p-2 rounded-lg dark:bg-tertiary-900 outline-none border flex items-center justify-between gap-1 transition-colors duration-300 ease-in-out focus:border-primary-500 focus:bg-tertiary-100 focus:dark:bg-tertiary-800 border-tertiary-300 dark:border-tertiary-700"
                                type="url"
                                placeholder="Beatmapset Link"
                                value={formState.beatmapLink}
                                onChange={handleBeatmapLinkChange}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold dark:text-white">
                                Queue(s)<span className="text-red-500">*</span>
                            </span>

                            <QueuesSelect onSelect={handleQueuesChange}/>

                            <span className="px-2 text-sm dark:text-tertiary-500 text-tertiary-400">
                                You can select up to 3 queues at once.
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                        <span className="font-semibold dark:text-white">
                            Comment
                        </span>
                            <textarea
                                className=
                                    "w-full sm:w-auto placeholder-tertiary-500 dark:placeholder-tertiary-400 whitespace-nowrap p-2 rounded-lg dark:bg-tertiary-900 outline-none border flex items-center justify-between gap-1 transition-colors duration-300 ease-in-out focus:border-primary-500 focus:bg-tertiary-100 focus:dark:bg-tertiary-800 border-tertiary-300 dark:border-tertiary-700"
                                placeholder="Comment"
                                value={formState.comment}
                                onChange={handleCommentChange}
                            />
                        </div>
                        <footer className="flex justify-end gap-2 mt-2">
                            <Button
                                rounded="lg"
                                className="px-4 py-2"
                                type="submit"
                                disabled={!formState.beatmapLink || !formState.queues.length}
                            >
                                Request
                            </Button>
                        </footer>
                    </form>
                </Dialog>,
                document.body
            )
        );
    }
);

RequestDialog.displayName = "RequestDialog";

export default RequestDialog;
