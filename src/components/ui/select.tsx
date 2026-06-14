import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { MdCheck, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import {cn} from "@/lib/utils";

interface SelectProps<T> extends HTMLAttributes<HTMLDivElement> {
    items: T[];
    onItemSelect: (selectedItem: T | null) => void;
    renderItem: (item: T) => React.ReactNode;
    renderSelected?: (item: T) => React.ReactNode;
    isSelected: (item: T) => boolean;
    selected?: T | T[] | null;
    placeholder?: string;
    disabled?: boolean;
    footer?: React.ReactNode;
}

const MAX_DROPDOWN_HEIGHT = 308;
const ESTIMATED_OPTION_HEIGHT = 42;
const VIEWPORT_PADDING = 16;

const Select = <T, >({
                         items,
                         onItemSelect,
                         isSelected,
                         renderItem,
                         renderSelected,
                         selected,
                         placeholder,
                         className,
                         disabled,
                         footer,
                         ...props
                     }: SelectProps<T>) => {
    const [open, setOpen] = useState(false);
    const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">("down");

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleSelect = (item: T) => {
        onItemSelect(item);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!open) {
            return;
        }

        const updateDropdownDirection = () => {
            const rect = dropdownRef.current?.getBoundingClientRect();

            if (!rect) {
                return;
            }

            const availableBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
            const availableAbove = rect.top - VIEWPORT_PADDING;
            const estimatedDropdownHeight = Math.min(
                items.length * ESTIMATED_OPTION_HEIGHT + (footer ? ESTIMATED_OPTION_HEIGHT : 0),
                MAX_DROPDOWN_HEIGHT
            );

            setDropdownDirection(
                availableBelow < estimatedDropdownHeight && availableAbove > availableBelow ? "up" : "down"
            );
        };

        updateDropdownDirection();
        window.addEventListener("resize", updateDropdownDirection);
        window.addEventListener("scroll", updateDropdownDirection, true);

        return () => {
            window.removeEventListener("resize", updateDropdownDirection);
            window.removeEventListener("scroll", updateDropdownDirection, true);
        };
    }, [footer, items.length, open]);

    return (
        <div
            ref={dropdownRef}
            className={cn(
                className,
                `border-transparent relative transition-colors duration-300 ease-in-out sm:border-0 sm:rounded-none border rounded-lg`,
                { "sm:border-primary-500 z-50": open }
            )}
            {...props}
        >
            <button
                disabled={disabled}
                type="button"
                className={clsx(
                    `${className} whitespace-nowrap p-2 sm:rounded-lg backdrop-blur-sm border enabled:hover:bg-tertiary-100 enabled:active:bg-tertiary-200 dark:enabled:hover:bg-tertiary-800 dark:enabled:active:bg-tertiary-700 disabled:opacity-50 flex items-center justify-between gap-1 transition-colors duration-300 ease-in-out`,
                    open ? clsx(
                        "border-primary-500 bg-tertiary-100 dark:bg-tertiary-800",
                        dropdownDirection === "up" ? "rounded-b-lg" : "rounded-t-lg"
                    ) : "border-tertiary-300 dark:border-tertiary-700 rounded-lg"
                )}
                onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-1 w-full flex-wrap">
                    {
                        selected instanceof Array ? (
                            selected.length > 0 ? selected.map((item, index) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    {renderSelected ? renderSelected(item) : renderItem(item)}
                                </div>
                            )) : (
                                <p className={clsx(open ? "text-black dark:text-white" : "text-tertiary-400", "transition-colors duration-300 ease-in-out")}>{placeholder || "Select Item(s)"}</p>
                            )
                        ) : (selected !== null && selected !== undefined) ? (
                            renderSelected ? renderSelected(selected) : renderItem(selected)
                        ) : (
                            <p className={clsx(open ? "text-black dark:text-white" : "text-tertiary-400", "transition-colors duration-300 ease-in-out")}>{placeholder || "Select Item"}</p>
                        )
                    }
                </div>

                {
                    open ? (
                        <MdOutlineKeyboardArrowUp className="size-5" />
                    ) : (
                        <MdOutlineKeyboardArrowDown className="size-5" />
                    )
                }
            </button>
            {open && (
                <div
                    className={cn(
                        "absolute left-0 overflow-y-auto flex flex-col z-50 bg-tertiary-100 dark:bg-tertiary-900 sm:border border-tertiary-400 dark:border-tertiary-700 border min-w-full max-h-77 snap-y",
                        dropdownDirection === "up"
                            ? "bottom-full border-b-0 rounded-t-lg sm:mb-2 sm:border-b sm:rounded-lg"
                            : "top-full border-t-0 rounded-b-lg sm:mt-2 sm:border-t sm:rounded-lg"
                    )}>
                    {items.map((item, index) => (
                        <div key={index} onClick={() => handleSelect(item)} className={
                            clsx(
                                isSelected(item) ? "bg-tertiary-200 dark:bg-tertiary-800 text-black dark:text-white" : "text-tertiary-500 dark:text-tertiary-400",
                                "cursor-pointer whitespace-nowrap p-2 flex-1 flex gap-1.5 items-center justify-between hover:bg-tertiary-200 active:bg-tertiary-300 active:text-black dark:hover:bg-tertiary-800 dark:active:bg-tertiary-700 dark:active:text-white transition-colors duration-300 ease-in-out"
                            )
                        }>
                            {renderItem(item)}
                            {isSelected(item) && (
                                <div
                                    className="flex items-center justify-center text-black dark:text-white rounded-full w-6 h-6">
                                    <MdCheck />
                                </div>
                            )}
                        </div>
                    ))}

                    {footer}
                </div>
            )}
        </div>
    );
};

export default Select;
