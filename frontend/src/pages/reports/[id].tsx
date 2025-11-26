"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { ReportResponse } from '@/types/report';
import { getReportById } from '@/services/modules/reportService';
import axios from 'axios';

export default function ReportDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user, isAuthenticated } = useAuth();
    
    const reportId = typeof id === 'string' ? parseInt(id) : null;
    
    const [report, setReport] = useState<ReportResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
    }, [isAuthenticated, router]);

    const fetchReport = useCallback(async () => {
        if (!reportId) return;
        setIsLoading(true);
        setError('');
        try {
            const reportData = await getReportById(reportId);
            setReport(reportData);
        } catch (e: unknown) {
            console.error("Lỗi tải báo cáo:", e);
            let errorMessage = "Không thể tải thông tin báo cáo.";
            if (axios.isAxiosError(e) && e.response) {
                if (e.response.status === 404) {
                    errorMessage = "Không tìm thấy báo cáo với ID này.";
                } else if (e.response.data?.message) {
                    errorMessage = e.response.data.message;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [reportId]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    if (isLoading) {
        return (
            <Layout>
                <div className="py-20 text-center text-lg text-blue-600">
                    Đang tải thông tin báo cáo...
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="p-6 text-red-600 bg-red-100 border border-red-300 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Lỗi</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => router.push('/reports')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Quay lại danh sách báo cáo
                    </button>
                </div>
            </Layout>
        );
    }

    if (!report) {
        return (
            <Layout>
                <div className="p-6 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg">
                    <p>Không tìm thấy báo cáo.</p>
                    <button
                        onClick={() => router.push('/reports')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Quay lại danh sách báo cáo
                    </button>
                </div>
            </Layout>
        );
    }

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
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Chi tiết Báo cáo #{report.id}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Thông tin chi tiết về báo cáo công việc
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/reports')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        ← Quay lại
                    </button>
                </div>

                {/* Thông tin chính */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Thông tin cơ bản */}
                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin cơ bản</h2>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-semibold text-gray-600">ID Báo cáo:</span>
                                <p className="text-lg font-bold text-gray-900">{report.id}</p>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-600">Claim ID:</span>
                                <p className="text-lg text-gray-900">{report.claimId}</p>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-600">Trạng thái:</span>
                                <p className="mt-1">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(report.status)}`}>
                                        {report.status}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-600">Ngày báo cáo:</span>
                                <p className="text-gray-900">{new Date(report.reportDate).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Thông tin kỹ thuật viên và trung tâm */}
                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin thực hiện</h2>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-semibold text-gray-600">Kỹ thuật viên:</span>
                                <p className="text-lg text-gray-900">{report.technicianName}</p>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-600">Trung tâm ID:</span>
                                <p className="text-gray-900">{report.centerId}</p>
                            </div>
                            {report.vehicleId && (
                                <div>
                                    <span className="text-sm font-semibold text-gray-600">Vehicle ID:</span>
                                    <p className="text-gray-900">{report.vehicleId}</p>
                                </div>
                            )}
                            {report.campaignId && (
                                <div>
                                    <span className="text-sm font-semibold text-gray-600">Campaign ID:</span>
                                    <p className="text-gray-900">{report.campaignId}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card 3: Thời gian */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Thời gian thực hiện</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Bắt đầu:</span>
                            <p className="text-gray-900">
                                {report.startedAt ? new Date(report.startedAt).toLocaleString('vi-VN') : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Kết thúc:</span>
                            <p className="text-gray-900">
                                {report.finishedAt ? new Date(report.finishedAt).toLocaleString('vi-VN') : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 4: Chi phí */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Chi phí</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Chi phí linh kiện:</span>
                            <p className="text-lg font-bold text-blue-600">
                                {report.partCost.toLocaleString('vi-VN')} VND
                            </p>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Chi phí thực tế:</span>
                            <p className="text-lg font-bold text-green-600">
                                {report.actualCost.toLocaleString('vi-VN')} VND
                            </p>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Tổng chi phí:</span>
                            <p className="text-lg font-bold text-red-600">
                                {report.totalCalculatedCost.toLocaleString('vi-VN')} VND
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 5: Mô tả và hành động */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả và Hành động</h2>
                    <div className="space-y-4">
                        {report.description && (
                            <div>
                                <span className="text-sm font-semibold text-gray-600">Mô tả:</span>
                                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{report.description}</p>
                            </div>
                        )}
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Hành động đã thực hiện:</span>
                            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{report.actionTaken}</p>
                        </div>
                        {report.partUsed && (
                            <div>
                                <span className="text-sm font-semibold text-gray-600">Linh kiện đã sử dụng:</span>
                                <p className="text-gray-900 mt-1">{report.partUsed}</p>
                            </div>
                        )}
                        {report.replacedPart && (
                            <div>
                                <span className="text-sm font-semibold text-gray-600">Linh kiện thay thế:</span>
                                <p className="text-gray-900 mt-1">{report.replacedPart}</p>
                            </div>
                        )}
                        {report.diagnosticCodes && (
                            <div>
                                <span className="text-sm font-semibold text-gray-600">Mã chẩn đoán:</span>
                                <p className="text-gray-900 mt-1 font-mono">{report.diagnosticCodes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 6: Thông tin tạo và cập nhật */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin hệ thống</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Người tạo:</span>
                            <p className="text-gray-900">{report.createdByText}</p>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Ngày tạo:</span>
                            <p className="text-gray-900">
                                {new Date(report.createdDate).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-gray-600">Cập nhật lần cuối:</span>
                            <p className="text-gray-900">
                                {new Date(report.updatedAt).toLocaleString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

