"use client";

import React, { useState } from 'react';
import { RecallCampaignRequest, RecallCampaignResponse } from "@/types/campaign";
import axios from 'axios';

interface RecallCampaignFormProps {
    initialData?: RecallCampaignResponse | null;
    onSubmit: (payload: RecallCampaignRequest) => Promise<void>;
    onClose: () => void;
}

const RecallCampaignForm: React.FC<RecallCampaignFormProps> = ({ initialData = null, onSubmit, onClose }) => {
    const isEditing = initialData && initialData.id !== undefined;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formState, setFormState] = useState<RecallCampaignRequest>({
        id: initialData?.id,
        title: initialData?.title || '',
        startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
        endDate: initialData?.endDate || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // Kiểm tra Logic Ngày tháng: Ngày kết thúc không được trước Ngày bắt đầu
            if (formState.endDate && formState.startDate > formState.endDate) {
                setError("Ngày kết thúc phải sau Ngày bắt đầu.");
                return;
            }

            await onSubmit(formState);
        } catch (err: unknown) {
            let errorMessage = isEditing ? "Lỗi cập nhật Chiến dịch." : "Lỗi tạo Chiến dịch mới.";
            
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                {isEditing ? "Cập nhật Chiến dịch Triệu hồi" : "Tạo Chiến dịch Triệu hồi mới"}
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề Chiến dịch *</label>
                <input 
                    name="title" 
                    value={formState.title} 
                    onChange={handleChange} 
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" 
                    placeholder="Ví dụ: Thay thế Pin EV-A lô 2024"
                    required 
                    disabled={isEditing ? true : undefined}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày Bắt đầu *</label>
                    <input 
                        type="date" 
                        name="startDate" 
                        value={formState.startDate} 
                        onChange={handleChange} 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày Kết thúc (Tùy chọn)</label>
                    <input 
                        type="date" 
                        name="endDate" 
                        value={formState.endDate} 
                        onChange={handleChange} 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" 
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors mr-3">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo Chiến dịch')}
                </button>
            </div>
        </form>
    );
};

export default RecallCampaignForm;