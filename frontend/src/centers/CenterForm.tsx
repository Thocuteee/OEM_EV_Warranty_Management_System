import React, { useState } from 'react';
import { CenterRequest, ServiceCenterResponse } from '@/types/center'; 
import axios from 'axios';

// CenterRequest không có sẵn, chúng ta sẽ mô phỏng dựa trên CenterResponse và Backend DTO
export interface CenterRequestPayload {
    id?: number;
    name: string;
    location: string;
}

interface CenterFormProps {
    initialData?: ServiceCenterResponse | null;
    onSubmit: (payload: CenterRequestPayload) => Promise<void>;
    onClose: () => void;
}

const CenterForm: React.FC<CenterFormProps> = ({ initialData = null, onSubmit, onClose }) => {
    const isEditing = initialData && initialData.id !== undefined;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formState, setFormState] = useState<CenterRequestPayload>({
        id: initialData?.id || undefined,
        name: initialData?.name || '',
        location: initialData?.location || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setFormState(prev => ({
            ...prev,
            [name]: value,
        } as CenterRequestPayload));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await onSubmit(formState);
        } catch (err: unknown) {
            let errorMessage = isEditing ? "Lỗi cập nhật Trung tâm." : "Lỗi tạo Trung tâm mới.";
            
            if (axios.isAxiosError(err) && err.response) {
                // Lỗi từ GlobalExceptionHandler hoặc validation (Backend)
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
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Cập nhật Trung tâm" : "Thêm Trung tâm mới"}</h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Trung tâm *</label>
                <input 
                    name="name" 
                    value={formState.name} 
                    onChange={handleChange} 
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" 
                    placeholder="Ví dụ: Service Center 02 - HCM"
                    required 
                />
            </div>
            
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Vị trí *</label>
                <input 
                    name="location" 
                    value={formState.location} 
                    onChange={handleChange} 
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" 
                    placeholder="Ví dụ: Ho Chi Minh, Vietnam"
                    required 
                />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm Trung tâm')}
                </button>
            </div>
        </form>
    );
};

export default CenterForm;