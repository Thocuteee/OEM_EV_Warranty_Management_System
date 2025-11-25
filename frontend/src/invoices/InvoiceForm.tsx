"use client";

import React, { useState, useEffect } from 'react';
import { InvoiceRequest, InvoiceResponse } from '@/types/invoice'; 
import { PartResponse } from '@/types/part';
import { ServiceCenterResponse } from '@/types/center';
import { WarrantyClaimResponse } from '@/types/claim';
import { getAllParts } from '@/services/modules/partService';
import { getAllServiceCenters } from '@/services/modules/centerService';
import { getAllWarrantyClaims } from '@/services/modules/claimService';
import axios from 'axios';

// Định nghĩa Form Request (tên khác để tránh xung đột)
type InvoiceRequestPayload = InvoiceRequest; 

interface InvoiceFormProps {
    initialData?: InvoiceResponse | null;
    onSubmit: (payload: InvoiceRequestPayload) => Promise<void>;
    onClose: () => void;
}

const statusOptions = ['PAID', 'PENDING', 'OVERDUE', 'REIMBURSED'];

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData = null, onSubmit, onClose }) => {
    const isEditing = initialData && initialData.id !== undefined;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Dữ liệu cho Dropdown
    const [parts, setParts] = useState<PartResponse[]>([]);
    const [centers, setCenters] = useState<ServiceCenterResponse[]>([]);
    const [claims, setClaims] = useState<WarrantyClaimResponse[]>([]);
    const [loadingFK, setLoadingFK] = useState(true);

    const initialPartId = initialData?.partId || (parts.length > 0 ? parts[0].id : 0);
    const initialCenterId = initialData?.centerId || (centers.length > 0 ? centers[0].id : 0);
    const initialClaimId = initialData?.claimId || (claims.length > 0 ? claims[0].id : 0);
    
    const [formState, setFormState] = useState<InvoiceRequestPayload>({
        id: initialData?.id,
        claimId: initialClaimId,
        partId: initialPartId,
        centerId: initialCenterId,
        locationType: initialData?.locationType || 'SERVICE_CENTER',
        quantity: initialData?.quantity || 1,
        minStockLevel: initialData?.minStockLevel || 10,
        paymentsStatus: initialData?.paymentsStatus || 'PENDING',
    });

    // Load dữ liệu Khóa ngoại (FK)
    useEffect(() => {
        const loadFKData = async () => {
            try {
                const [partsData, centersData, claimsData] = await Promise.all([
                    getAllParts(),
                    getAllServiceCenters(),
                    getAllWarrantyClaims()
                ]);
                setParts(partsData);
                setCenters(centersData);
                // Chỉ lấy claims đã APPROVED hoặc COMPLETED để lập hóa đơn
                setClaims(claimsData.filter(c => c.approvalStatus === 'APPROVED' || c.status === 'COMPLETED'));

                // Cập nhật state form nếu chưa có giá trị ban đầu (chỉ khi tạo mới)
                setFormState(prev => ({
                    ...prev,
                    claimId: initialData?.claimId || (claimsData.length > 0 ? claimsData[0].id : 0),
                    partId: initialData?.partId || (partsData.length > 0 ? partsData[0].id : 0),
                    centerId: initialData?.centerId || (centersData.length > 0 ? centersData[0].id : 0),
                }));

            } catch (err) {
                setError("Không thể tải dữ liệu Parts/Centers/Claims.");
                console.error(err);
            } finally {
                setLoadingFK(false);
            }
        };
        loadFKData();
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        setFormState(prev => ({
            ...prev,
            [name]: type === 'number' || name === 'claimId' || name === 'partId' || name === 'centerId' 
                    ? parseInt(value) || 0 
                    : value,
        } as InvoiceRequestPayload));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formState.claimId || !formState.partId || !formState.centerId) {
            setError("Vui lòng chọn Claim, Part và Service Center.");
            setLoading(false);
            return;
        }
        
        try {
            await onSubmit(formState);
        } catch (err: unknown) {
            let errorMessage = isEditing ? "Lỗi cập nhật Hóa đơn." : "Lỗi tạo Hóa đơn mới.";
            
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string, error?: string };
                errorMessage = apiError.message || apiError.error || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                {isEditing ? "Cập nhật Hóa đơn #{initialData?.id}" : "Thêm Hóa đơn mới"}
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            {loadingFK && <div className="text-blue-500 text-sm">Đang tải dữ liệu liên kết...</div>}

            {/* Khóa ngoại (FK) */}
            <div className="grid grid-cols-2 gap-4">
                {/* Claim ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Claim ID *</label>
                    <select name="claimId" value={formState.claimId} onChange={handleChange} className="w-full input-base" required disabled={loadingFK}>
                        <option value={0} disabled>-- Chọn Claim --</option>
                        {claims.map(c => <option key={c.id} value={c.id}>{c.id} - {c.vehicleVIN} ({c.status})</option>)}
                    </select>
                </div>
                {/* Part ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Part *</label>
                    <select name="partId" value={formState.partId} onChange={handleChange} className="w-full input-base" required disabled={loadingFK}>
                        <option value={0} disabled>-- Chọn Part --</option>
                        {parts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.partNumber})</option>)}
                    </select>
                </div>
                {/* Center ID */}
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Service Center *</label>
                    <select name="centerId" value={formState.centerId} onChange={handleChange} className="w-full input-base" required disabled={loadingFK}>
                        <option value={0} disabled>-- Chọn Center --</option>
                        {centers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.location})</option>)}
                    </select>
                </div>
            </div>

            {/* Chi tiết Hóa đơn */}
            <div className="grid grid-cols-2 gap-4">
                {/* Quantity */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượng *</label>
                    <input type="number" name="quantity" value={formState.quantity} onChange={handleChange} min="1" className="w-full input-base" required />
                </div>
                {/* Min Stock Level */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Min Stock Level *</label>
                    <input type="number" name="minStockLevel" value={formState.minStockLevel} onChange={handleChange} min="0" className="w-full input-base" required />
                </div>
                {/* Location Type */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Loại Vị trí *</label>
                    <select name="locationType" value={formState.locationType} onChange={handleChange} className="w-full input-base" required>
                        <option value="SERVICE_CENTER">SERVICE_CENTER</option>
                        <option value="WAREHOUSE">WAREHOUSE</option>
                    </select>
                </div>
                {/* Payments Status */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái Thanh toán *</label>
                    <select name="paymentsStatus" value={formState.paymentsStatus} onChange={handleChange} className="w-full input-base" required>
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật Hóa đơn' : 'Thêm Hóa đơn')}
                </button>
            </div>
        </form>
    );
};

export default InvoiceForm;