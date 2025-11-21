// frontend/src/components/layout/Layout.tsx
"use client";

import React, { useState, ReactNode, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

type SidebarItem = {
  name: string;
  icon: string;
  href: string;
  roles?: Array<"SC_Staff" | "SC_Technician" | "EVM_Staff" | "Admin" | "Customer">;
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // THÊM: State để quản lý việc hiển thị Dropdown Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  // Ref để phát hiện click bên ngoài
  const menuRef = useRef<HTMLDivElement>(null); 

  const displayName = user?.username ?? "";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  // THÊM: Logic để đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);


  const sidebarMenuItems: SidebarItem[] = [
    { name: "Dashboard", icon: "🏠", href: "/" },

    { 
      name: "Quản lý Xe", 
      icon: "🚗", 
      href: "/cars", 
      roles: ["Admin", "EVM_Staff", "SC_Staff", "SC_Technician"], 
    },

    { name: "Yêu cầu Bảo hành", icon: "📋", href: "/admin/claims", 
      roles: ["Admin", "EVM_Staff", "SC_Staff", "SC_Technician"] 
    },

    { 
      name: "Linh kiện & Phụ tùng", 
      icon: "⚙️", 
      href: "/admin/parts", 
      roles: ["Admin", "EVM_Staff"], 
    },

    { name: "Báo cáo", icon: "📊", href: "#" },
    {
      name: "Quản trị Hệ thống",
      icon: "🛠️",
      href: "/admin/users",
      roles: ["Admin", "EVM_Staff"],
    },
  ];

  const userRole = user?.role;

  const filteredMenuItems = sidebarMenuItems.filter((item) => {
    if (!item.roles) {
      return true;
    }
    return userRole ? item.roles.includes(userRole) : false;
  });

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center justify-between px-4 z-50 shadow-md">
        <div className="flex items-center space-x-3">
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
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold">EV</span>
            </div>
            <span className="text-xl font-bold text-blue-600">
              EV Warranty System
            </span>
          </div>
        </div>
        
        {isAuthenticated ? (
          // THÊM: ref và position relative cho dropdown
          <div 
            className="relative"
            ref={menuRef} 
          >
            <div
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                // SỬA LỖI: Chỉ toggle menu, không gọi logout ở đây
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
            >
                <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                  {displayName}
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-semibold flex items-center justify-center">
                  {initial}
                </div>
            </div>

            {/* DROP DOWN MENU */}
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 border-b mb-1 truncate">
                        {user?.role}
                    </div>
                    {/* OPTION 1: Thông tin tài khoản (Placeholder) */}
                    <Link href="/profile" passHref legacyBehavior>
                        <a 
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Thông tin tài khoản
                        </a>
                    </Link>
                    {/* OPTION 2: Đăng xuất */}
                    <a 
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        Đăng xuất
                    </a>
                </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-[3px]">
            
            <Link href="/login" passHref>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-lg transition-colors">
                Đăng nhập
              </button>
            </Link>
          </div>
        )}
      </header>

      {/* Container chính */}
      <div className="pt-16 flex flex-1 overflow-hidden"> 
        {/* Sidebar */}
        <aside
          className={`fixed top-16 bottom-0 left-0 bg-white overflow-hidden flex flex-col ${
            isSidebarOpen ? "w-60" : "w-20"
          } transition-all duration-300 ease-in-out shadow-lg z-40`} 
        >
          <nav className="space-y-1 mt-4 p-4">
            {filteredMenuItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative group hover:text-blue-600 hover:bg-blue-100 ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="text-sm truncate">
                      {item.name}
                    </span>
                  )}

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

        {/* Nội dung Chính */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-20"
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;