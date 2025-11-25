"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { getAllWarrantyClaims } from "@/services/modules/claimService";
import { getAllReports } from "@/services/modules/reportService";
import { getAllParts } from "@/services/modules/partService";
import { WarrantyClaimResponse } from "@/types/claim";
import { ReportResponse } from "@/types/report";
import { PartResponse } from "@/types/part";

export default function AnalyticsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    
    const [claims, setClaims] = useState<WarrantyClaimResponse[]>([]);
    const [reports, setReports] = useState<ReportResponse[]>([]);
    const [parts, setParts] = useState<PartResponse[]>([]);

    const allowedRoles = ["Admin", "EVM_Staff"];

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedRoles.includes(user.role)) { router.push("/"); return; }
        
        loadData();
    }, [isAuthenticated, user, router]);

    const loadData = async () => {
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
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Thống kê theo Status
    const statusStats = useMemo(() => {
        const stats: Record<string, number> = {};
        claims.forEach(claim => {
            const status = claim.status.toUpperCase();
            stats[status] = (stats[status] || 0) + 1;
        });
        return stats;
    }, [claims]);

    // Thống kê theo Approval Status
    const approvalStats = useMemo(() => {
        const stats: Record<string, number> = {};
        claims.forEach(claim => {
            const approval = claim.approvalStatus?.toUpperCase() || 'N/A';
            stats[approval] = (stats[approval] || 0) + 1;
        });
        return stats;
    }, [claims]);

    // Tổng chi phí từ Reports
    const totalCost = useMemo(() => {
        return reports.reduce((sum, r) => sum + (r.totalCalculatedCost || 0), 0);
    }, [reports]);

    // Thống kê theo Center (Region)
    const centerStats = useMemo(() => {
        const stats: Record<number, { count: number; cost: number }> = {};
        claims.forEach(claim => {
            const centerId = claim.centerId || 0;
            if (!stats[centerId]) {
                stats[centerId] = { count: 0, cost: 0 };
            }
            stats[centerId].count += 1;
            stats[centerId].cost += claim.totalCost || 0;
        });
        return stats;
    }, [claims]);

    // Top 5 Parts được sử dụng nhiều nhất (từ Reports)
    const topParts = useMemo(() => {
        // Giả sử có thông tin part từ report (cần thêm vào ReportResponse)
        // Tạm thời dùng parts data
        return parts.slice(0, 5);
    }, [parts]);

    // Tỷ lệ lỗi (Failure Rate) - tính theo số claims / tổng số vehicles
    const failureRate = useMemo(() => {
        const uniqueVehicles = new Set(claims.map(c => c.vehicleVIN)).size;
        const totalClaims = claims.length;
        return uniqueVehicles > 0 ? ((totalClaims / uniqueVehicles) * 100).toFixed(2) : "0.00";
    }, [claims]);

    if (isLoading) return <AdminLayout><p>Đang tải dữ liệu...</p></AdminLayout>;

    return (
        <AdminLayout>
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
                <p className="text-gray-600 mt-1">Thống kê số lượng, tỷ lệ lỗi và dự báo chi phí bảo hành</p>
            </div>

            {/* Tổng quan */}
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

            {/* Thống kê theo Trạng thái */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

            {/* Top Parts */}
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 Linh kiện trong Hệ thống</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {topParts.map((part) => (
                        <div key={part.id} className="bg-gray-50 p-4 rounded-lg border">
                            <div className="text-sm text-gray-600 mb-1">{part.name}</div>
                            <div className="text-lg font-bold text-blue-600">{part.partNumber}</div>
                            <div className="text-sm text-gray-500 mt-1">{part.price.toLocaleString('vi-VN')} VND</div>
                        </div>
                    ))}
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
                            {Math.round((totalCost / (claims.length || 1)) * (claims.length * 0.1)).toLocaleString('vi-VN')} VND
                        </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        * Dự báo dựa trên xu hướng hiện tại và tỷ lệ tăng trưởng ước tính 10%
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}

