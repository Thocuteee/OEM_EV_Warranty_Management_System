// frontend/src/pages/admin/research.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "@/components/layout/Layout"; // Sử dụng Layout thay vì AdminLayout
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import axios from "axios"; 

// Import Types cơ bản (đã có)
import { WarrantyClaimResponse } from "@/types/claim";
import { ReportResponse } from "@/types/report";
import { PartResponse } from "@/types/part";

// Import Service functions cơ bản (đã có)
import { getAllWarrantyClaims } from "@/services/modules/claimService";
import { getAllReports } from "@/services/modules/reportService";
import { getAllParts } from "@/services/modules/partService";

// [IMPORT MỚI CẦN THIẾT] Service và Types cho Phân tích Chi phí
import { getMonthlyCostAnalysis, MonthlyCostAnalysis } from "@/services/modules/reportService"; 

// =======================================================
// [COMPONENT BIỂU ĐỒ PLACEHOLDER]
// Thay thế bằng thư viện biểu đồ thực tế (ví dụ: Chart.js, Nivo)
// =======================================================
const CostBarChart: React.FC<{ data: MonthlyCostAnalysis }> = ({ data }) => {
    // Giá trị chi phí Claims tối đa trong năm được chọn (dùng để chia tỉ lệ cột)
    const maxCost = useMemo(() => {
        const costs = Object.values(data);
        return costs.length > 0 ? Math.max(...costs) : 100000000;
    }, [data]);
    
    // Chuyển đổi Map thành mảng dữ liệu có thứ tự 12 tháng
    const chartData = useMemo(() => {
        const labels = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
        
        return labels.map(month => ({
            month: month,
            cost: data[month] || 0,
            formattedCost: (data[month] || 0).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' VND'
        }));
    }, [data]);
    
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Biểu đồ Tổng Chi phí Claims theo Tháng</h3>
            <div className="grid grid-cols-12 gap-1 h-64 border-b border-l pb-6 pt-2 relative items-end">
                {chartData.map((item, index) => (
                    <div 
                        key={item.month} 
                        className="relative flex flex-col items-center justify-end h-full"
                    >
                        <div 
                            className="w-4 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-t cursor-pointer group" 
                            // Tỉ lệ cột dựa trên maxCost
                            style={{ height: `${(item.cost / maxCost) * 100}%` }} 
                            title={item.formattedCost}
                        >
                             {/* Hiển thị giá trị khi hover */}
                             <span className="absolute bottom-full mb-1 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {item.formattedCost}
                            </span>
                        </div>
                        <span className="text-xs text-gray-600 absolute bottom-0 -mb-4">{item.month}</span>
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-500 italic">Giá trị Max: {maxCost.toLocaleString('vi-VN')} VND</p>
        </div>
    );
};
// =======================================================
// [HẾT COMPONENT BIỂU ĐỒ]
// =======================================================


export default function ResearchPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    
    // States cơ bản (đã có)
    const [isLoading, setIsLoading] = useState(true);
    const [claims, setClaims] = useState<WarrantyClaimResponse[]>([]);
    const [reports, setReports] = useState<ReportResponse[]>([]);
    const [parts, setParts] = useState<PartResponse[]>([]);
    
    // States mới cho Phân tích
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [monthlyCost, setMonthlyCost] = useState<MonthlyCostAnalysis>({});
    
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear); 
    
    const allowedRoles = ["Admin", "EVM_Staff"];

    // [HÀM MỚI] Tải dữ liệu phân tích chi phí
    const loadAnalysisData = useCallback(async (year: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMonthlyCostAnalysis(year);
            setMonthlyCost(data);
        } catch (e: unknown) {
            let errorMessage = 'Lỗi tải dữ liệu phân tích chi phí.';
            if (axios.isAxiosError(e)) {
                if (e.response) {
                    if (e.response.status === 404) {
                        errorMessage = 'API phân tích chi phí không tìm thấy. Vui lòng kiểm tra backend.';
                    } else if (e.response.status >= 500) {
                        errorMessage = 'Lỗi máy chủ khi tải dữ liệu phân tích. Vui lòng thử lại sau.';
                    } else {
                        errorMessage = e.response.data?.message || errorMessage;
                    }
                } else if (e.request) {
                    errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend có đang chạy không.';
                } else {
                    errorMessage = e.message || errorMessage;
                }
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }
            setError(errorMessage);
            console.error("Lỗi chi tiết khi tải phân tích chi phí:", e);
        } finally {
            setLoading(false);
        }
    }, []);


    // Tải dữ liệu tổng quan và dữ liệu phân tích
    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedRoles.includes(user.role)) { router.push("/"); return; }

        const loadAllData = async () => {
            setIsLoading(true);
            try {
                 const [claimsData, reportsData, partsData] = await Promise.all([
                    getAllWarrantyClaims(),
                    getAllReports(),
                    getAllParts()
                ]);
                setClaims(claimsData);
                setReports(reportsData);
                setParts(partsData);
            } catch (err) {
                console.error("Lỗi tải dữ liệu tổng quan:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadAllData();
    }, [isAuthenticated, user, router]);
    
    // Tải lại dữ liệu phân tích khi năm thay đổi
    useEffect(() => {
        if (selectedYear) {
            loadAnalysisData(selectedYear);
        }
    }, [selectedYear, loadAnalysisData]);


    // Thống kê theo Status (Giữ nguyên)
    const statusStats = useMemo(() => {
        const stats: Record<string, number> = {};
        claims.forEach(claim => {
            const status = claim.status.toUpperCase();
            stats[status] = (stats[status] || 0) + 1;
        });
        return stats;
    }, [claims]);

    // Thống kê theo Approval Status (Giữ nguyên)
    const approvalStats = useMemo(() => {
        const stats: Record<string, number> = {};
        claims.forEach(claim => {
            const approval = claim.approvalStatus?.toUpperCase() || 'N/A';
            stats[approval] = (stats[approval] || 0) + 1;
        });
        return stats;
    }, [claims]);

    // Tổng chi phí từ Claims (dùng totalCost từ claim, không dùng report)
    const totalCost = useMemo(() => {
         return claims.reduce((sum, c) => sum + (c.totalCost || 0), 0);
    }, [claims]);

    // Thống kê theo Center (Region) (Giữ nguyên)
    const centerStats = useMemo(() => {
        const stats: Record<number, { count: number; cost: number }> = {};
        claims.forEach(claim => {
            const centerId = claim.centerId || 0;
            if (!stats[centerId]) {
                stats[centerId] = { count: 0, cost: 0 };
            }
            stats[centerId].count += 1;
            stats[centerId].cost += claim.totalCost || 0; // Sử dụng totalCost từ Claims
        });
        return stats;
    }, [claims]);

    // Top 5 Parts được sử dụng nhiều nhất (Giữ nguyên - chỉ là placeholder)
    const topParts = useMemo(() => {
         // Cần logic phức tạp hơn (tính tổng số lượng part từ ClaimPart), tạm thời dùng parts slice
        return parts.slice(0, 5);
    }, [parts]);

    // Tỷ lệ lỗi (Failure Rate) (Giữ nguyên)
    const failureRate = useMemo(() => {
        const uniqueVehicles = new Set(claims.map(c => c.vehicleVIN)).size;
        const totalClaims = claims.length;
        return uniqueVehicles > 0 ? ((totalClaims / uniqueVehicles) * 100).toFixed(2) : "0.00";
    }, [claims]);


    if (isLoading) return <Layout><p>Đang tải dữ liệu...</p></Layout>;

    return (
        <Layout>
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Phân tích Chi phí Bảo hành</h1>
                <p className="text-gray-600 mt-1">Thống kê số lượng, tỷ lệ lỗi và dự báo chi phí bảo hành</p>
            </div>

            {/* Khu vực Biểu đồ và Bộ lọc */}
            <div className="bg-white p-6 rounded-xl shadow-md border space-y-6 mb-6">
                
                {/* Bộ lọc Năm */}
                <div className="flex items-center space-x-4 border-b pb-4">
                    <label className="font-semibold text-gray-700">Chọn Năm Phân tích:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="border rounded-lg px-3 py-2 text-sm"
                        disabled={loading}
                    >
                        {/* Danh sách năm từ 2020 đến hiện tại */}
                        {Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    {loading && <p className="text-sm text-blue-500">Đang tải biểu đồ...</p>}
                </div>

                {/* Biểu đồ Phân tích Chi phí */}
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
                <CostBarChart data={monthlyCost} />
                
            </div>
            
            {/* Tổng quan (Giữ nguyên) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="text-sm text-gray-600 mb-1">Tổng số Claims</div>
                    <div className="text-3xl font-bold text-blue-600">{claims.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="text-sm text-gray-600 mb-1">Tổng số Reports</div>
                    <div className="text-3xl font-bold text-green-600">{reports.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="text-sm text-gray-600 mb-1">Tổng Chi phí (VND)</div>
                    <div className="text-3xl font-bold text-red-600">{totalCost.toLocaleString('vi-VN')}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="text-sm text-gray-600 mb-1">Tỷ lệ Lỗi (%)</div>
                    <div className="text-3xl font-bold text-orange-600">{failureRate}%</div>
                </div>
            </div>

            {/* Thống kê chi tiết (Giữ nguyên) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Thống kê theo Trạng thái */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê theo Trạng thái Claim</h2>
                    <div className="space-y-3">
                        {Object.entries(statusStats).map(([status, count]) => (
                            <div key={status} className="flex justify-between items-center">
                                <span className="text-gray-700">{status}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${(count / claims.length) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Thống kê theo Phê duyệt */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê theo Phê duyệt</h2>
                    <div className="space-y-3">
                        {Object.entries(approvalStats).map(([approval, count]) => (
                            <div key={approval} className="flex justify-between items-center">
                                <span className="text-gray-700">{approval}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full" 
                                            style={{ width: `${(count / claims.length) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Thống kê theo Region (Center) */}
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê theo Trung tâm Dịch vụ (Region)</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Center ID</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Số lượng Claims</th>
                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700">Tổng Chi phí (VND)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(centerStats).map(([centerId, stats]) => (
                                <tr key={centerId}>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{centerId}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{stats.count}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-right text-green-700">
                                        {stats.cost.toLocaleString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dự báo Chi phí (Forecast) */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Dự báo Chi phí Bảo hành</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-2">
                        <strong>Chi phí trung bình mỗi Claim:</strong>{" "}
                        {claims.length > 0 
                            ? (totalCost / claims.length).toLocaleString('vi-VN') 
                            : "0"} VND
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>Dự báo chi phí tháng tiếp theo:</strong>{" "}
                        <span className="text-red-600 font-bold">
                            {/* Dự báo đơn giản dựa trên chi phí trung bình và số lượng Claims */}
                            {Math.round((totalCost / (claims.length || 1)) * (claims.length * 0.1)).toLocaleString('vi-VN')} VND
                        </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        * Dự báo dựa trên chi phí trung bình mỗi Claim và tỷ lệ tăng trưởng ước tính 10% số lượng Claims.
                    </p>
                </div>
            </div>
        </Layout>
    );
}