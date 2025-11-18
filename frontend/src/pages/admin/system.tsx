'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout'; 
import { useAuth } from '@/context/AuthContext'; 
import { useRouter } from 'next/router';

/**
 * Component con cho từng thẻ chức năng trong trang System
 */
interface SystemFeatureCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
}

const SystemFeatureCard: React.FC<SystemFeatureCardProps> = ({ 
  title, description, buttonText, icon, onClick, disabled = false 
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    <div className="mt-4 flex justify-end">
      <button 
        onClick={onClick}
        disabled={disabled}
        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 
                   hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonText}
      </button>
    </div>
  </div>
);


/**
 * Trang chính Quản trị Hệ thống
 */
const AdminSystemPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Chỉ Admin mới được vào trang này
  const allowedRoles: Array<string | undefined> = ['Admin'];

  useEffect(() => {
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') router.push('/login');
      return;
    }
    if (!user || !allowedRoles.includes(user.role)) {
      if (typeof window !== 'undefined') router.push('/'); 
      return;
    }
    // Nếu đã qua kiểm tra
    setIsLoading(false); 
  }, [isAuthenticated, user, router]);

  // Xử lý logic cho các nút (hiện tại là placeholder)
  const handleExport = () => {
    alert("Chức năng 'Xuất CSV' đang được phát triển.");
  };
  
  const handleImport = () => {
    alert("Chức năng 'Nhập CSV' đang được phát triển.");
  };

  const handleViewLogs = () => {
    alert("Chức năng 'Xem Logs' đang được phát triển.");
  };

  const handleToggleMaintenance = () => {
    alert("Chức năng 'Bảo trì' đang được phát triển.");
  };

  // Hiển thị loading trong khi kiểm tra quyền
  if (isLoading || !isAuthenticated || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20 text-sm text-gray-500">
            Đang tải và kiểm tra quyền...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản trị Hệ thống
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Cấu hình các chức năng nâng cao, xuất nhập dữ liệu và xem log hệ thống.
          </p>
        </div>

        {/* Lưới các chức năng */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SystemFeatureCard 
            title="Xuất Dữ liệu (Export)"
            description="Tải về bản sao lưu dữ liệu (Users, Claims, Parts)."
            buttonText="Xuất file CSV"
            icon="📤"
            onClick={handleExport}
          />
          <SystemFeatureCard 
            title="Nhập Dữ liệu (Import)"
            description="Nhập dữ liệu hàng loạt từ file CSV (Xe, Linh kiện...)."
            buttonText="Nhập file CSV"
            icon="📥"
            onClick={handleImport}
          />
          <SystemFeatureCard 
            title="Log Hệ thống"
            description="Xem nhật ký hoạt động của quản trị viên và các lỗi API."
            buttonText="Xem Logs"
            icon="📜"
            onClick={handleViewLogs}
          />
          <SystemFeatureCard 
            title="Chế độ Bảo trì"
            description="Tạm dừng hệ thống để bảo trì. Chỉ Admin có thể truy cập."
            buttonText="Bật/Tắt Bảo trì"
            icon="⚙️"
            onClick={handleToggleMaintenance}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminSystemPage;