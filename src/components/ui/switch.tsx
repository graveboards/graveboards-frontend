"use client"

import * as React from "react"
import {Switch as SwitchPrimitive} from "radix-ui"

import {cn} from "@/lib/utils"

function Switch({
                    className,
                    size = "default",
                    ...props
                }: React.ComponentProps<typeof SwitchPrimitive.Root> & {
    size?: "sm" | "default"
}) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            data-size={size}
            className={cn(
                "data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-tertiary-500 focus-visible:border-primary-500 focus-visible:ring-primary-500/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:border-red-500/50 dark:data-[state=unchecked]:bg-tertiary-500 shrink-0 rounded-full border border-transparent focus-visible:ring-3 aria-invalid:ring-3 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] peer group/switch relative inline-flex items-center transition-all outline-hidden after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className="bg-white rounded-full group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-3 data-[state=checked]:group-data-[size=default]/switch:translate-x-[calc(100%+0.25rem)] data-[state=checked]:group-data-[size=sm]/switch:translate-x-[calc(100%)] data-[state=unchecked]:group-data-[size=default]/switch:translate-x-0.5 data-[state=unchecked]:group-data-[size=sm]/switch:translate-x-1 pointer-events-none block ring-0 transition-transform"
            />
        </SwitchPrimitive.Root>
    )
}

export {Switch}