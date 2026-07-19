"use client";

import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

interface TimeContextProps {
    timestamp: number;
    setTimestamp: (timestamp: number) => void;
    totalLength: number;
    setTotalLength: (length: number) => void;
    isRunning: boolean;
    start: () => void;
    stop: () => void;
    reset: () => void;
}

const TimeContext = createContext<TimeContextProps | undefined>(undefined);

export const TimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [timestamp, _setTimestamp] = useState<number>(0);
    const [totalLength, setTotalLength] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const timestampRef = useRef(0);
    const lastFrameTimeRef = useRef<number | null>(null);

    const setTimestamp = useCallback((newTimestamp: number) => {
        const normalizedTimestamp = Math.max(0, newTimestamp);

        timestampRef.current = normalizedTimestamp;
        lastFrameTimeRef.current = null;
        _setTimestamp(normalizedTimestamp);
    }, []);

    const start = useCallback(() => {
        lastFrameTimeRef.current = null;
        setIsRunning(true);
    }, []);

    const stop = useCallback(() => {
        lastFrameTimeRef.current = null;
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setTimestamp(0);
    }, [setTimestamp]);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        let animationFrame: number;
        const updateTimestamp = (frameTime: number) => {
            const previousFrameTime = lastFrameTimeRef.current;
            lastFrameTimeRef.current = frameTime;

            if (previousFrameTime !== null) {
                const nextTimestamp = timestampRef.current + (frameTime - previousFrameTime);
                const boundedTimestamp = totalLength > 0
                    ? Math.min(nextTimestamp, totalLength)
                    : nextTimestamp;

                timestampRef.current = boundedTimestamp;
                _setTimestamp(boundedTimestamp);

                if (totalLength > 0 && boundedTimestamp >= totalLength) {
                    setIsRunning(false);
                    return;
                }
            }

            animationFrame = requestAnimationFrame(updateTimestamp);
        };

        animationFrame = requestAnimationFrame(updateTimestamp);
        return () => {
            cancelAnimationFrame(animationFrame);
            lastFrameTimeRef.current = null;
        };
    }, [isRunning, totalLength]);

    const value = useMemo(() => ({
        timestamp,
        setTimestamp,
        totalLength,
        setTotalLength,
        isRunning,
        start,
        stop,
        reset,
    }), [isRunning, reset, setTimestamp, start, stop, timestamp, totalLength]);

    return (
        <TimeContext.Provider value={value}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = (): TimeContextProps => {
    const context = useContext(TimeContext);
    if (!context) {
        throw new Error("useTime must be used within a TimeProvider");
    }
    return context;
};
