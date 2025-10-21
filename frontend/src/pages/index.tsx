"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
// Cần đảm bảo các type này đã được định nghĩa trong types/warranty.ts
interface WarrantyClaimData {
  id: number;
  vin: string;
  model: string;
  customer: string;
  status: "Đang chờ duyệt" | "Đã duyệt" | "Đã hoàn thành" | "Đang xử lý";
}
interface OtherSectionItem {
  title: string;
  description: string;
}

// Dữ liệu mẫu khởi tạo
const initialClaimData: WarrantyClaimData[] = [
  {
    id: 1,
    vin: "VIN1234567890ABCDE",
    model: "EV-A",
    customer: "Nguyễn Văn A",
    status: "Đang chờ duyệt",
  },
  {
    id: 2,
    vin: "VIN9876543210FGHIJ",
    model: "EV-B",
    customer: "Trần Thị B",
    status: "Đã duyệt",
  },
  {
    id: 3,
    vin: "VIN1122334455KLMNO",
    model: "EV-C",
    customer: "Lê Văn C",
    status: "Đã hoàn thành",
  },
];

const initialOtherSections: OtherSectionItem[] = [
  {
    title: "Campaigns mới",
    description: "Theo dõi các chiến dịch triệu hồi mới nhất.",
  },
  {
    title: "Báo cáo Tháng 10",
    description: "Thống kê chi phí và yêu cầu bảo hành.",
  },
];

export default function Home() {
  const [claimData, setClaimData] =
    useState<WarrantyClaimData[]>(initialClaimData);
  const [otherSections, setOtherSections] =
    useState<OtherSectionItem[]>(initialOtherSections);

  const loadNewData = () => {
    const newData: WarrantyClaimData[] = [
      ...initialClaimData,
      {
        id: 4,
        vin: "VIN5566778899PQRST",
        model: "EV-A",
        customer: "Phạm Thu D",
        status: "Đang xử lý",
      },
      {
        id: 5,
        vin: "VIN1234000001ABCZ",
        model: "EV-B",
        customer: "Nguyễn Đình K",
        status: "Đã duyệt",
      },
      {
        id: 6,
        vin: "VIN5432111111TRUC",
        model: "EV-B",
        customer: "Hoàng Văn S",
        status: "Đang chờ duyệt",
      },
    ];
    setClaimData(newData);

    setOtherSections([
      {
        title: "Kế hoạch 2025",
        description: "Đã cập nhật các chiến lược bảo trì năm 2025.",
      },
      {
        title: "Kho linh kiện",
        description: "Kiểm tra số lượng phụ tùng tồn kho.",
      },
      {
        title: "Công cụ EV",
        description: "Quản lý dụng cụ chuyên dụng cho xe điện.",
      },
    ]);
  };

  useEffect(() => {
    const timer = setTimeout(loadNewData, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Hàm helper để xác định màu sắc trạng thái
  const getStatusClasses = (status: WarrantyClaimData["status"]) => {
    switch (status) {
      case "Đã duyệt":
      case "Đã hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đang xử lý":
        return "bg-blue-100 text-blue-800";
      case "Đang chờ duyệt":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Thông tin chung về Yêu cầu Bảo hành
      </h1>

      {/* --------------------- Bảng thông tin Chính --------------------- */}
      <div className="main-table-container shadow-xl">
        {" "}
        {/* Thêm lại shadow-xl */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="main-table-head">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                VIN Xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Trạng thái
              </th>
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
                  {item.vin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.model}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.customer}
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
          </tbody>
        </table>
        <div className="p-4 flex justify-center border-t border-gray-200">
          <button
            onClick={loadNewData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
          >
            Tải lại / Cập nhật Dữ liệu
          </button>
        </div>
      </div>

      {/* --------------------- Phần Khác (Horizontal Scroll List) --------------------- */}
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
