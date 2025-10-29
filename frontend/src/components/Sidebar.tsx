// src/components/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Định nghĩa các liên kết điều hướng
const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Quản lý Xe', href: '/cars' }, // 💡 ĐƯỜNG DẪN ĐẾN MODULE CỦA CHÚNG TA
  { name: 'Yêu cầu bảo hành', href: '/#' },
  { name: 'Linh kiện & Phụ tùng', href: '/#' },
  { name: 'Báo cáo', href: '/#' },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname(); // Hook để biết route hiện tại

  return (
    <nav className="fixed left-0 top-0 w-60 h-full bg-gray-900 text-white p-4 flex flex-col shadow-xl z-10">
      
      {/* 1. Tiêu đề Logo */}
      <div className="text-xl font-bold mb-8 text-indigo-400">
        EV Management
      </div>
      
      {/* 2. Menu chính */}
      <ul className="space-y-3 flex-grow">
        {navItems.map((item) => {
          // Xác định xem đây là route hiện tại hay không để highlight
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');

          return (
            <li key={item.name}>
              <Link 
                href={item.href}
                // Sử dụng Tailwind để tạo hiệu ứng giống hình ảnh
                className={`flex items-center p-3 rounded-lg transition-colors duration-150 font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md' // Màu highlight
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Màu mặc định
                }`}
              >
                {/* 💡 Icon Placeholder (Bạn có thể thay thế bằng React Icons) */}
                <span className="mr-3">{item.name === 'Quản lý Xe' ? '🚗' : '✨'}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      {/* 3. Phần chân Sidebar (Nếu cần) */}
      <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-gray-500">
        Bản quyền &copy; 2025
      </div>
    </nav>
  );
};

export default Sidebar;