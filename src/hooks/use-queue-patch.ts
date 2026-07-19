"use client";

import {useCallback, useRef, useState} from "react";
import toast from "react-hot-toast";
import {patchQueue, type QueuePatchResult} from "@/actions/queues";
import {QueuePatch} from "@/types/queue";

export type QueuePatchStatus = "idle" | "saving" | "saved" | "error";

interface UseQueuePatchOptions {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (patch: QueuePatch) => void;
    onError?: (patch: QueuePatch, result: QueuePatchResult) => void;
}

export const useQueuePatch = (
    queueId: number,
    options: UseQueuePatchOptions = {},
) => {
    const optionsRef = useRef(options);
    optionsRef.current = options;

    const [status, setStatus] = useState<QueuePatchStatus>("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const resetStatus = useCallback(() => {
        setStatus("idle");
        setErrorMessage("");
    }, []);

    const submit = useCallback(async (patch: QueuePatch): Promise<QueuePatchResult> => {
        if (queueId < 0 || Object.keys(patch).length === 0) {
            const result = {ok: false, status: 400} as const;
            const message = "Invalid queue update.";

            setStatus("error");
            setErrorMessage(message);
            toast.error(optionsRef.current.errorMessage ?? message);
            optionsRef.current.onError?.(patch, result);

            return result;
        }

        setStatus("saving");
        setErrorMessage("");

        let result: QueuePatchResult;

        try {
            result = await patchQueue(queueId, patch);
        } catch {
            result = {ok: false, status: 500};
        }

        if (result.ok) {
            setStatus("saved");
            optionsRef.current.onSuccess?.(patch);

            if (optionsRef.current.successMessage) {
                toast.success(optionsRef.current.successMessage);
            }
        } else {
            const message = optionsRef.current.errorMessage ?? "Failed to update queue.";

            setStatus("error");
            setErrorMessage(message);
            toast.error(message);
            optionsRef.current.onError?.(patch, result);
        }

        return result;
    }, [queueId]);

    return {
        submit,
        status,
        errorMessage,
        isPending: status === "saving",
        resetStatus,
    };
};
