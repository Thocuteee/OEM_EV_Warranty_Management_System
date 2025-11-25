// frontend/src/parts/PartForm.tsx (PHIÊN BẢN CÓ STYLE)
"use client";

import React, { useState } from 'react';
import { PartRequest, PartResponse } from '@/types/part'; 
import axios from 'axios';

type PartRequestPayload = PartRequest;

interface PartFormProps {
    initialData?: PartRequestPayload | PartResponse | null; 
    onSubmit: (payload: PartRequest) => Promise<void>;
    onClose: () => void;
}

const PartForm: React.FC<PartFormProps> = ({ initialData = null, onSubmit, onClose }) => {
    const isEditing = initialData !== null && initialData.id !== undefined;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formState, setFormState] = useState<PartRequest>({
        id: initialData?.id,
        name: initialData?.name || '',
        partNumber: initialData?.partNumber || '',
        price: (initialData?.price as number) || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setFormState(prev => ({
            ...prev,
            [name]: name === 'price' ? (value ? parseFloat(value) : 0) : value,
        } as PartRequest));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const payloadToSend: PartRequest = {
                ...formState,
                price: formState.price || 0,
            };

            await onSubmit(payloadToSend);
            onClose(); 
        } catch (err: unknown) {
            let errorMessage = isEditing ? "Lỗi cập nhật Linh kiện." : "Lỗi tạo Linh kiện mới.";
            
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
                {isEditing ? "Cập nhật Linh kiện" : "Thêm Linh kiện mới"}
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            {/* Tên Linh kiện */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Linh kiện *</label>
                <input 
                    name="name" 
                    value={formState.name} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                    placeholder="Ví dụ: Pin Lithium-Ion" 
                    required 
                />
            </div>
            
            {/* Part Number */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã Linh kiện (Part Number) *</label>
                <input 
                    name="partNumber" 
                    value={formState.partNumber} 
                    onChange={handleChange} 
                    className={`w-full border rounded-lg px-4 py-2 text-sm transition-shadow ${
                        isEditing ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                    placeholder="PT-EVN-LION-001" 
                    required 
                    disabled={!!isEditing} 
                />
            </div>

            {/* Đơn giá */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Đơn giá (VND) *</label>
                <input 
                    type="number"
                    name="price" 
                    value={formState.price} 
                    onChange={handleChange} 
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" 
                    required 
                />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật Linh kiện' : 'Thêm Linh kiện')}
                </button>
            </div>
        </form>
    );
};

export default PartForm;