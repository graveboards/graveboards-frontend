import type {Metadata} from "next";
import {Nunito} from "next/font/google";
import "./globals.css";
import {SidebarProvider} from "@/providers/SidebarProvider";
import Sidebar from "@/components/layout/Sidebar";

const nunito = Nunito({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graveboards",
  description: "A safe place for forgotten osu! beatmaps and scores"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-white text-black dark:bg-black dark:text-white ${nunito.className} antialiased`}
      >
      <SidebarProvider>
      <div className="flex">
          <Sidebar/>
          <div className="flex-1">
              {/*<Topbar/>*/}
              <div className="px-5 pb-5">
                  {children}
              </div>
          </div>
      </div>
      </SidebarProvider>
      </body>
    </html>
  );
}
