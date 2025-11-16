// frontend/src/components/layout/Layout.tsx

"use client";  // NOTE: Giữ nguyên - Đảm bảo client-side rendering cho hooks như useState, useAuth

import React, { useState, ReactNode } from "react"; 
import Image from "next/image"; 
import { useAuth } from "../../../context/AuthContext"; // Import useAuth hook
import { useRouter } from "next/navigation";  // NOTE: Mới thêm - Thay next/router bằng next/navigation (cho Next.js 13+ App Router, tránh deprecation warning)
import Link from "next/link";  // NOTE: Giữ nguyên - Đã có, dùng cho menu links

// Giả định kiểu cho các props của Layout
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sử dụng useAuth hook để lấy thông tin người dùng
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();  // NOTE: Giữ nguyên - Bây giờ dùng next/navigation

  const displayName = user?.username ?? "";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  // Hàm xử lý Logout
  const handleLogout = () => {
      logout();
      router.push('/login'); // Chuyển hướng về trang đăng nhập sau khi logout
  };

  // NOTE: Mới thêm - Cập nhật sidebarMenuItems với href đúng routes cho từng menu (dựa trên hệ thống EV Warranty: Dashboard /, Quản lý Xe /vehicles, Yêu cầu Bảo hành /warranty, Linh kiện & Phụ tùng /parts, Báo cáo /reports)
  const sidebarMenuItems = [
    { name: "Dashboard", icon: "🏠", href: "/" },
    { name: "Quản lý Xe", icon: "🚗", href: "/vehicles" },
    { name: "Yêu cầu Bảo hành", icon: "📋", href: "/warranty" },
    { name: "Linh kiện & Phụ tùng", icon: "⚙️", href: "/parts" },  // NOTE: Mới thêm - Link trực tiếp đến /parts cho module Parts & Inventory
    { name: "Báo cáo", icon: "📊", href: "/reports" },  // NOTE: Mới thêm - Link đến /reports cho module Reports Dashboard
  ];
  
  const openWidth = "w-60";
  const closedWidth = "w-20";
  
  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      
      {/* --------------------- Navbar (Thanh ngang trên cùng) --------------------- */}
      {/* NOTE: Mới thêm - Thêm class Tailwind cho header để fixed top và full width */}
      <header className="app-navbar shadow-md fixed top-0 left-0 right-0 z-50 bg-white">  {/* NOTE: Mới thêm - fixed top-0 để navbar cố định, z-50 để overlay sidebar */}
          
          {/* Logo và Nút Toggle Sidebar */}
          <div className="flex items-center space-x-3 px-4 py-3">  {/* NOTE: Mới thêm - padding px-4 py-3 cho navbar */}
              {/* NÚT THU GỌN VỚI ICON BA GẠCH */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-blue-600 hover:bg-gray-200 transition-colors"
                title={isSidebarOpen ? "Thu gọn trình đơn" : "Mở rộng trình đơn"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* VỊ TRÍ CHÈN LOGO - Dùng placeholder Image */}
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo.png" 
                  alt="EV Warranty System Logo"
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
              <div className="auth-user-info-base bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors flex items-center px-4"
                  onClick={handleLogout}> {/* BƯỚC 2: Gọi hàm handleLogout thực tế */}
                <span className="text-sm font-semibold text-gray-700 hidden sm:inline mr-2">
                  {displayName}
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {initial} 
                </div>
              </div>
          ) : (
              <div className="flex items-center gap-[3px] px-4">  {/* NOTE: Mới thêm - padding px-4 cho alignment */}
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
      <div className="pt-16 flex flex-1 overflow-hidden">  {/* NOTE: pt-16 để offset navbar height (4rem ~ 64px) */}
        {/* Sidebar */}
        <aside
          className={`app-sidebar ${isSidebarOpen ? openWidth : closedWidth} transition-all duration-300 ease-in-out shadow-lg bg-white fixed h-full z-40 overflow-y-auto`}  // NOTE: Mới thêm - bg-white fixed h-full z-40 cho sidebar cố định và scrollable
        >
          {/* Menu Items */}
          <nav className="space-y-1 mt-4 px-2">  {/* NOTE: Mới thêm - px-2 cho padding sidebar */}
            {sidebarMenuItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}  // NOTE: Mới thêm - Sử dụng Link thay <a> để SPA navigation (tránh full reload)
                className="sidebar-menu-item-base group hover:text-blue-600 hover:bg-blue-100 block py-2 px-3 rounded transition-colors"  // NOTE: Mới thêm - block py-2 px-3 rounded cho styling Link như button
              >
                <span className="text-xl inline-block mr-3">{item.icon}</span>  {/* NOTE: Mới thêm - mr-3 để space icon-text */}
                {isSidebarOpen && (
                  <span className="text-sm truncate">
                      {item.name}
                  </span>
                )}
                
                {/* Tooltip khi Sidebar đóng */}
                {!isSidebarOpen && (
                  <span className="absolute left-full ml-4 p-2 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Nội dung Chính (Có thể cuộn) */}
        {/* NOTE: Mới thêm - ml-[w-60 or w-20] động dựa trên sidebar width để tránh overlap */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50 ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;