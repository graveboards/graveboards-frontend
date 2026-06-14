'use client';

import React, {createContext, FC, useContext, useState} from "react";

interface SearchContextType {
    search: string;
    setSearch: (src: string) => void;
}

export const SearchContext = createContext<SearchContextType>({
    search: "",
    setSearch: () => {},
});

export const SearchProvider: FC<{ children: React.ReactNode }> = ({children}) => {
    const [search, setSearch] = useState<string>("");

    return (
        <SearchContext.Provider value={{
            search,
            setSearch,
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
