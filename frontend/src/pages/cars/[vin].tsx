// frontend/src/pages/cars/[vin].tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { VehicleResponse } from '@/types/vehicle';
import { VehiclePartHistoryResponse } from '@/types/vehiclePartHistory';
import { getVehicleByVIN } from '@/services/modules/vehicleService';
import { getHistoryByVehicleId } from '@/services/modules/vehiclePartHistoryService';
import axios from 'axios';

// Component con để hiển thị lịch sử
const HistoryTable: React.FC<{history: VehiclePartHistoryResponse[]}> = ({ history }) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <h3 className="px-6 py-4 text-lg font-bold text-gray-800">Lịch sử Linh kiện ({history.length})</h3>
        {history.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">
                <p className="text-lg">Chưa có lịch sử linh kiện nào cho xe này.</p>
                <p className="text-sm mt-2">Lịch sử sẽ được cập nhật khi có linh kiện được lắp đặt thông qua các yêu cầu bảo hành.</p>
            </div>
        ) : (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Serial Number</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Claim ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái Claim</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ngày Lắp đặt</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {history.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">{record.id}</td>
                            <td className="px-6 py-4 text-sm text-indigo-600 font-mono">{record.partSerialNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                <a href={`/claims/${record.claimId}`} className="hover:underline">#{record.claimId}</a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.claimStatus}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {record.dateInstalled ? new Date(record.dateInstalled).toLocaleDateString('vi-VN') : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
);


export default function CarDetailPage() {
    const router = useRouter();
    const { vin } = router.query;
    const { isAuthenticated } = useAuth();
    
    const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
    const [history, setHistory] = useState<VehiclePartHistoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const vehicleVIN = typeof vin === 'string' ? vin : null;

    const fetchData = useCallback(async () => {
        if (!vehicleVIN) return;
        setIsLoading(true);
        setError('');
        try {
            // 1. Lấy thông tin xe
            const vehicleData = await getVehicleByVIN(vehicleVIN);
            setVehicle(vehicleData);

            // 2. Lấy lịch sử linh kiện theo Vehicle ID (có thể không có lịch sử)
            try {
                const historyData = await getHistoryByVehicleId(vehicleData.id);
                setHistory(historyData || []);
            } catch (historyError) {
                console.warn("Không thể tải lịch sử linh kiện:", historyError);
                // Nếu không load được history, vẫn hiển thị thông tin xe nhưng history rỗng
                setHistory([]);
            }

        } catch (e: unknown) {
            console.error("Lỗi tải chi tiết xe:", e);
            let errorMessage = "Không thể tải thông tin xe hoặc lịch sử linh kiện.";
            if (e instanceof Error) {
                errorMessage = e.message;
            } else if (axios.isAxiosError(e)) {
                if (!e.response) {
                    errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend có đang chạy không.";
                } else if (e.response.status === 404) {
                    errorMessage = `Không tìm thấy xe với VIN: ${vehicleVIN}`;
                } else if (e.response.data?.message) {
                    errorMessage = e.response.data.message;
                } else {
                    errorMessage = e.message || errorMessage;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [vehicleVIN]);

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        fetchData();
    }, [isAuthenticated, fetchData, router]);


    if (isLoading) return (
        <Layout>
            <div className="py-20 text-center text-lg text-blue-600">
                Đang tải thông tin xe...
            </div>
        </Layout>
    );
    
    if (error) return (
        <Layout>
            <div className="p-6 text-red-600 bg-red-100 border border-red-300 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Lỗi</h2>
                <p className="mb-4">{error}</p>
                <div className="flex gap-4">
                    <button
                        onClick={fetchData}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={() => router.push('/cars')}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Quay lại danh sách xe
                    </button>
                </div>
            </div>
        </Layout>
    );
    
    if (!vehicle) return (
        <Layout>
            <div className="p-6 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg">
                <p className="mb-4">Không tìm thấy xe.</p>
                <button
                    onClick={() => router.push('/cars')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Quay lại danh sách xe
                </button>
            </div>
        </Layout>
    );


    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Chi tiết Xe: {vehicle.model}</h1>
                <p className="text-gray-600">VIN: <span className="font-mono font-semibold text-blue-700">{vehicle.vin}</span></p>

                {/* Thông tin Cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border space-y-2">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Thông tin Chủ sở hữu</h2>
                        <p><strong>Khách hàng:</strong> {vehicle.customerName}</p>
                        <p><strong>Năm sản xuất:</strong> {vehicle.year}</p>
                        <p><strong>Trạng thái ĐK:</strong> <span className={`font-semibold ${vehicle.registrationStatus === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>{vehicle.registrationStatus}</span></p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-md border space-y-2">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Hành động</h2>
                        <a href={`/claims/new?vin=${vehicle.vin}`} className="block text-green-600 hover:text-green-700 font-semibold underline">
                            Tạo Yêu cầu Bảo hành mới
                        </a>
                        <p className="text-sm text-gray-500 pt-2">Người đăng ký: {vehicle.registeredByUsername || 'N/A'}</p>
                    </div>
                </div>

                {/* Bảng Lịch sử Linh kiện */}
                <HistoryTable history={history} />
                
            </div>
        </Layout>
    );
}