'use client'

import {FC} from "react";
import {Request} from "@/types/request";
import GridRequestCard from "@/components/requests/cards/grid/grid-request-card";
import ListRequestCard from "@/components/requests/cards/list/list-request-card";

interface RequestPanelProps {
    request: Request;
    view: "list" | "grid";
    editMode?: boolean;
}

const RequestCard: FC<RequestPanelProps> = ({request, view, editMode = false}) => {
    return view === "grid" ? (
        <GridRequestCard request={request}/>
    ) : (
        <ListRequestCard request={request} editMode={editMode}/>
    );
}

export default RequestCard;
