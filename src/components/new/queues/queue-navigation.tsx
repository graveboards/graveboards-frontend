"use client";

import {usePathname} from "next/navigation";
import {PageTab, PageTabs} from "@/components/new/layout/page-tabs";

interface QueueNavigationProps {
    queueId: number;
    showManage: boolean;
    showSettings: boolean;
}

const QueueNavigation = ({queueId, showManage, showSettings}: QueueNavigationProps) => {
    const pathname = usePathname();
    const normalizedPathname = pathname.replace(/\/+$/, "");
    const generalHref = `/queues/${queueId}`;
    const manageHref = `${generalHref}/manage`;
    const settingsHref = `${generalHref}/settings`;
    const items = [
        {href: generalHref, label: "General"},
        ...(showManage ? [{href: manageHref, label: "Manage"}] : []),
        ...(showSettings ? [{href: settingsHref, label: "Settings"}] : []),
    ];

    return (
        <PageTabs aria-label="Queue sections">
            {items.map((item) => {
                const isActive = normalizedPathname === item.href
                    || (
                        (item.href === manageHref || item.href === settingsHref)
                        && normalizedPathname.startsWith(`${item.href}/`)
                    );

                return (
                    <PageTab
                        href={item.href}
                        isActive={isActive}
                        key={item.href}
                    >
                        {item.label}
                    </PageTab>
                );
            })}
        </PageTabs>
    );
};

export default QueueNavigation;
