"use client";

import React, { useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

type SidebarItem = {
  name: string;
  icon: string;
  href: string;
  roles?: Array<"SC Staff" | "SC Technician" | "EVM Staff" | "Admin" | "Customer">;
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const displayName = user?.username ?? "";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sidebarMenuItems: SidebarItem[] = [
    { name: "Dashboard", icon: "🏠", href: "/" },
    { name: "Quản lý Xe", icon: "🚗", href: "#" },
    { name: "Yêu cầu Bảo hành", icon: "📋", href: "#" },
    { name: "Linh kiện & Phụ tùng", icon: "⚙️", href: "#" },
    { name: "Báo cáo", icon: "📊", href: "#" },
    {
      name: "Quản trị Hệ thống",
      icon: "🛠️",
      href: "/admin/users",
      roles: ["Admin", "EVM Staff"],
    },
  ];

  const userRole = user?.role;

  const filteredMenuItems = sidebarMenuItems.filter((item) => {
    if (!item.roles) {
      return true;
    }
    return userRole ? item.roles.includes(userRole) : false;
  });

  const openWidth = "w-60";
  const closedWidth = "w-20";

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      
      {/* --------------------- Navbar (Thanh ngang trên cùng) --------------------- */}
      <header className="app-navbar shadow-md">
          
        {/* Logo và Nút Toggle Sidebar */}
        <div className="flex items-center space-x-3">
          {/* NÚT THU GỌN VỚI ICON BA GẠCH */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-blue-600 hover:bg-gray-200 transition-colors"
            title={isSidebarOpen ? "Thu gọn trình đơn" : "Mở rộng trình đơn"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* VỊ TRÍ CHÈN LOGO - Dùng placeholder Image */}
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png" 
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full bg-blue-500 p-1"
            />
            <span className="text-xl font-bold text-blue-600">
              EV Warranty System
            </span>
          </div>
        </div>
        
        {/* Tên User/Đăng nhập ở góc phải */}
        {isAuthenticated ? (
          <div 
            className="auth-user-info-base bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
            onClick={handleLogout}
          >
            <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
              {displayName}
            </span>
            <div className="user-avatar bg-blue-500 text-white text-sm font-semibold">
              {initial}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-[3px]">
            {/* Đăng ký */}
            <Link href="/register" passHref>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-lg transition-colors">
                Đăng ký
              </button>
            </Link>
            {/* Đăng nhập */}
            <Link href="/login" passHref>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-lg transition-colors">
                Đăng nhập
              </button>
            </Link>
          </div>
        )}
      </header>

      {/* --------------------- Container chính (Sidebar + Nội dung) --------------------- */}
      <div className="pt-16 flex flex-1 overflow-hidden"> 
        {/* Sidebar */}
        <aside
          className={`app-sidebar ${isSidebarOpen ? openWidth : closedWidth} transition-all duration-300 ease-in-out shadow-lg`} 
        >
          {/* Menu Items */}
          <nav className="space-y-1 mt-4">
            {filteredMenuItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-menu-item-base group hover:text-blue-600 hover:bg-blue-100 ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="text-sm truncate">
                      {item.name}
                    </span>
                  )}

                  {/* Tooltip khi Sidebar đóng */}
                  {!isSidebarOpen && (
                    <span className="absolute left-full ml-4 p-2 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Nội dung Chính (Có thể cuộn) */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;