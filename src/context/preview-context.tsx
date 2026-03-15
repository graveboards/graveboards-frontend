'use client';

import React, {createContext, FC, useContext, useState} from "react";

interface BeatmapPreviewContextType {
    src: string | undefined;
    setSrc: (src: string | undefined) => void;
}

export const PreviewContext = createContext<BeatmapPreviewContextType>({
    src: undefined,
    setSrc: () => {},
});

export const PreviewProvider: FC<{ children: React.ReactNode }> = ({children}) => {
    const [src, setSrc] = useState<string | undefined>(undefined);

    return (
        <PreviewContext.Provider value={{
            src,
            setSrc,
        }}>
            {children}
        </PreviewContext.Provider>
    );
};

export const usePreview = () => useContext(PreviewContext);
