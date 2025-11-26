// frontend/src/components/layout/SidebarAdmin.tsx (Đã sửa đổi mảng menu)

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
        { name: "Quản lý Khách hàng", href: "/admin/customers", icon: "👥" },
        
        // --- CHUỖI NGHIỆP VỤ (CLAIMS & PARTS) ---
        { name: "Quản lý Xe", href: "/admin/vehicles", icon: "🚗" },
        { name: "Yêu cầu Bảo hành (Claims)", href: "/admin/claims", icon: "📄" }, 
        { name: "Chính sách Bảo hành", href: "/admin/policies", icon: "🛡️" },
        // --- MODULE HỖ TRỢ VÀ TỒN KHO ---
        { name: "Quản lý Linh kiện/Tồn kho", href: "/admin/parts", icon: "🔧" }, 
        { name: "Quản lý Trung tâm Dịch vụ", href: "/admin/centers", icon: "📍" },
        { name: "Chiến dịch", href: "/admin/campaigns", icon: "📣" }, 
        { name: "Quản lý Hóa đơn", href: "/admin/invoices", icon: "🧾" }, // Thêm Hóa đơn
        
        // --- KHÁC ---
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
                    ${active ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"}
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