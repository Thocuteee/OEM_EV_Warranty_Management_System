"use client";

import React, { useState } from 'react';
import { CustomerRequest } from '@/types/customer'; 

interface CustomerFormProps {
    initialData?: CustomerRequest | null;
    onSubmit: (payload: CustomerRequest) => Promise<void>;
    onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ initialData = null, onSubmit, onClose }) => {
    const isEditing = initialData && initialData.id !== undefined;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formState, setFormState] = useState<CustomerRequest>({
        id: initialData?.id || undefined,
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        let processedValue: string | number | undefined = value;
        if (name === 'id') {
            processedValue = value ? parseInt(value) : undefined;
        }

        setFormState(prev => ({
            ...prev,
            [name]: processedValue,
        } as CustomerRequest));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await onSubmit(formState);
            onClose();
        } catch (err: unknown) {
            let errorMessage = "Lỗi tạo khách hàng không xác định.";
            
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'object' && err !== null && 'message' in err) {
                errorMessage = (err as { message: string }).message || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Tên */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Khách hàng</label>
                    <input name="name" value={formState.name} onChange={handleChange} className="w-full input-base" required />
                </div>
                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input name="email" value={formState.email} onChange={handleChange} className="w-full input-base" type="email" required />
                </div>
                {/* Phone */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                    <input name="phone" value={formState.phone} onChange={handleChange} className="w-full input-base" required />
                </div>
                 {/* Địa chỉ */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                    <input name="address" value={formState.address} onChange={handleChange} className="w-full input-base" required />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm Khách hàng')}
                </button>
            </div>
        </form>
    );
};

export default CustomerForm;