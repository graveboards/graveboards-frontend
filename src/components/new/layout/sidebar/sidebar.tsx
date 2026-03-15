'use client';

import React, {ComponentProps, FC, useEffect} from "react";
import {MdChecklist, MdHome, MdList, MdLogout, MdSearch} from "react-icons/md";
import {useAuth} from "@/context/auth-context";
import SidebarManage from "@/components/new/layout/sidebar/sidebar-manage";
import {FaGithub} from "react-icons/fa";
import {GoX} from "react-icons/go";
import {useSidebar} from "@/context/layout/sidebar-context";
import SidebarLoginButton from "@/components/new/layout/sidebar/sidebar-login-button";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const Sidebar: FC = () => {
    const {open, setOpen, toggleOpen} = useSidebar();
    const {isAuthenticated, logout} = useAuth();
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    useEffect(() => {
        setOpen(false);
    }, [pathname, setOpen]);

    return (
        <div
            className={cn(
                `flex flex-col h-screen gap-6 md:sticky fixed shrink-0 top-0 w-full md:translate-x-0 md:w-64 border-r transition-transform duration-300 ease-in-out border-tertiary-200 dark:border-tertiary-800 dark:bg-black bg-white z-50`,
                {"-translate-x-full": !open}
            )}>
            <SidebarHeader>
                <div className="text-2xl flex gap-2 items-center">
                    <Logo size={24} className="dark:text-tertiary-10 text-tertiary-900"/>
                    Graveboards
                </div>
                <Button
                    onClick={toggleOpen}
                    rounded="full"
                    variant="clear"
                    size="lg"
                    className="md:hidden -mr-3 px-3">
                    <GoX className="size-6"/>
                </Button>
            </SidebarHeader>

            <SidebarContent>
                <SidebarSection className="md:hidden">
                    <SidebarSectionLabel>
                        Profile
                    </SidebarSectionLabel>
                    <SidebarSectionContent>
                        {isAuthenticated ? (
                            <SidebarButton onClick={() => logout()}>
                                <MdLogout/>
                                Log Out
                            </SidebarButton>
                        ) : (
                            <SidebarLoginButton/>
                        )}
                    </SidebarSectionContent>
                </SidebarSection>

                <SidebarSection>
                    <SidebarSectionLabel>
                        Discover
                    </SidebarSectionLabel>
                    <SidebarSectionContent>
                        <SidebarButton asChild isActive={isActive("/home")}>
                            <Link href="/home">
                                <MdHome/>
                                Home
                            </Link>
                        </SidebarButton>
                        <SidebarButton asChild isActive={isActive("/search")}>
                            <Link href="/search">
                                <MdSearch/>
                                Search
                            </Link>
                        </SidebarButton>
                        {isAuthenticated && (
                            <>
                                <SidebarButton asChild isActive={isActive("/requests")}>
                                    <Link href="/requests">
                                        <MdChecklist/>
                                        My Requests
                                    </Link>
                                </SidebarButton>
                                <SidebarButton asChild isActive={isActive("/queues")}>
                                    <Link href="/queues">
                                        <MdList/>
                                        Queues
                                    </Link>
                                </SidebarButton>
                            </>
                        )}
                    </SidebarSectionContent>
                </SidebarSection>

                <SidebarManage/>
            </SidebarContent>
            <SidebarFooter>
                Graveboards © 2026
                <div className="flex gap-2">
                    <a href="https://github.com/graveboards/graveboards-frontend" target="_blank"
                       className="flex gap-1 items-center">
                        <FaGithub className='size-4'/>
                        Front-end
                    </a>
                    <span>•</span>
                    <a href="https://github.com/graveboards/graveboards-backend" target="_blank"
                       className="flex gap-1 items-center">
                        <FaGithub className='size-4'/>
                        Back-end
                    </a>
                </div>
            </SidebarFooter>
        </div>
    );
};

export default Sidebar;

const SidebarHeader: FC<ComponentProps<"div">> = ({className, ...props}) => (
    <div
        data-slot="sidebar-header"
        data-sidebar="header"
        className={cn("flex items-center justify-between md:justify-center gap-2 pt-9 px-6", className)}
        {...props}
    />
);

const SidebarContent: FC<ComponentProps<"div">> = ({className, ...props}) => (
    <div
        data-slot="sidebar-content"
        data-sidebar="content"
        className={cn("flex min-h-0 flex-1 flex-col gap-4 px-6 hover:overflow-auto overflow-hidden", className)}
        {...props}
    />
);

const SidebarFooter: FC<ComponentProps<"div">> = ({className, ...props}) => (
    <div
        data-slot="sidebar-footer"
        data-sidebar="footer"
        className={cn("w-full flex flex-col gap-2 items-center justify-center text-sm text-tertiary-500 dark:text-tertiary-400 px-6 pb-4", className)}
        {...props}
    />
);

export const SidebarSection: FC<ComponentProps<"div">> = ({className, ...props}) => (
    <div
        data-slot="sidebar-section"
        data-sidebar="section"
        className={cn("flex flex-col w-full", className)}
        {...props}
    />
);

export const SidebarSectionLabel: FC<ComponentProps<"div">> = ({className, ...props}) => (
    <div
        data-slot="sidebar-section-label"
        data-sidebar="section-label"
        className={cn("font-bold tracking-wide px-3 pb-4 dark:text-tertiary-400 text-tertiary-500 bg-white dark:bg-black sticky top-0", className)}
        {...props}
    />
);

export const SidebarSectionContent: FC<ComponentProps<"div">> = ({className, ...props}) => (
    <div
        data-slot="sidebar-section-content"
        data-sidebar="section-content"
        className={cn("flex flex-col gap-1", className)}
        {...props}
    />
);

export const SidebarButton: FC<ComponentProps<"button"> & { asChild?: boolean, isActive?: boolean }> = ({
                                                                                                     className,
                                                                                                     asChild = false,
                                                                                                     isActive = false,
                                                                                                     ...props
                                                                                                 }) => (
    <Button variant={isActive ? "fill" : "clear"}
            className={cn("w-full justify-start gap-2 rounded-lg px-3 py-2 [&>svg]:size-6 [&>svg]:shrink-0", className)}
            {...props}
            asChild={asChild}
    />
);
