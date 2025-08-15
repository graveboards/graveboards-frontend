"use client";

import {createContext, type FC, type ReactNode, useContext, useReducer} from "react";

type SidebarContextType = {
    open: boolean;
    toggleOpen: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

type SidebarProviderType = {
    children: ReactNode;
};

export const SidebarProvider: FC<SidebarProviderType> = ({children}) => {
    const [open, toggleOpen] = useReducer((state: boolean) => !state, false);

    return (
        <SidebarContext.Provider value={{open, toggleOpen}}>
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