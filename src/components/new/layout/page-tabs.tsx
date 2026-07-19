import type {ComponentProps, FC, MouseEventHandler, ReactNode} from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";

export const PageTabs: FC<ComponentProps<"nav">> = ({className, ...props}) => (
    <nav
        className={cn(
            "sticky top-0 z-10 flex flex-1 items-center justify-center gap-6 border-b",
            "border-tertiary-200 bg-white backdrop-blur-sm",
            "dark:border-tertiary-800 dark:bg-transparent dark:backdrop-brightness-[0.1]",
            className,
        )}
        {...props}
    />
);

interface PageTabProps {
    children: ReactNode;
    className?: string;
    href?: string;
    isActive: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const PageTab: FC<PageTabProps> = ({
    children,
    className,
    href,
    isActive,
    onClick,
}) => {
    const tabClassName = cn(
        "group relative flex h-8 shrink-0 cursor-pointer items-center",
        "transition-colors duration-300 ease-in-out",
        isActive
            ? "text-primary-500 dark:hover:text-primary-400"
            : "text-tertiary-400 hover:text-tertiary-500 dark:text-tertiary-600",
        className,
    );
    const content = (
        <>
            {children}
            <span
                aria-hidden="true"
                className={cn(
                    "absolute inset-x-0 -bottom-0.75 h-1.25 origin-center scale-x-0 rounded-full",
                    "transform-gpu transition-[transform,background-color] duration-300 ease-in-out",
                    "group-hover:scale-x-100",
                    isActive ? "scale-x-100 bg-primary-500" : "bg-tertiary-700",
                )}
            />
        </>
    );

    if (href) {
        return (
            <Link
                aria-current={isActive ? "page" : undefined}
                className={tabClassName}
                href={href}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            aria-pressed={isActive}
            className={tabClassName}
            onClick={onClick}
            type="button"
        >
            {content}
        </button>
    );
};
