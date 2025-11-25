"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ReportRequest, ReportResponse } from '@/types/report'; 
import { TechnicianResponse } from '@/types/technician'; 
import { WarrantyClaimResponse } from '@/types/claim'; 
import { getAllTechnicians } from '@/services/modules/technicianService'; 
import { getAllWarrantyClaims } from '@/services/modules/claimService'; 

import axios from 'axios';

interface ReportFormProps {
    initialData?: ReportRequest | ReportResponse | null;
    onSubmit: (payload: ReportRequest) => Promise<void>;
    onClose: () => void;
    currentUserId: number;
    currentUsername: string;
    initialClaimId?: number; 
    initialCenterId: number; 
    initialVehicleId: number; 
}

const ReportForm: React.FC<ReportFormProps> = ({ 
    initialData = null, 
    onSubmit, 
    onClose, 
    currentUserId,
    currentUsername,
    initialClaimId,
    initialCenterId,
    initialVehicleId,
}) => {
    const isEditing = initialData !== null && initialData.id !== undefined;
    const [loading, setLoading] = useState(false);
    const [loadingFK, setLoadingFK] = useState(true);
    const [error, setError] = useState('');
    
    // Danh sách dữ liệu cho dropdown
    const [claims, setClaims] = useState<WarrantyClaimResponse[]>([]);
    const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);
    
    // Status Options (Ví dụ)
    const statusOptions = ['DRAFT', 'IN_PROCESS', 'COMPLETED'];
    
    const initialClaim = initialData ? initialData.claimId : (initialClaimId || 0);

    const [formState, setFormState] = useState<ReportRequest>({
        id: initialData?.id,
        claimId: initialClaim, // ID Claim được chọn
        technicianId: initialData?.technicianId || 0,
        centerId: initialData?.centerId || initialCenterId || 0, 
        vehicleId: initialData?.vehicleId || initialVehicleId || 0,
        createdById: currentUserId,
        
        status: initialData?.status || 'IN_PROCESS',
        reportDate: initialData?.reportDate || new Date().toISOString().split('T')[0],
        partCost: (initialData?.partCost as number) || 0,
        actualCost: (initialData?.actualCost as number) || 0,
        
        description: initialData?.description || '',
        actionTaken: initialData?.actionTaken || '',
        partUsed: initialData?.partUsed || '',
        replacedPart: initialData?.replacedPart || '',
        
        startedAt: initialData?.startedAt, 
        finishedAt: initialData?.finishedAt,
        
        // <<< BỔ SUNG TRƯỜNG DIAGNOSTIC CODES VÀ TRƯỜNG TEXT NGƯỜI TẠO >>>
        diagnosticCodes: (initialData as ReportResponse)?.diagnosticCodes || '',
        createdByText: isEditing ? (initialData as ReportResponse)?.createdByText : currentUsername,
        // <<< HẾT BỔ SUNG >>>
    });
    
    // Load Claims và Technicians
    useEffect(() => {
        const loadData = async () => {
            try {
                // Lấy tất cả Claims và lọc ra Claims có thể tạo Report
                const allClaims = await getAllWarrantyClaims();
                const validClaims = allClaims.filter(c => {
                    const status = c.status.toUpperCase().trim();
                    return ['SENT', 'APPROVED', 'IN_PROCESS', 'IN_PROGRESS'].includes(status);
                });
                setClaims(validClaims);
                
                // Lấy Technicians
                const techs = await getAllTechnicians();
                setTechnicians(techs);

                // --- Tự động gán Claim ID/FKs khi tạo mới ---
                if (!isEditing) {
                    const currentClaimId = formState.claimId || initialClaimId;
                    
                    if (currentClaimId && currentClaimId > 0) {
                        // Nếu có claimId từ props (từ trang detail), tìm và gán FKs
                        const selectedClaim = validClaims.find(c => c.id === currentClaimId);
                        if (selectedClaim) {
                            setFormState(prev => ({
                                ...prev,
                                vehicleId: selectedClaim.vehicleId || prev.vehicleId,
                                centerId: selectedClaim.centerId || prev.centerId,
                                technicianId: selectedClaim.technicianId || (techs.length > 0 ? techs[0].id : prev.technicianId)
                            }));
                        }
                    } else if (validClaims.length > 0) {
                        // Nếu chưa có claimId nào (tạo từ trang admin/reports), chọn claim đầu tiên
                        const firstClaim = validClaims[0];
                        setFormState(prev => ({ 
                            ...prev, 
                            claimId: firstClaim.id,
                            vehicleId: firstClaim.vehicleId || prev.vehicleId,
                            centerId: firstClaim.centerId || prev.centerId,
                            technicianId: firstClaim.technicianId || (techs.length > 0 ? techs[0].id : prev.technicianId)
                        }));
                    }
                }
                
                // Gán Technician đầu tiên nếu chưa gán
                if (!isEditing && formState.technicianId === 0 && techs.length > 0) {
                    setFormState(prev => ({ 
                        ...prev, 
                        technicianId: prev.technicianId || techs[0].id 
                    }));
                }

            } catch (err) {
                console.error("Failed to load FK data:", err);
                setError("Không thể tải danh sách Claims hoặc Technicians.");
            } finally {
                setLoadingFK(false);
            }
        };
        loadData();
    }, [isEditing, formState.claimId, initialClaimId]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue: string | number | undefined = value;

        // Chuyển đổi ID/Cost sang number
        if (name === 'technicianId' || name === 'claimId' || name === 'campaignId') {
            newValue = value ? parseInt(value) : 0;
        } else if (name === 'partCost' || name === 'actualCost') {
            newValue = parseFloat(value) || 0;
        }

        // Cập nhật VehicleId/CenterId khi Claim thay đổi
        if (name === 'claimId' && typeof newValue === 'number' && newValue > 0) {
            const selectedClaim = claims.find(c => c.id === newValue);
            if (selectedClaim) {
                setFormState(prev => ({ 
                    ...prev, 
                    claimId: newValue as number,
                    vehicleId: selectedClaim.vehicleId || prev.vehicleId, 
                    centerId: selectedClaim.centerId || prev.centerId,
                    technicianId: selectedClaim.technicianId || prev.technicianId,
                }));
                return; 
            } else {
                setFormState(prev => ({ ...prev, claimId: newValue as number }));
                return;
            }
        }


        setFormState(prev => ({ ...prev, [name]: newValue } as ReportRequest));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation: Kiểm tra các trường bắt buộc
        if (!formState.claimId || formState.claimId === 0) {
            setError("Vui lòng chọn Claim ID hợp lệ.");
            setLoading(false);
            return;
        }
        // ... (Các validation khác giữ nguyên)
        if (!formState.vehicleId || formState.vehicleId === 0) {
            setError("Vehicle ID không hợp lệ. Vui lòng chọn lại Claim.");
            setLoading(false);
            return;
        }
        
        if (!formState.centerId || formState.centerId === 0) {
            setError("Center ID không hợp lệ. Vui lòng chọn lại Claim.");
            setLoading(false);
            return;
        }
        
        if (!formState.technicianId || formState.technicianId === 0) {
            setError("Vui lòng chọn Technician.");
            setLoading(false);
            return;
        }
        
        const payloadToSend: ReportRequest = {
            ...formState,
            claimId: formState.claimId,
            technicianId: formState.technicianId,
            vehicleId: formState.vehicleId,
            centerId: formState.centerId,
            createdById: currentUserId,
            
            partCost: formState.partCost || 0,
            actualCost: formState.actualCost || 0,
            
            // Đảm bảo trường createdByText được gửi đi
            createdByText: isEditing ? (initialData as ReportResponse)?.createdByText : currentUsername, 
            
            // Đảm bảo gửi mã chẩn đoán (đã thêm)
            diagnosticCodes: formState.diagnosticCodes || undefined,
            
            // Xử lý Campaign ID (Nếu 0 thì gửi null/undefined, Backend sẽ xử lý)
            campaignId: formState.campaignId === 0 ? undefined : formState.campaignId,
        };

        try {
            await onSubmit(payloadToSend);
            // Không gọi onClose ở đây, để onSubmit (handleSaveReport) gọi
        } catch (err: unknown) {
            let errorMessage = "Lỗi tạo/cập nhật báo cáo.";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string, error?: string };
                errorMessage = apiError.message || apiError.error || errorMessage;
            }
            setError(errorMessage);
            // Re-throw error để form component cha (Modal) có thể bắt và hiển thị
            throw new Error(errorMessage); 
        } finally {
            setLoading(false);
        }
    };
    
    const readOnlyInputClass = "w-full border rounded-lg px-4 py-2 text-sm bg-gray-100 cursor-not-allowed";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                {isEditing ? `Cập nhật Báo cáo #${initialData?.id}` : "Tạo Báo cáo mới"}
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            {/* Thông tin Khóa Ngoại */}
            <div className="grid grid-cols-2 gap-4">
                {/* CLAIM ID DROP DOWN */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Claim ID *</label>
                    <select 
                        name="claimId" 
                        value={formState.claimId || ''} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500"
                        required
                        disabled={isEditing || loadingFK} // Vô hiệu hóa khi chỉnh sửa
                    >
                        <option value={0} disabled>-- Chọn Claim (SENT/IN_PROGRESS) --</option>
                        {claims.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.id} - {c.vehicleVIN} ({c.status})
                            </option>
                        ))}
                    </select>
                </div>
                 {/* TECHNICIAN DROP DOWN */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Technician *</label>
                    <select
                        name="technicianId"
                        value={formState.technicianId || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required
                        disabled={loadingFK}
                    >
                        <option value={0} disabled>-- Chọn Kỹ thuật viên --</option>
                        {technicians.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.name} (ID: {t.id})
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Vehicle ID, Center ID, User ID (READ ONLY - Tự động từ Claim) */}
                <div className="col-span-2 grid grid-cols-3 gap-4">
                    {/* Vehicle ID (Read-only) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle ID (Read-only)</label>
                        <input 
                            value={formState.vehicleId || (formState.claimId ? 'Đang tải...' : 'Chưa có')} 
                            className={readOnlyInputClass} 
                            disabled 
                        />
                    </div>
                    {/* Center ID (Read-only) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Center ID (Read-only)</label>
                        <input 
                            value={formState.centerId || (formState.claimId ? 'Đang tải...' : 'Chưa có')} 
                            className={readOnlyInputClass} 
                            disabled 
                        />
                    </div>
                    {/* User ID (Read-only) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">User ID (Created By) *</label>
                        <input value={currentUserId || 'N/A'} className={readOnlyInputClass} disabled />
                    </div>
                </div>
            </div>
            
            {/* Chi phí */}
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 pt-3">Chi phí & Trạng thái</h3>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Chi phí Linh kiện * (VND)</label>
                    <input 
                        type="number"
                        name="partCost" 
                        value={formState.partCost} 
                        onChange={handleChange} 
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required 
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Chi phí Lao động * (VND)</label>
                    <input 
                        type="number"
                        name="actualCost" 
                        value={formState.actualCost} 
                        onChange={handleChange} 
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái Report *</label>
                    <select
                        name="status"
                        value={formState.status}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required
                    >
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày Báo cáo *</label>
                    <input 
                        type="date"
                        name="reportDate" 
                        value={formState.reportDate || ''} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required 
                    />
                </div>
            </div>

            {/* Mô tả Công việc */}
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 pt-3">Mô tả Công việc & Phụ tùng</h3>
            
            {/* TRƯỜNG MỚI: Diagnostic Codes */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã Chẩn đoán (Diagnostic Codes)</label>
                <input 
                    name="diagnosticCodes" 
                    value={formState.diagnosticCodes || ''} 
                    onChange={handleChange} 
                    placeholder="Ví dụ: P0AA6, P0AA7..."
                    className="w-full border rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                />
            </div>
            
            {/* Mô tả Lỗi */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả Chẩn đoán Lỗi (Description)</label>
                <textarea name="description" value={formState.description} onChange={handleChange} rows={2} className="w-full border rounded-lg px-4 py-2 text-sm focus:border-blue-500" />
            </div>
            
            {/* Hành động đã thực hiện */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hành động Đã thực hiện (Action Taken)</label>
                <textarea name="actionTaken" value={formState.actionTaken} onChange={handleChange} rows={2} className="w-full border rounded-lg px-4 py-2 text-sm focus:border-blue-500" />
            </div>
            
            {/* Phụ tùng Đã sử dụng (Part Used) */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phụ tùng Đã sử dụng (Part Used)</label>
                <textarea name="partUsed" value={formState.partUsed} onChange={handleChange} rows={2} className="w-full border rounded-lg px-4 py-2 text-sm focus:border-blue-500" />
            </div>
            
            {/* Phụ tùng Đã thay thế (Replaced Part) */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phụ tùng Đã thay thế (Replaced Part)</label>
                <textarea name="replacedPart" value={formState.replacedPart} onChange={handleChange} rows={2} className="w-full border rounded-lg px-4 py-2 text-sm focus:border-blue-500" />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật Báo cáo' : 'Tạo Báo cáo')}
                </button>
            </div>
        </form>
    );
};

export default ReportForm;