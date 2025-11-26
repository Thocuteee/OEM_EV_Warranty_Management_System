"use client";
import React, { useState, useEffect } from 'react';
import { WarrantyPolicyRequest, WarrantyPolicyResponse } from '@/types/warrantyPolicy';

interface Props {
    initialData?: WarrantyPolicyResponse | null;
    onSubmit: (data: WarrantyPolicyRequest) => Promise<void>;
    onClose: () => void;
}

const WarrantyPolicyForm: React.FC<Props> = ({ initialData, onSubmit, onClose }) => {
    const [formData, setFormData] = useState<WarrantyPolicyRequest>({
        policyName: '',
        durationMonths: 12,
        mileageLimit: 10000,
        coverageDescription: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id,
                policyName: initialData.policyName,
                durationMonths: initialData.durationMonths,
                mileageLimit: initialData.mileageLimit,
                coverageDescription: initialData.coverageDescription
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'durationMonths' || name === 'mileageLimit') ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold mb-4">{initialData ? 'Cập nhật Chính sách' : 'Thêm Chính sách Mới'}</h3>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Tên Chính sách</label>
                <input required type="text" name="policyName" value={formData.policyName} onChange={handleChange} 
                       className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Thời hạn (Tháng)</label>
                    <input required type="number" min="1" name="durationMonths" value={formData.durationMonths} onChange={handleChange} 
                           className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giới hạn KM</label>
                    <input required type="number" min="0" name="mileageLimit" value={formData.mileageLimit} onChange={handleChange} 
                           className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                <textarea name="coverageDescription" rows={3} value={formData.coverageDescription || ''} onChange={handleChange} 
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-100">Hủy</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Đang lưu...' : 'Lưu lại'}
                </button>
            </div>
        </form>
    );
};
export default WarrantyPolicyForm;