"use client";

import React, { useState, useEffect } from 'react';
import { VehiclePartHistoryRequest } from '@/types/vehiclePartHistory';
import { PartSerialResponse } from '@/types/partSerial';
import { getAllPartSerials } from '@/services/modules/partSerialService';
import axios from 'axios';

interface VehiclePartHistoryFormProps {
    vehicleId: number;
    claimId: number;
    onSubmit: (payload: VehiclePartHistoryRequest) => Promise<void>;
    onClose: () => void;
}

const VehiclePartHistoryForm: React.FC<VehiclePartHistoryFormProps> = ({ 
    vehicleId, 
    claimId,
    onSubmit, 
    onClose 
}) => {
    const [loading, setLoading] = useState(false);
    const [loadingSerials, setLoadingSerials] = useState(true);
    const [error, setError] = useState('');
    const [availableSerials, setAvailableSerials] = useState<PartSerialResponse[]>([]);
    
    const [formState, setFormState] = useState<VehiclePartHistoryRequest>({
        vehicleId: vehicleId,
        claimId: claimId,
        partSerialId: 0,
        dateInstalled: new Date().toISOString().split('T')[0], // Today's date in yyyy-MM-dd
    });
    
    // Load Part Serials
    useEffect(() => {
        const loadSerials = async () => {
            try {
                const data = await getAllPartSerials();
                setAvailableSerials(data);
                
                if (data.length > 0 && formState.partSerialId === 0) {
                    setFormState(prev => ({ 
                        ...prev, 
                        partSerialId: data[0].id,
                    }));
                }
            } catch (err) {
                console.error("Failed to load part serials:", err);
                setError("Không thể tải danh sách Serial linh kiện.");
            } finally {
                setLoadingSerials(false);
            }
        };
        loadSerials();
    }, []);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ 
            ...prev, 
            [name]: name === 'partSerialId' ? parseInt(value) : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Ngăn chặn double submit
        if (loading) return;
        
        setError('');
        setLoading(true);
        
        if (!formState.partSerialId || formState.partSerialId === 0) {
            setError("Vui lòng chọn Serial linh kiện.");
            setLoading(false);
            return;
        }
        
        try {
            await onSubmit(formState);
            onClose();
        } catch (err: unknown) {
            let errorMessage = "Lỗi khi ghi nhận lịch sử linh kiện.";
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message?: string, error?: string };
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
                Ghi nhận Lịch sử Linh kiện
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <p><strong>Vehicle ID:</strong> {vehicleId}</p>
                <p><strong>Claim ID:</strong> {claimId}</p>
            </div>
            
            {/* Part Serial Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Serial Linh kiện đã lắp đặt *
                </label>
                <select
                    name="partSerialId"
                    value={formState.partSerialId || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                    required
                    disabled={loadingSerials}
                >
                    <option value={0} disabled>-- Chọn Serial linh kiện --</option>
                    {loadingSerials && <option value={0} disabled>Đang tải danh sách serial...</option>}
                    {availableSerials.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.serialNumber} - {s.partName} ({s.partNumber})
                        </option>
                    ))}
                </select>
                {loadingSerials && <p className="text-xs text-gray-500 mt-1">Đang tải danh sách serial...</p>}
                {!loadingSerials && availableSerials.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                        Chưa có serial linh kiện nào. Vui lòng thêm serial trong trang Quản lý Linh kiện.
                    </p>
                )}
            </div>

            {/* Date Installed */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ngày Lắp đặt *
                </label>
                <input 
                    type="date"
                    name="dateInstalled" 
                    value={formState.dateInstalled || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                    required 
                />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading || availableSerials.length === 0}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : 'Ghi nhận Lịch sử'}
                </button>
            </div>
        </form>
    );
};

export default VehiclePartHistoryForm;

