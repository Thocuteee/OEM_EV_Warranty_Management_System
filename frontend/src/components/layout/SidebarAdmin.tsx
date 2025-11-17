"use client";

    import React from "react";
    import Link from "next/link";
    import { useRouter } from "next/router";
    import { useAuth } from "@/context/AuthContext";

    export default function SidebarAdmin() {
    const router = useRouter();
    const { logout } = useAuth();

    const menu = [
        { name: "Dashboard", href: "/admin", icon: "📊" },
        { name: "Quản lý Users", href: "/admin/users", icon: "👤" },
        { name: "Chiến dịch", href: "/admin/campaigns", icon: "🚗" },
        { name: "Claim", href: "/admin/claims", icon: "📩" },
        { name: "Cấu hình", href: "/admin/system", icon: "⚙️" },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r shadow-md fixed left-0 top-0">
        <div className="p-5 font-bold text-xl text-blue-600 border-b">
            Admin Panel
        </div>

        <nav className="p-4 space-y-2">
            {menu.map((m) => {
            const active = router.pathname === m.href;

            return (
                <Link
                key={m.href}
                href={m.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg
                    ${active ? "bg-blue-100 text-blue-700" : "text-gray-700"}
                    hover:bg-blue-50`}
                >
                <span>{m.icon}</span>
                <span>{m.name}</span>
                </Link>
            );
            })}
        </nav>

        <button
            onClick={logout}
            className="m-4 w-[90%] bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
            Đăng xuất
        </button>
        </aside>
    );
}