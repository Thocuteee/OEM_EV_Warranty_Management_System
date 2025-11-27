// frontend/src/pages/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { WarrantyClaimResponse } from "@/types/claim"; 
import { getAllWarrantyClaims } from "@/services/modules/claimService"; 
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Link from "next/link"; // Cần thiết để tạo link trên thẻ

interface OtherSectionItem {
    title: string;
    description: string;
    href?: string; 
}

// Hàm helper để xác định icon dựa trên tiêu đề
const getSectionIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("campaign")) return "📢";
    if (t.includes("báo cáo") || t.includes("kế hoạch")) return "📊";
    // Thêm icon cho Linh kiện / Tồn kho
    if (t.includes("kho linh kiện") || t.includes("tồn kho")) return "📦"; 
    if (t.includes("công cụ")) return "🔧";
    return "📄"; // Default
};

const initialOtherSections: OtherSectionItem[] = [
    { 
        title: "Campaigns mới", 
        description: "Theo dõi các chiến dịch triệu hồi mới nhất.", 
        href: "/admin/campaigns" 
    },
    { 
        title: "Báo cáo & Thống kê", 
        description: "Thống kê chi phí, tỷ lệ lỗi và dự báo bảo hành." ,
        href: "/admin/research"
    },
    // THÊM: Mục liên quan đến tồn kho, trỏ đến trang quản lý mới
    { 
        title: "Tồn kho Linh kiện", 
        description: "Xem nhanh các linh kiện cần bổ sung và tình trạng nhập kho Serial.",
        href: "/admin/parts" // <--- Dẫn đến trang quản lý mới
    },
];


export default function Home() {
    const [claimData, setClaimData] = useState<WarrantyClaimResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [otherSections, setOtherSections] = useState<OtherSectionItem[]>(initialOtherSections);
    const { isAuthenticated } = useAuth();

    const loadClaims = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllWarrantyClaims(); // <--- GỌI API THỰC TẾ
            setClaimData(data);
        } catch (err) {
            console.error("Lỗi tải Claim:", err);
            let errorMessage = "Không thể tải danh sách Yêu cầu Bảo hành.";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (axios.isAxiosError(err)) {
                if (!err.response) {
                    errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend có đang chạy không.";
                } else {
                    errorMessage = err.message || errorMessage;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setError("Vui lòng đăng nhập để xem dữ liệu.");
            setIsLoading(false);
            return;
        }
        loadClaims();
        
        // Cập nhật các mục sau 2 giây (giữ nguyên logic demo của bạn)
        const timer = setTimeout(() => {
            setOtherSections([
                { title: "Kế hoạch 2025", description: "Đã cập nhật các chiến lược bảo trì năm 2025.", href: "#" },
                { title: "Kho linh kiện", description: "Kiểm tra số lượng phụ tùng tồn kho.", href: "/admin/parts" },
                { title: "Công cụ EV", description: "Quản lý dụng cụ chuyên dụng cho xe điện.", href: "#" },
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
    
    // Giao diện Table Header đã được làm rõ và đậm hơn
    const tableHeaderClasses = "px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider";


    if (isLoading) return <Layout><div className="py-20 text-center text-lg text-blue-600">Đang tải Claims...</div></Layout>;
    if (error) return (
        <Layout>
            <div className="p-6 text-red-600 bg-red-100 border border-red-300 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Lỗi tải dữ liệu</h2>
                <p className="mb-4">{error}</p>
                <button
                    onClick={loadClaims}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Thử lại
                </button>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Thông tin chung về Yêu cầu Bảo hành
            </h1>

            {/* --------------------- Bảng thông tin Chính (Styled) --------------------- */}
            <div className="main-table-container shadow-xl">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="main-table-head bg-blue-50">
                    <tr>
                    <th className={tableHeaderClasses}>ID</th>
                    <th className={tableHeaderClasses}>VIN Xe</th>
                    <th className={tableHeaderClasses}>Model</th> 
                    <th className={tableHeaderClasses}>Khách hàng</th>
                    <th className={tableHeaderClasses}>Trạng thái</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {claimData.map((item) => (
                    <tr
                        key={item.id}
                        className="bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/claims/${item.id}`}
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {item.vehicleVIN}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {item.vehicleModel || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors"
                    >
                        Tải lại Dữ liệu Claims
                    </button>
                </div>
            </div>

            {/* --------------------- Phần Các Mục Quản Lý Khác (Styled) --------------------- */}
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Các Mục Quản Lý Khác
            </h2>

            <div className="flex space-x-6 overflow-x-scroll pb-4 scrollbar-hide">
                {otherSections.map((section, index) => (
                    <Link key={index} href={section.href || "#"} passHref legacyBehavior>
                        <a 
                            className="other-section-card-base shadow-lg hover:shadow-xl transition-shadow cursor-pointer group hover:border-blue-300"
                        >
                            {/* Icon động */}
                            <div className="w-full h-40 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-5xl text-blue-600">
                                    {getSectionIcon(section.title)}
                                </span>
                            </div>

                            <h3 className="text-base font-bold truncate text-gray-900 group-hover:text-blue-600">
                                {section.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {section.description}
                            </p>
                        </a>
                    </Link>
                ))}
                {/* Thẻ Thêm Mục Mới */}
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