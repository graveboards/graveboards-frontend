import {Suspense} from "react";
import SearchBar from "@/components/new/layout/topbar/search-bar";
import AuthButton from "@/components/new/layout/topbar/auth-button";
import TopbarToggle from "@/components/new/layout/topbar/topbar-toggle";
import RequestButton from "@/components/new/layout/topbar/request-button";

const Topbar = () => {
    return (
        <div
            className="sticky top-0 z-20 flex min-w-0 flex-1 items-center gap-4 bg-white p-5 backdrop-blur-sm sm:px-5 sm:pb-5 sm:pt-9 dark:bg-transparent dark:backdrop-brightness-[0.1]">
            <TopbarToggle/>
            <div className="flex min-w-0 flex-1 gap-4 justify-end items-center transition-all duration-300">
                <Suspense fallback={null}>
                    <SearchBar/>
                </Suspense>

                <RequestButton/>

                <AuthButton/>
            </div>
        </div>
    );
}

export default Topbar;

