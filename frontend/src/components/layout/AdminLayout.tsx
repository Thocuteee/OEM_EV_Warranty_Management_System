    "use client";

    import React from "react";
    import SidebarAdmin from "./SidebarAdmin";

    export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
        <SidebarAdmin />

        <main className="ml-64 w-full min-h-screen bg-gray-50 p-8">
            {children}
        </main>
        </div>
    );
    }
