"use client";

import React, {createContext, type FC, type ReactNode, useContext, useState} from "react";

type SidebarContextType = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleOpen: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

type SidebarProviderType = {
    children: ReactNode;
};

export const SidebarProvider: FC<SidebarProviderType> = ({children}) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => setOpen(state => !state);

    return (
        <SidebarContext.Provider value={{open, setOpen, toggleOpen}}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const ctx = useContext(SidebarContext);

    if (!ctx) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }

    return ctx;
};