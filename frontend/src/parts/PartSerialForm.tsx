// frontend/src/parts/PartSerialForm.tsx (PHIÊN BẢN CÓ STYLE)
"use client";

import React, { useState, useEffect } from 'react';
import { PartResponse } from '@/types/part'; 
import { PartSerialRequest, PartSerialResponse } from '@/types/partSerial';
import axios from 'axios';

type PartSerialRequestPayload = PartSerialRequest;
type PartResponseMinimal = Pick<PartResponse, 'id' | 'name' | 'partNumber'>;


interface PartSerialFormProps {
    initialData?: PartSerialRequestPayload | PartSerialResponse | null;
    onSubmit: (payload: PartSerialRequestPayload) => Promise<void>;
    onClose: () => void;
    availableParts: PartResponseMinimal[]; 
}

const PartSerialForm: React.FC<PartSerialFormProps> = ({ initialData = null, onSubmit, onClose, availableParts }) => {
    // FIX: Đảm bảo isEditing là boolean an toàn
    const isEditing = initialData !== null && initialData.id !== undefined;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // FIX: Sử dụng kiểm tra null an toàn trước khi truy cập thuộc tính
    const initialPartId = (initialData && 'partId' in initialData) ? initialData.partId : (availableParts.length > 0 ? availableParts[0].id : 0);

    const [formState, setFormState] = useState<PartSerialRequestPayload>({
        id: initialData?.id,
        partId: initialPartId,
        serialNumber: initialData?.serialNumber || '',
        dateReceived: initialData?.dateReceived || new Date().toISOString().split('T')[0],
    });
    
    useEffect(() => {
        if (!isEditing && availableParts.length > 0 && formState.partId === 0) {
            setFormState(prev => ({ ...prev, partId: availableParts[0].id }));
        }
    }, [availableParts, isEditing, formState.partId]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormState(prev => ({
            ...prev,
            [name]: name === 'partId' ? (value ? parseInt(value) : 0) : value,
        } as PartSerialRequestPayload));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (!formState.partId || formState.partId === 0) {
                throw new Error("Vui lòng chọn Linh kiện gốc.");
            }

            const payloadToSend: PartSerialRequestPayload = {
                ...formState,
                partId: formState.partId,
            };

            await onSubmit(payloadToSend);
            onClose();
        } catch (err: unknown) {
            let errorMessage = isEditing ? "Lỗi cập nhật Serial." : "Lỗi tạo Serial mới.";
            
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string, error?: string };
                errorMessage = apiError.message || apiError.error || errorMessage;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                {isEditing ? "Cập nhật Serial" : "Thêm Serial mới"}
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            {/* Linh kiện Gốc */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Linh kiện Gốc *</label>
                <select
                    name="partId"
                    value={formState.partId}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow ${
                        isEditing ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300'
                    }`} 
                    required
                    disabled={isEditing} 
                >
                    <option value={0} disabled>-- Chọn Linh kiện --</option>
                    {availableParts.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name} ({p.partNumber})
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Số Serial */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số Serial (Unique) *</label>
                <input 
                    name="serialNumber" 
                    value={formState.serialNumber} 
                    onChange={handleChange} 
                    className={`w-full border rounded-lg px-4 py-2 text-sm transition-shadow ${
                        isEditing ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                    placeholder="SN-PT-0012345"
                    required 
                    disabled={isEditing} 
                />
            </div>

            {/* Ngày Nhận hàng */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày Nhận hàng *</label>
                <input 
                    type="date"
                    name="dateReceived" 
                    value={formState.dateReceived} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" 
                    required 
                />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật Serial' : 'Thêm Serial')}
                </button>
            </div>
        </form>
    );
};

export default PartSerialForm;