// frontend/src/worklogs/WorkLogForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { WorkLogRequest, WorkLogResponse } from '@/types/workLog'; 
import { TechnicianResponse } from '@/types/technician';
import { getAllTechnicians } from '@/services/modules/technicianService'; 
import axios from 'axios';

interface WorkLogFormProps {
    initialData?: WorkLogResponse | null; 
    claimId: number;
    // ID của Technician đã được gán cho Claim
    initialTechnicianId: number | null; 
    onSubmit: (payload: WorkLogRequest) => Promise<void>;
    onClose: () => void;
}

const WorkLogForm: React.FC<WorkLogFormProps> = ({ 
    initialData = null, 
    claimId, 
    initialTechnicianId,
    onSubmit, 
    onClose 
}) => {
    const isEditing = initialData && initialData.id !== undefined;
    const [loading, setLoading] = useState(false);
    const [loadingTechs, setLoadingTechs] = useState(true);
    const [error, setError] = useState('');
    const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);

    // Mặc định chọn Tech đã gán cho Claim
    const defaultTechId = initialData?.technicianId || initialTechnicianId || 0;

    const [formState, setFormState] = useState<WorkLogRequest>({
        id: initialData?.id,
        claimId: claimId,
        technicianId: defaultTechId,
        
        // Chuyển LocalDate (yyyy-MM-dd)
        startTime: initialData?.startTime || new Date().toISOString().split('T')[0],
        endTime: initialData?.endTime || new Date().toISOString().split('T')[0],
        logDate: initialData?.logDate || new Date().toISOString().split('T')[0], 
        
        duration: initialData?.duration || undefined, 
        notes: initialData?.notes || '',
    });

    // Load Technicians (dù chỉ dùng để hiển thị tên nếu techId có sẵn)
    useEffect(() => {
        const loadTechs = async () => {
            try {
                const data = await getAllTechnicians();
                setTechnicians(data);
            } catch (err) {
                console.error("Failed to load technicians:", err);
                setError("Không thể tải danh sách Kỹ thuật viên.");
            } finally {
                setLoadingTechs(false);
            }
        };
        loadTechs();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue: string | number | undefined = value;

        if (name === 'technicianId') {
            newValue = value ? parseInt(value) : 0;
        } else if (name === 'duration') {
            newValue = parseFloat(value) || undefined;
        }

        setFormState(prev => ({ ...prev, [name]: newValue } as WorkLogRequest));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        if (!formState.technicianId || formState.technicianId === 0) {
            setError("Vui lòng chọn Kỹ thuật viên.");
            setLoading(false);
            return;
        }
        
        const payloadToSend: WorkLogRequest = {
            ...formState,
            // Đảm bảo các trường số là undefined nếu rỗng
            duration: formState.duration || undefined,
            notes: formState.notes || undefined,
            logDate: formState.logDate,
        };

        try {
            await onSubmit(payloadToSend);
            onClose(); // Đóng modal sau khi thành công
        } catch (err: unknown) {
            let errorMessage = "Lỗi khi lưu Nhật ký Công việc.";
            
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
    
    const currentTech = technicians.find(t => t.id === formState.technicianId);
    const isTechAssigned = !!initialTechnicianId && !isEditing; // Không cho chọn nếu đã gán và không phải edit

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                {isEditing ? `Cập nhật Log #${initialData?.id}` : `Thêm Nhật ký Công việc cho Claim #${claimId}`}
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            {/* Thông tin Cơ bản */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Claim ID (Read-only)</label>
                    <input value={claimId} className="w-full border rounded-lg px-4 py-2 text-sm bg-gray-100 cursor-not-allowed" disabled />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Technician *</label>
                    <select
                        name="technicianId"
                        value={formState.technicianId || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required
                        // Disable nếu đang không edit và đã có tech được gán
                        disabled={isTechAssigned} 
                    >
                        {loadingTechs && <option value={0} disabled>Đang tải Kỹ thuật viên...</option>}
                        {isTechAssigned && currentTech && <option value={currentTech.id}>{currentTech.name} (Đã gán)</option>}
                        
                        {/* Chỉ hiển thị list đầy đủ nếu chưa gán hoặc đang edit */}
                        {!isTechAssigned && technicians.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.name} (ID: {t.id})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Thời gian làm việc */}
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 pt-3">Thời gian Công việc</h3>
            <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày Bắt đầu *</label>
                    <input 
                        type="date"
                        name="startTime" 
                        value={formState.startTime} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày Kết thúc *</label>
                    <input 
                        type="date"
                        name="endTime" 
                        value={formState.endTime} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (Ngày - Tùy chọn)</label>
                    <input 
                        type="number"
                        name="duration" 
                        value={formState.duration || ''} 
                        onChange={handleChange} 
                        step="0.01"
                        min="0"
                        placeholder="Được tính tự động"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 focus:border-blue-500" 
                    />
                </div>
            </div>

            {/* Ghi chú */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ghi chú (Notes)</label>
                <textarea name="notes" value={formState.notes} onChange={handleChange} rows={3} className="w-full border rounded-lg px-4 py-2 text-sm focus:border-blue-500" />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật Log' : 'Thêm Log')}
                </button>
            </div>
        </form>
    );
};

export default WorkLogForm;