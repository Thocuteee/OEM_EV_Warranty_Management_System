"use client";

import React, { useState, useEffect } from 'react';
import { VehiclePartHistoryRequest } from '@/types/vehiclePartHistory';
import { PartSerialResponse } from '@/types/partSerial';
import { VehicleResponse } from '@/types/vehicle';
import { WarrantyClaimResponse } from '@/types/claim';
import { getAllPartSerials } from '@/services/modules/partSerialService';
import { getAllVehicles } from '@/services/modules/vehicleService';
import { getAllWarrantyClaims } from '@/services/modules/claimService';
import axios from 'axios';

interface VehiclePartHistoryFormForPartsProps {
    onSubmit: (payload: VehiclePartHistoryRequest) => Promise<void>;
    onClose: () => void;
}

const VehiclePartHistoryFormForParts: React.FC<VehiclePartHistoryFormForPartsProps> = ({ 
    onSubmit, 
    onClose 
}) => {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    
    const [availableSerials, setAvailableSerials] = useState<PartSerialResponse[]>([]);
    const [availableVehicles, setAvailableVehicles] = useState<VehicleResponse[]>([]);
    const [availableClaims, setAvailableClaims] = useState<WarrantyClaimResponse[]>([]);
    
    const [formState, setFormState] = useState<VehiclePartHistoryRequest>({
        vehicleId: 0,
        claimId: 0,
        partSerialId: 0,
        dateInstalled: new Date().toISOString().split('T')[0],
    });
    
    // Load dữ liệu
    useEffect(() => {
        const loadData = async () => {
            try {
                const [serialsData, vehiclesData, claimsData] = await Promise.all([
                    getAllPartSerials(),
                    getAllVehicles(),
                    getAllWarrantyClaims(),
                ]);
                setAvailableSerials(serialsData);
                setAvailableVehicles(vehiclesData);
                setAvailableClaims(claimsData);
                
                // Set default values
                if (serialsData.length > 0 && formState.partSerialId === 0) {
                    setFormState(prev => ({ ...prev, partSerialId: serialsData[0].id }));
                }
                if (vehiclesData.length > 0 && formState.vehicleId === 0) {
                    setFormState(prev => ({ ...prev, vehicleId: vehiclesData[0].id }));
                }
                if (claimsData.length > 0 && formState.claimId === 0) {
                    setFormState(prev => ({ ...prev, claimId: claimsData[0].id }));
                }
            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Không thể tải dữ liệu.");
            } finally {
                setLoadingData(false);
            }
        };
        loadData();
    }, []);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ 
            ...prev, 
            [name]: name === 'partSerialId' || name === 'vehicleId' || name === 'claimId' 
                ? parseInt(value) || 0 
                : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (loading) return;
        
        setError('');
        setLoading(true);
        
        if (!formState.partSerialId || formState.partSerialId === 0) {
            setError("Vui lòng chọn Serial linh kiện.");
            setLoading(false);
            return;
        }
        if (!formState.vehicleId || formState.vehicleId === 0) {
            setError("Vui lòng chọn Xe (VIN).");
            setLoading(false);
            return;
        }
        if (!formState.claimId || formState.claimId === 0) {
            setError("Vui lòng chọn Claim.");
            setLoading(false);
            return;
        }
        
        try {
            await onSubmit(formState);
            onClose();
        } catch (err: unknown) {
            let errorMessage = "Lỗi khi gắn số seri phụ tùng với VIN.";
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
                Gắn số Seri Phụ tùng với VIN
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            {loadingData && <div className="text-blue-500 text-sm">Đang tải dữ liệu...</div>}
            
            <div className="grid grid-cols-1 gap-4">
                {/* Vehicle Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Xe (VIN) *
                    </label>
                    <select
                        name="vehicleId"
                        value={formState.vehicleId || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required
                        disabled={loadingData}
                    >
                        <option value={0} disabled>-- Chọn Xe (VIN) --</option>
                        {availableVehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.vin} - {v.model} ({v.year})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Claim Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Claim *
                    </label>
                    <select
                        name="claimId"
                        value={formState.claimId || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required
                        disabled={loadingData}
                    >
                        <option value={0} disabled>-- Chọn Claim --</option>
                        {availableClaims.map(c => (
                            <option key={c.id} value={c.id}>
                                Claim #{c.id} - {c.status} - {c.vehicleVIN || 'N/A'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Part Serial Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Serial Phụ tùng đã lắp đặt *
                    </label>
                    <select
                        name="partSerialId"
                        value={formState.partSerialId || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required
                        disabled={loadingData}
                    >
                        <option value={0} disabled>-- Chọn Serial linh kiện --</option>
                        {availableSerials.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.serialNumber} - {s.partName} ({s.partNumber})
                            </option>
                        ))}
                    </select>
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
                    disabled={loading || loadingData || availableSerials.length === 0 || availableVehicles.length === 0 || availableClaims.length === 0}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : 'Gắn Seri với VIN'}
                </button>
            </div>
        </form>
    );
};

export default VehiclePartHistoryFormForParts;

