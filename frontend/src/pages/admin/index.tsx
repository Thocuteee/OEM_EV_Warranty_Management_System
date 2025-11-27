"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { UserRole } from "@/types/auth";

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
    { title: "Chiến dịch Triệu hồi", desc: "Recall Campaign", icon: "📢", href: "/campaigns", roles: ["Admin", "EVM_Staff"] },
    { title: "Yêu cầu Bảo hành", desc: "Xử lý yêu cầu bảo hành", icon: "📋", href: "/claims", roles: ["Admin", "EVM_Staff", "SC_Staff", "SC_Technician"] },
    { title: "Chính sách Bảo hành", desc: "Quản lý chính sách bảo hành", icon: "🛡️", href: "/admin/policies", roles: ["Admin", "EVM_Staff"] },
    { title: "Cấu hình Hệ thống", desc: "Backup / Logs / Phân quyền", icon: "⚙️", href: "/admin/system", roles: ["Admin"] },
  ];

  return (
    <Layout>
      <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-700 mt-2">
          Chào <b>{user.username}</b>, hãy chọn chức năng bạn muốn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules
          .filter((m) => m.roles.includes(user.role as UserRole))
          .map((m, i) => (
            <div
              key={i}
              onClick={() => router.push(m.href)}
              className="p-6 bg-white rounded-xl shadow border hover:shadow-xl cursor-pointer transition-shadow"
            >
              <div className="text-5xl mb-4">{m.icon}</div>
              <h3 className="text-xl font-semibold text-blue-600">{m.title}</h3>
              <p className="text-gray-600">{m.desc}</p>
            </div>
          ))}
      </div>
    </Layout>
  );
}