"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { VehicleResponse } from '@/types/vehicle';
import { WarrantyClaimRequest, WarrantyClaimResponse } from '@/types/claim'; 
import { getVehicleByVIN } from '@/services/modules/vehicleService';
import { createWarrantyClaim } from '@/services/modules/claimService';
import { getClaimById } from '@/services/modules/claimService';
import { ServiceCenterResponse } from '@/types/center'; 
import { getAllServiceCenters } from '@/services/modules/centerService';
import axios from 'axios';


interface ClaimFormProps {
    initialData: {
        vehicle: VehicleResponse;
        centers: ServiceCenterResponse[];
        staffId: number;
    };
    onSuccess: (claim: WarrantyClaimResponse) => void;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ initialData, onSuccess }) => {
    const { vehicle, centers, staffId } = initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formState, setFormState] = useState<WarrantyClaimRequest>({
        staffId: staffId, 
        vehicleId: vehicle.id, 
        customerId: vehicle.customerId, 
        centerId: centers.length > 0 ? centers[0].id : 0, 
        totalCost: 0,
        description: '',
        technicianId: null,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormState(prev => ({
            ...prev,
            [name]: name === 'totalCost' ? (value ? parseFloat(value) : 0) : 
                    name === 'centerId' ? (value ? parseInt(value) : 0) : 
                    value,
        } as WarrantyClaimRequest));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payloadToSend: WarrantyClaimRequest = {
            ...formState,
            totalCost: formState.totalCost || 0,
            technicianId: formState.technicianId || null,
        }
        
        if (!payloadToSend.centerId || payloadToSend.centerId === 0) {
            setError("Vui lòng chọn Trung tâm Dịch vụ.");
            setLoading(false);
            return;
        }
        
        try {
            const newClaim = await createWarrantyClaim(payloadToSend);
            onSuccess(newClaim);
        } catch (err: unknown) {
            let errorMessage = "Lỗi tạo yêu cầu bảo hành không xác định.";
            
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message?: string, error?: string };
                errorMessage = apiError.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error("Lỗi tạo Claim:", err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 1. Thông tin Xe & Khách hàng (READ-ONLY) */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-bold mb-3 text-blue-600">Thông tin Xe</h3>
                    <p className="text-sm"><strong>VIN:</strong> {vehicle.vin}</p>
                    <p className="text-sm"><strong>Model:</strong> {vehicle.model} ({vehicle.year})</p>
                    <p className="text-sm"><strong>Khách hàng:</strong> {vehicle.customerName}</p>
                </div>

                {/* 2. Trung tâm Dịch vụ */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Trung tâm Dịch vụ *</label>
                    <select
                        name="centerId"
                        value={formState.centerId || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500"
                        required
                    >
                        <option value={0} disabled>-- Chọn Trung tâm --</option>
                        {centers.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.location})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 3. Mô tả & Chi phí */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả vấn đề *</label>
                <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500"
                    placeholder="Mô tả chi tiết lỗi, hư hỏng hoặc yêu cầu bảo hành."
                    required
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 4. Chi phí dự kiến */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tổng Chi phí Dự kiến * (VND)</label>
                    <input
                        type="number"
                        name="totalCost"
                        value={formState.totalCost}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500"
                        required
                    />
                </div>
                {/* 5. Technician ID (Optional) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ID Kỹ thuật viên (Nếu được chỉ định)</label>
                    <input
                        type="number"
                        name="technicianId"
                        value={formState.technicianId || ''}
                        onChange={handleChange}
                        placeholder="ID Technician"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Đang gửi...' : 'Tạo Yêu cầu Bảo hành'}
                </button>
            </div>
        </form>
    );
}

// ----------------------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------------------
const AddNewClaimPage: React.FC = () => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { vin } = router.query; 

    const [vehicleData, setVehicleData] = useState<VehicleResponse | null>(null);
    const [centersData, setCentersData] = useState<ServiceCenterResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [isClaimSuccess, setIsClaimSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            router.push('/login');
            return;
        }

        if (!vin || typeof vin !== 'string') {
            setPageError("Vui lòng chọn xe trước khi tạo yêu cầu bảo hành.");
            setIsLoading(false);
            return;
        }
        
        const loadData = async () => {
            setIsLoading(true);
            try {
                // 1. Lấy thông tin Xe theo VIN
                // Dùng getVehicleByVIN đã được sửa tên trong repository
                const vehicle = await getVehicleByVIN(vin); 
                setVehicleData(vehicle);
                
                // 2. Lấy danh sách Trung tâm Dịch vụ
                const centers = await getAllServiceCenters();
                setCentersData(centers);

            } catch (e: unknown) {
                const message = (e instanceof Error) ? e.message : "Không thể tải thông tin xe hoặc trung tâm dịch vụ.";
                setPageError(message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [vin, isAuthenticated, user, router]);

    const handleSuccess = (claim: WarrantyClaimResponse) => {
        setIsClaimSuccess(true);
        // Sau 3 giây, chuyển hướng người dùng đến trang danh sách claim
        setTimeout(() => {
            router.push('/admin/claims');
        }, 3000);
    }

    if (isLoading) {
        return (
            <Layout>
                <div className="py-20 text-center text-lg text-blue-600">Đang tải dữ liệu khởi tạo...</div>
            </Layout>
        );
    }

    if (pageError) {
        return (
            <Layout>
                <div className="p-6 text-red-600 bg-red-100 border border-red-300 rounded-lg">
                    {pageError}
                    <button onClick={() => router.back()} className="mt-4 text-blue-600 underline">Quay lại</button>
                </div>
            </Layout>
        );
    }
    
    if (!vehicleData || !user) return null;

    if (isClaimSuccess) {
        return (
            <Layout>
                <div className="text-center py-20 bg-green-50 rounded-lg border border-green-300">
                    <h2 className="text-3xl font-bold text-green-600">✅ Tạo Yêu cầu Bảo hành Thành công!</h2>
                    <p className="mt-4 text-gray-700">Hệ thống sẽ chuyển hướng bạn đến trang quản lý Claims trong giây lát...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Tạo Yêu cầu Bảo hành Mới</h1>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <ClaimForm
                    initialData={{
                        vehicle: vehicleData,
                        centers: centersData,
                        staffId: user.id,
                    }}
                    onSuccess={handleSuccess}
                />
            </div>
        </Layout>
    );
}

export default AddNewClaimPage;