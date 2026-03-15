import React, {FC} from 'react';
import {Button} from "@/components/ui/button";
import {MdSearch} from "react-icons/md";

const SearchBar: FC = () => {
    return (
        <div className="relative h-12 rounded-full items-center flex flex-1">
        <div className="absolute">
                <Button rounded="full" variant="clear" className="px-2.5 ml-1 text-xl">
                    <MdSearch/>
                </Button>
            </div>
            <input
                className="flex-1 h-full rounded-full px-12 caret-primary-500 outline-tertiary-400 dark:outline-none border-2 border-tertiary-200 dark:border-0 bg-white dark:bg-tertiary-900 dark:focus:bg-tertiary-800 transition-colors"
                placeholder="Type to search..."
            />
            {/*<div className="absolute right-0">
                <Button rounded="full" variant="clear" className="px-2.5 mr-1 text-xl">
                    <MdFilterList/>
                </Button>
            </div>*/}
        </div>
    );
}

export default SearchBar;