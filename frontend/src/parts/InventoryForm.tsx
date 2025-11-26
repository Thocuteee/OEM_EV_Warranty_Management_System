// frontend/src/parts/InventoryForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { InventoryRequest, InventoryResponse } from '@/types/inventory'; 
import { PartResponse } from '@/types/part';
import { ServiceCenterResponse } from '@/types/center';
import { getAllParts } from '@/services/modules/partService';
import { getAllServiceCenters } from '@/services/modules/centerService';
import axios from 'axios';

type InventoryRequestPayload = InventoryRequest;

interface InventoryFormProps {
    initialData?: InventoryResponse | null; 
    onSubmit: (payload: InventoryRequestPayload) => Promise<void>;
    onClose: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ initialData = null, onSubmit, onClose }) => {
    const isEditing = initialData && initialData.id !== undefined;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Dữ liệu cho Dropdown
    const [parts, setParts] = useState<PartResponse[]>([]);
    const [centers, setCenters] = useState<ServiceCenterResponse[]>([]);
    const [loadingFK, setLoadingFK] = useState(true);

    const initialPartId = initialData?.partId || 0;
    const initialCenterId = initialData?.centerId || 0;
    
    const [formState, setFormState] = useState<InventoryRequestPayload>({
        id: initialData?.id,
        partId: initialPartId,
        centerId: initialCenterId,
        amount: initialData?.amount || 0,
        invoiceDate: initialData?.invoiceDate || new Date().toISOString().split('T')[0],
    });

    // Load dữ liệu Khóa ngoại (FK)
    useEffect(() => {
        const loadFKData = async () => {
            try {
                const [partsData, centersData] = await Promise.all([
                    getAllParts(),
                    getAllServiceCenters(),
                ]);
                setParts(partsData);
                setCenters(centersData);

                // Cập nhật state form nếu chưa có giá trị ban đầu (chỉ khi tạo mới)
                setFormState(prev => ({
                    ...prev,
                    partId: initialData?.partId || (partsData.length > 0 ? partsData[0].id : 0),
                    centerId: initialData?.centerId || (centersData.length > 0 ? centersData[0].id : 0),
                }));

            } catch (err) {
                setError("Không thể tải dữ liệu Parts/Centers.");
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
            [name]: type === 'number' || name === 'partId' || name === 'centerId' 
                    ? parseFloat(value) || 0 
                    : value,
        } as InventoryRequestPayload));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formState.partId || !formState.centerId) {
            setError("Vui lòng chọn Part và Service Center.");
            setLoading(false);
            return;
        }
        
        const payloadToSend: InventoryRequestPayload = {
            ...formState,
            id: isEditing ? formState.id : undefined,
            partId: formState.partId,
            centerId: formState.centerId,
            amount: formState.amount,
        }

        try {
            await onSubmit(payloadToSend);
            onClose();
        } catch (err: unknown) {
            let errorMessage = isEditing ? "Lỗi cập nhật Tồn kho." : "Lỗi tạo Tồn kho mới.";
            
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string, error?: string };
                errorMessage = apiError.message || apiError.error || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                {isEditing ? `Cập nhật Tồn kho #${initialData?.id}` : "Thêm Bản ghi Tồn kho mới"}
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            {loadingFK && <div className="text-blue-500 text-sm">Đang tải dữ liệu liên kết...</div>}

            {/* Khóa ngoại (FK) */}
            <div className="grid grid-cols-1 gap-4">
                {/* Part ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Linh kiện (Part) *</label>
                    <select name="partId" value={formState.partId} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-sm" required disabled={!!loadingFK}>
                        <option value={0} disabled>-- Chọn Part --</option>
                        {parts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.partNumber})</option>)}
                    </select>
                </div>
                {/* Center ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Trung tâm Dịch vụ *</label>
                    <select name="centerId" value={formState.centerId} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 text-sm" required disabled={loadingFK}>
                        <option value={0} disabled>-- Chọn Center --</option>
                        {centers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.location})</option>)}
                    </select>
                </div>
            </div>

            {/* Chi tiết Tồn kho */}
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 pt-3">Chi tiết Nhập kho</h3>
            <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượng *</label>
                    <input 
                        type="number" 
                        name="amount" 
                        value={formState.amount} 
                        onChange={handleChange} 
                        min="0"
                        step="0.01"
                        className="w-full border rounded-lg px-4 py-2 text-sm" 
                        required 
                    />
                </div>
                {/* Invoice Date */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày Hóa đơn *</label>
                    <input 
                        type="date" 
                        name="invoiceDate" 
                        value={formState.invoiceDate} 
                        onChange={handleChange} 
                        className="w-full border rounded-lg px-4 py-2 text-sm" 
                        required 
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật Tồn kho' : 'Thêm Tồn kho')}
                </button>
            </div>
        </form>
    );
};

export default InventoryForm;