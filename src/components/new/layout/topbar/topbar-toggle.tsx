"use client";

import type {FC} from "react";
import {useSidebar} from "@/context/layout/sidebar-context";
import {Button} from "@/components/ui/button";
import {FiMenu} from "react-icons/fi";

const TopbarToggle: FC = () => {
    const {toggleOpen} = useSidebar();

    return (
        <Button
            onClick={toggleOpen}
            rounded="full"
            variant="clear"
            size="lg"
            className="md:hidden px-6">
            <FiMenu className="size-6"/>
        </Button>
    );
}

export default TopbarToggle;