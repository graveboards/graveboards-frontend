"use client";

import React from "react";
import {useAuth} from "@/context/auth-context";
import {MdAdd} from "react-icons/md";
import {useDialog} from "@/hooks/use-dialog";
import {Button} from "@/components/ui/button";
import CreateQueueDialog from "@/components/new/queues/create-queue-dialog";

const CreateQueueButton = () => {
    const {isAdmin} = useAuth();

    const {ref, onOpen, onClose} = useDialog();

    return isAdmin && (
        <div className="flex items-center justify-center">
            <Button
                onClick={onOpen}
                size="lg"
                rounded="3xl">
                <MdAdd className="size-6"/>
                Create a queue
            </Button>

            <CreateQueueDialog ref={ref} onClose={onClose}/>
        </div>
    );
};

export default CreateQueueButton;

