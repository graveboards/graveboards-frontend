import SearchBar from "@/components/new/layout/topbar/search-bar";
import AuthButton from "@/components/new/layout/topbar/auth-button";
import TopbarToggle from "@/components/new/layout/topbar/topbar-toggle";
import RequestButton from "@/components/new/layout/topbar/request-button";

const Topbar = () => {
    return (
        <div
            className="flex flex-1 items-center gap-4 sm:px-5 sm:py-9 p-5 sticky top-0 z-20 backdrop-blur bg-white dark:bg-transparent dark:backdrop-brightness-[0.1]">
            <TopbarToggle/>
            <div className="flex flex-1 gap-4 justify-end items-center transition-all duration-300">
                <SearchBar/>

                <RequestButton/>

                <AuthButton/>
            </div>
        </div>
    );
}

export default Topbar;

