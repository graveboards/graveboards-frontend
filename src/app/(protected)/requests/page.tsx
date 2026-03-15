import React, {FC} from 'react';
import RequestsContent from "@/components/requests/requests-content";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: 'My Requests | Graveboards',
};

const RequestsPage: FC = () => {
    return (
        <RequestsContent />
    );
};

export default RequestsPage;
