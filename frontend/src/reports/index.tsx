"use client";

import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { ReportResponse, ReportRequest } from "@/types/report"; 
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

// IMPORT SERVICE
import { getAllReports, getReportsByDateRange, createReport, updateReport, deleteReport, getReportById } from "@/services/modules/reportService";
// IMPORT FORM MỚI
import ReportForm from "@/reports/ReportForm"; 


// ReportTable component với Edit và Delete
interface ReportTableProps {
    reports: ReportResponse[];
    onEdit: (report: ReportResponse) => void;
    onDelete: (id: number) => void;
    onViewDetail: (id: number) => void;
    canModify: boolean;
}

const ReportTable: React.FC<ReportTableProps> = ({ reports, onEdit, onDelete, onViewDetail, canModify }) => {
    // ... (Giữ nguyên nội dung)
    const getStatusClasses = (status: string) => {
        switch (status.toUpperCase()) {
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "IN_PROCESS":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };
    
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Claim ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Ngày Report</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Technician</th>
                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-blue-800">Tổng Chi phí</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Trạng thái</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-blue-800">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {reports.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{r.id}</td>
                            <td className="px-4 py-3 text-sm text-blue-600 font-mono">{r.claimId}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{r.reportDate}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{r.technicianName}</td>
                            <td className="px-4 py-3 text-sm font-medium text-right text-green-700">
                                {r.totalCalculatedCost.toLocaleString('vi-VN')} VND
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(r.status)}`}>
                                    {r.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={() => onViewDetail(r.id)}
                                        className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                                    >
                                        Xem
                                    </button>
                                    {canModify && (
                                        <>
                                            <button
                                                onClick={() => onEdit(r)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => onDelete(r.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {reports.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                                Không tìm thấy báo cáo nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
// ... (Hết ReportTable component)


export default function ReportsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [reports, setReports] = useState<ReportResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState<ReportResponse | null>(null); // Report đang được chỉnh sửa
    
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    const allowedRoles = ["Admin", "EVM_Staff", "SC_Staff", "SC_Technician"]; 
    
    // Phân quyền: Chỉ SC Staff/Technician mới có thể tạo/sửa/xóa report
    const canModify = user?.role === "SC_Staff" || user?.role === "SC_Technician";
    const canView = allowedRoles.includes(user?.role || "");

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedRoles.includes(user.role)) { router.push("/"); return; }
        
        loadReports();
    }, [isAuthenticated, user, router]);

    const loadReports = async (start?: string, end?: string) => {
        if (!user) return;
        setIsLoading(true);
        setToast(null);
        try {
            let data: ReportResponse[];
            if (start && end) {
                data = await getReportsByDateRange(start, end);
            } else {
                data = await getAllReports();
            }
            setReports(data);
        } catch(err) {
            console.error("Lỗi tải báo cáo:", err);
            let errorMessage = "Không thể tải danh sách Báo cáo.";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (axios.isAxiosError(err)) {
                if (!err.response) {
                    errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend có đang chạy không.";
                } else {
                    errorMessage = err.message || errorMessage;
                }
            }
            setToast(errorMessage);
            setReports([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveReport = async (payload: ReportRequest) => {
        try {
            if (editingReport) {
                // Cập nhật report
                await updateReport(editingReport.id, payload);
                setToast("Cập nhật Báo cáo thành công!");
            } else {
                // Tạo mới report
                await createReport(payload);
                setToast("Tạo Báo cáo thành công!");
            }
            await loadReports();
            setIsModalOpen(false);
            setEditingReport(null);
        } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message 
                ? err.response.data.message 
                : `Lỗi khi ${editingReport ? 'cập nhật' : 'tạo'} Báo cáo. Kiểm tra Claim ID, Vehicle ID, Center ID và Technician ID.`;
            throw new Error(errorMessage);
        }
    }

    const handleEditReport = async (report: ReportResponse) => {
        try {
            // Load đầy đủ thông tin report để edit
            const fullReport = await getReportById(report.id);
            setEditingReport(fullReport);
            setIsModalOpen(true);
        } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message 
                ? err.response.data.message 
                : "Không thể tải thông tin báo cáo để chỉnh sửa.";
            setToast(errorMessage);
        }
    }

    const handleDeleteReport = async (id: number) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa Báo cáo #${id}?`)) return;
        
        try {
            await deleteReport(id);
            setToast("Đã xóa Báo cáo thành công!");
            await loadReports();
        } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message 
                ? err.response.data.message 
                : "Lỗi khi xóa Báo cáo.";
            setToast(errorMessage);
        }
    }

    const handleSearch = () => {
        if (!dateRange.start || !dateRange.end) {
            setToast("Vui lòng chọn cả Ngày Bắt đầu và Ngày Kết thúc.");
            return;
        }
        loadReports(dateRange.start, dateRange.end);
    }
    
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    if (isLoading || !user) return <Layout><p>Đang tải dữ liệu...</p></Layout>;

    return (
        <Layout>
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý & Xem Báo cáo</h1>
                <p className="text-gray-600 mt-1">Tổng hợp dữ liệu từ các Report đã hoàn thành.</p>
            </div>
            
            {/* Thanh Tìm kiếm/Lọc và Nút Tạo mới */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 flex space-x-4 items-end justify-between">
                <div className="flex space-x-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Từ Ngày</label>
                        <input 
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(p => ({...p, start: e.target.value}))}
                            className="w-44 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Đến Ngày</label>
                        <input 
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(p => ({...p, end: e.target.value}))}
                            className="w-44 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Tìm kiếm
                    </button>
                    <button
                        onClick={() => { setDateRange({start: '', end: ''}); loadReports(); }}
                        className="bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-500 transition-colors"
                    >
                        Tải lại
                    </button>
                </div>
                
                {/* Nút Tạo Báo cáo - Chỉ SC Staff/Technician */}
                {canModify && (
                    <button
                        onClick={() => {
                            setEditingReport(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors"
                    >
                        + Tạo Báo cáo
                    </button>
                )}
            </div>

            {/* Bảng dữ liệu */}
            <ReportTable 
                reports={reports} 
                onEdit={handleEditReport}
                onDelete={handleDeleteReport}
                onViewDetail={(id) => router.push(`/reports/${id}`)}
                canModify={canModify}
            />
            
            {/* Modal Tạo/Cập nhật Báo cáo */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                        <ReportForm
                            initialData={editingReport}
                            initialClaimId={editingReport?.claimId || 0} 
                            initialVehicleId={editingReport?.vehicleId || 0} 
                            initialCenterId={editingReport?.centerId || 0} 
                            currentUserId={user.id}
                            currentUsername={user.username}
                            onSubmit={handleSaveReport}
                            onClose={() => {
                                setIsModalOpen(false);
                                setEditingReport(null);
                            }}
                        />
                    </div>
                </div>
            )}
            
            {/* Toast thông báo */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg transition-opacity duration-300">
                    {toast}
                </div>
            )}
        </Layout>
    );
}