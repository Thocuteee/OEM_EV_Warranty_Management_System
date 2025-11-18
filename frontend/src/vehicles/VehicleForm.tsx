// frontend/src/vehicles/VehicleForm.tsx

import React, { useState, useEffect } from 'react';
import { VehicleRequest, CustomerResponse } from '@/types/warranty';
import { getAllCustomers } from '@/services/modules/customerService'; 

interface VehicleFormProps {
    initialData?: VehicleRequest | null;
    onSubmit: (payload: VehicleRequest) => Promise<void>;
    onClose: () => void;
}


const VehicleForm: React.FC<VehicleFormProps> = ({ initialData = null, onSubmit, onClose }) => {
    const isEditing = initialData && initialData.id !== undefined;
    const [customers, setCustomers] = useState<CustomerResponse[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formState, setFormState] = useState<VehicleRequest>({
        id: initialData?.id || undefined,
        customerId: initialData?.customerId || undefined,
        VIN: initialData?.VIN || '',
        model: initialData?.model || '',
        year: initialData?.year || '',
    });

    // Load danh sách khách hàng cho dropdown
    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await getAllCustomers();
                setCustomers(data);
                if (!isEditing && data.length > 0 && !formState.customerId) {
                    // Mặc định chọn khách hàng đầu tiên nếu đang tạo mới
                    setFormState(prev => ({ ...prev, customerId: data[0].id }));
                }
            } catch (err) {
                console.error("Failed to load customers:", err);
                setError("Không thể tải danh sách khách hàng.");
            } finally {
                setLoadingCustomers(false);
            }
        };
        loadCustomers();
    }, [isEditing]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        let processedValue: string | number | undefined = value;
        if (name === 'customerId' || name === 'id') {
            processedValue = parseInt(value) || undefined;
        }

        setFormState(prev => ({
            ...prev,
            [name]: processedValue,
        } as VehicleRequest));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formState.customerId) {
            setError("Vui lòng chọn Chủ sở hữu xe.");
            setLoading(false);
            return;
        }
        
        try {
            await onSubmit(formState);
            onClose();
        } catch (err: any) {
            setError(err.message || "Lỗi không xác định khi lưu dữ liệu xe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* VIN */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">VIN (17 ký tự)</label>
                    <input name="VIN" value={formState.VIN} onChange={handleChange} placeholder="VIN1234567890ABCDE" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none" required minLength={17} maxLength={17} />
                </div>
                {/* Model */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Model Xe</label>
                    <input name="model" value={formState.model} onChange={handleChange} placeholder="EV-A" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none" required />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Year */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Năm sản xuất</label>
                    <input name="year" value={formState.year} onChange={handleChange} placeholder="2023" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none" required pattern="^(19|20)\d{2}$" />
                </div>
                 {/* Customer ID (Dropdown) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Chủ sở hữu (Customer)</label>
                    <select
                        name="customerId"
                        value={formState.customerId || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        required
                        disabled={loadingCustomers}
                    >
                        {loadingCustomers && <option value="">Đang tải khách hàng...</option>}
                        {!loadingCustomers && customers.length === 0 && <option value="">Chưa có khách hàng nào</option>}
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.email})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading || loadingCustomers}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (isEditing ? 'Đang lưu...' : 'Đang tạo...') : (isEditing ? 'Cập nhật' : 'Đăng ký Xe')}
                </button>
            </div>
        </form>
    );
};

export default VehicleForm;