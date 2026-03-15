"use client";

import React from "react";
import {useAuth} from "@/context/auth-context";
import Requests from "@/components/new/requests";
import {Order, RequestSortingEnum} from "@/types/sorting";

const RequestsContent = () => {
    const {user} = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col gap-6">
            <Requests
                title="My Requests"
                defaultFilters={{
                    user_id: {
                        eq: user.id
                    },
                }}
                defaultSorting={[
                    {
                        field: RequestSortingEnum.CreatedAt,
                        order: Order.Descending,
                    }
                ]}
            />
        </div>
    );
};

export default RequestsContent;
