"use client";

import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { UserRole } from "@/types/warranty";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) router.push("/login");
    if (user && user.role !== "Admin" && user.role !== "EVM_Staff") {
      router.push("/");
    }
  }, [isAuthenticated, user]);

  if (!user) return null;

  const modules = [
    { title: "Quản lý Users", desc: "Tạo / xóa user", icon: "👤", href: "/admin/users", roles: ["Admin"] },
    { title: "Chiến dịch", desc: "Recall Campaign", icon: "🚗", href: "/admin/campaigns", roles: ["Admin", "EVM_Staff"] },
    { title: "Claim", desc: "Xử lý yêu cầu bảo hành", icon: "📩", href: "/admin/claims", roles: ["EVM_Staff"] },
    { title: "Cấu hình", desc: "Backup / Logs / Phân quyền", icon: "⚙️", href: "/admin/system", roles: ["Admin"] },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-700 mt-2 mb-8">
        Chào <b>{user.username}</b>, hãy chọn chức năng bạn muốn.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules
          .filter((m) => m.roles.includes(user.role as UserRole))
          .map((m, i) => (
            <div
              key={i}
              onClick={() => router.push(m.href)}
              className="p-6 bg-white rounded-xl shadow border hover:shadow-xl cursor-pointer"
            >
              <div className="text-5xl mb-4">{m.icon}</div>
              <h3 className="text-xl font-semibold text-blue-600">{m.title}</h3>
              <p className="text-gray-600">{m.desc}</p>
            </div>
          ))}
      </div>
    </AdminLayout>
  );
}
