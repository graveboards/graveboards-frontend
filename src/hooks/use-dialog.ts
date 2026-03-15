"use client";

import { useCallback, useRef } from "react";

export const useDialog = () => {
    const ref = useRef<HTMLDialogElement>(null);
    const onOpen = () => ref.current?.showModal();
    const onClose = useCallback(() => ref.current?.close(), []);

    return {ref, onOpen, onClose};
};