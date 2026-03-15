"use client";

import React from "react";
import {MdAdd} from "react-icons/md";
import {Button} from "@/components/ui/button";
import {useDialog} from "@/hooks/use-dialog";
import RequestDialog from "@/components/new/layout/topbar/request-dialog";

const RequestButton = () => {
    const {ref, onOpen, onClose} = useDialog();

    return (
        <>
            <Button
                onClick={onOpen}
                size="lg"
                rounded="3xl"
                className="shrink-0 xl:min-w-80 lg:min-w-64 min-w-12">
                <MdAdd className="size-6"/>
                <p className="lg:block hidden">Request a Map</p>
            </Button>

            <RequestDialog ref={ref} onClose={onClose}/>
        </>
    );
};

export default RequestButton;

