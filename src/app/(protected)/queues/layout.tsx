import React from 'react';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Queues | Graveboards',
};

const Layout = async ({children}: {children: React.ReactNode}) => children;

export default Layout;