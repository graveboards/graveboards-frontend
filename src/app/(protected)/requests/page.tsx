import React from 'react';
import RequestsContent from "@/components/requests/requests-content";
import type {Metadata} from "next";
import PageContent from "@/components/new/layout/page-content";

export const metadata: Metadata = {
    title: 'My Requests | Graveboards',
};

const RequestsPage = () => (
    <PageContent>
        <RequestsContent/>
    </PageContent>
);

export default RequestsPage;
