// frontend/src/pages/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
// SỬA: Import types và services thực tế
import { WarrantyClaimResponse } from "@/types/claim"; 
import { getAllWarrantyClaims } from "@/services/modules/claimService"; 
import axios from "axios";

// Bỏ các interface mẫu và dữ liệu mẫu không dùng (WarrantyClaimData, initialClaimData, initialOtherSections)
interface OtherSectionItem {
  title: string;
  description: string;
}

const initialOtherSections: OtherSectionItem[] = [
  { title: "Campaigns mới", description: "Theo dõi các chiến dịch triệu hồi mới nhất." },
  { title: "Báo cáo Tháng 10", description: "Thống kê chi phí và yêu cầu bảo hành." },
];


export default function Home() {
  // SỬA: Sử dụng state cho dữ liệu thực tế
  const [claimData, setClaimData] = useState<WarrantyClaimResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherSections, setOtherSections] =
    useState<OtherSectionItem[]>(initialOtherSections);

  const loadClaims = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const data = await getAllWarrantyClaims(); // <--- GỌI API THỰC TẾ
        setClaimData(data);
    } catch (err) {
        console.error("Lỗi tải Claim:", err);
        setError("Không thể tải danh sách Yêu cầu Bảo hành.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
    // Giữ loadNewData (có thể đổi tên thành loadOtherSections) nếu muốn giữ logic cập nhật ô nhỏ
    const timer = setTimeout(() => {
        // Cập nhật lại các mục nhỏ nếu cần
        setOtherSections([
            { title: "Kế hoạch 2025", description: "Đã cập nhật các chiến lược bảo trì năm 2025." },
            { title: "Kho linh kiện", description: "Kiểm tra số lượng phụ tùng tồn kho." },
            { title: "Công cụ EV", description: "Quản lý dụng cụ chuyên dụng cho xe điện." },
        ]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Hàm helper để xác định màu sắc trạng thái
  const getStatusClasses = (status: string) => {
    switch (status.toUpperCase().trim()) {
      case "APPROVED":
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROCESS":
        return "bg-blue-100 text-blue-800";
      case "SENT":
      case "WAITING_APPROVAL":
      case "PENDING":
      case "DRAFT":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) return <Layout><div className="py-20 text-center text-lg text-blue-600">Đang tải Claims...</div></Layout>;
  if (error) return <Layout><div className="p-6 text-red-600 bg-red-100 border border-red-300 rounded-lg">{error}</div></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Thông tin chung về Yêu cầu Bảo hành
      </h1>

      {/* --------------------- Bảng thông tin Chính --------------------- */}
      <div className="main-table-container shadow-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="main-table-head">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">VIN Xe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {claimData.map((item) => (
              <tr
                key={item.id}
                className="bg-white hover:bg-gray-100 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.vehicleVIN}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* Model không có trong response, chỉ có Model nằm trong Vehicle */}
                  {/* Ta tạm thời không có Model. Cần sửa VehicleResponse để có Model */}
                  N/A
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {claimData.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-lg">
                        Không có yêu cầu bảo hành nào.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
        <div className="p-4 flex justify-center border-t border-gray-200">
          <button
            onClick={loadClaims}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
          >
            Tải lại Dữ liệu Claims
          </button>
        </div>
      </div>

      {/* --------------------- Phần Khác (Horizontal Scroll List) --------------------- */}
      {/* ... (Giữ nguyên phần này) ... */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Các Mục Quản Lý Khác
      </h2>

      <div className="flex space-x-6 overflow-x-scroll pb-4 scrollbar-hide">
        {otherSections.map((section, index) => (
          <div
            key={index}
            className="other-section-card-base shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
          >
            {/* Ảnh Placeholder */}
            <div className="w-full h-40 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-5xl text-blue-600">📄</span>
            </div>

            <h3 className="text-base font-bold truncate text-gray-900 group-hover:text-blue-600">
              {section.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {section.description}
            </p>
          </div>
        ))}
        <div className="other-section-card-base shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-5xl text-gray-600">➕</span>
          </div>
          <h3 className="text-base font-bold truncate text-gray-900 group-hover:text-blue-600">
            Thêm Mục Mới
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            Bắt đầu một tác vụ hoặc quy trình quản lý mới.
          </p>
        </div>
      </div>
    </Layout>
  );
}