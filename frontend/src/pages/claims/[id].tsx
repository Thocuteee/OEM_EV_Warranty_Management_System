// frontend/src/pages/claims/[id].tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { WarrantyClaimResponse } from '@/types/claim'; 
import { TechnicianResponse } from '@/types/technician';
import { ClaimPartResponse } from '@/types/claimPart';
import { WorkLogResponse } from '@/types/workLog';

import { getClaimById, updateClaimStatus } from '@/services/modules/claimService';
import { getAllTechnicians } from '@/services/modules/technicianService';
import { getClaimPartsByClaimId } from '@/services/modules/claimPartService';
import { getWorkLogsByClaimId } from '@/services/modules/workLogService';

import axios from 'axios';

// -----------------------------------------------------------------------------
// ĐỊNH NGHĨA INTERFACE CHO CÁC COMPONENT CON (Đã sửa lỗi TS2345/TS2322)
// -----------------------------------------------------------------------------

interface ClaimPartsManagerProps {
    claimId: number; 
    technicianId: number | null | undefined;
    initialParts: ClaimPartResponse[]; 
    onPartUpdate: () => void;
}

interface WorkLogManagerProps {
    claimId: number;
    technicianId: number | null | undefined;
    initialLogs: WorkLogResponse[];
}

interface AssignTechnicianProps {
    claim: WarrantyClaimResponse;
    technicians: TechnicianResponse[];
    onAssign: (technicianId: number) => void; 
}


// -----------------------------------------------------------------------------
// 1. ClaimPartsManager (Đã áp dụng typing)
// -----------------------------------------------------------------------------
const ClaimPartsManager: React.FC<ClaimPartsManagerProps> = ({ claimId, technicianId, initialParts, onPartUpdate }) => (
    <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold text-lg">Quản lý Phụ tùng ({initialParts?.length || 0})</h3>
        <p className="text-sm text-gray-500 mt-2">Tính năng Thêm/Sửa/Xóa phụ tùng yêu cầu bảo hành cho Claim {claimId}.</p>
        
        <ul className="mt-4 space-y-1 text-sm">
            {/* SỬA LỖI P.PARTNUMBER: Đảm bảo sử dụng property tồn tại trong ClaimPartResponse */}
            {initialParts?.map(p => <li key={p.partNumber || p.partId}>{p.partName} - {p.quantity} cái - {p.unitPrice.toLocaleString('vi-VN')} VND</li>)}
        </ul>
        <button className="mt-3 bg-blue-500 text-white px-3 py-1 text-sm rounded">Thêm Phụ tùng</button>
    </div>
);

// -----------------------------------------------------------------------------
// 2. WorkLogManager (Đã áp dụng typing)
// -----------------------------------------------------------------------------
const WorkLogManager: React.FC<WorkLogManagerProps> = ({ claimId, initialLogs, technicianId }) => (
    <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold text-lg">Nhật ký Công việc ({initialLogs?.length || 0})</h3>
        <p className="text-sm text-gray-500 mt-2">Tính năng ghi lại thời gian sửa chữa của Kỹ thuật viên.</p>
        <button className="mt-3 bg-green-500 text-white px-3 py-1 text-sm rounded">Thêm Log Công việc</button>
    </div>
);

// -----------------------------------------------------------------------------
// 3. AssignTechnician (Đã áp dụng typing)
// -----------------------------------------------------------------------------
const AssignTechnician: React.FC<AssignTechnicianProps> = ({ claim, technicians, onAssign }) => {
    const [selectedTech, setSelectedTech] = useState(claim.technicianId || '');

    // Hàm gọi khi nhấn Gán (Placeholder)
    const handleAssignClick = () => {
        if (selectedTech) {
            onAssign(parseInt(selectedTech as string));
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-bold text-lg">Gán Kỹ thuật viên</h3>
            <p className="text-sm">Kỹ thuật viên hiện tại: <span className="font-semibold">{claim.technicianId || 'Chưa gán'}</span></p>
            <select 
                className="mt-3 w-full border rounded p-2 text-sm"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
            >
                <option value="">-- Chọn Kỹ thuật viên --</option>
                {technicians.map(t => <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>)}
            </select>
            <button 
                className="mt-3 bg-indigo-500 text-white px-3 py-1 text-sm rounded hover:bg-indigo-600 disabled:opacity-50"
                onClick={handleAssignClick}
                disabled={!selectedTech}
            >
                Gán
            </button>
        </div>
    );
};


// -----------------------------------------------------------------------------
// Main Component: ClaimDetailPage
// -----------------------------------------------------------------------------

export default function ClaimDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    
    // Lấy ID từ URL và chuyển sang kiểu number
    const claimId = typeof id === 'string' ? parseInt(id) : null;
    
    const [claim, setClaim] = useState<WarrantyClaimResponse | null>(null);
    const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);
    const [claimParts, setClaimParts] = useState<ClaimPartResponse[]>([]);
    const [workLogs, setWorkLogs] = useState<WorkLogResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'info' | 'parts' | 'logs'>('info');

    const isEVMApprover = user?.role === 'Admin' || user?.role === 'EVM_Staff';
    const canSendOrDelete = user?.role === 'SC_Staff';
    const isTech = user?.role === 'SC_Technician';

    const fetchData = useCallback(async () => {
        if (!claimId) return;
        setIsLoading(true);
        try {
            // SỬA LỖI TS2345/TS2322: Sử dụng Array Destructuring Tường minh
            const [claimData, techs, parts, logs] = await Promise.all([
                getClaimById(claimId),
                getAllTechnicians(),
                getClaimPartsByClaimId(claimId),
                getWorkLogsByClaimId(claimId)
            ]) as [WarrantyClaimResponse, TechnicianResponse[], ClaimPartResponse[], WorkLogResponse[]];
            
            setClaim(claimData);
            setTechnicians(techs);
            setClaimParts(parts);
            setWorkLogs(logs);

        } catch (e: unknown) {
            console.error("Failed to load claim detail:", e);
            setError("Không thể tải chi tiết Claim này.");
        } finally {
            setIsLoading(false);
        }
    }, [claimId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleApproval = async (status: 'APPROVED' | 'REJECTED') => {
        if (!claim || !user || claim.approvalStatus !== 'PENDING') return;

        if (!confirm(`Bạn có chắc muốn ${status === 'APPROVED' ? 'PHÊ DUYỆT' : 'TỪ CHỐI'} Claim ID ${claim.id}?`)) return;
        
        try {
            // Dùng hàm updateClaimStatus đã sửa
            await updateClaimStatus(claim.id, status);
            alert(`Claim đã được cập nhật thành ${status}.`);
            fetchData();
        } catch (e: unknown) {
            const message = axios.isAxiosError(e) ? e.response?.data?.message || 'Lỗi server khi phê duyệt.' : 'Lỗi không xác định.';
            alert(message);
        }
    }

    const handleAssignTechnician = (technicianId: number) => {
        // TODO: Cần implement API PUT để cập nhật technicianId cho Claim.
        console.log(`Assigning Claim ${claimId} to Technician ID: ${technicianId}`);
        alert(`Chức năng Gán đang được triển khai API! Đã chọn ID: ${technicianId}`);
        // Sau khi API thành công: fetchData();
    };
    
    const handlePartUpdate = () => {/* Logic khi thêm/sửa phụ tùng */}; 

    if (!claimId || isLoading) {
        return (
            <Layout>
                <div className="py-20 text-center text-lg text-blue-600">
                    {isLoading ? "Đang tải chi tiết Claim..." : "Claim ID không hợp lệ."}
                </div>
            </Layout>
        );
    }

    if (error || !claim) {
        return (
            <Layout>
                <div className="p-6 text-red-600 bg-red-100 border border-red-300 rounded-lg">
                    {error}
                </div>
            </Layout>
        );
    }
    
    const statusClass = (status: string) => {
        switch (status.toUpperCase().trim()) {
            case "APPROVED": return "bg-green-500";
            case "SENT": return "bg-indigo-500";
            case "PENDING": return "bg-yellow-500";
            case "REJECTED": return "bg-red-500";
            default: return "bg-gray-500";
        }
    }


    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết Yêu cầu Bảo hành #{claim.id}</h1>
            <p className="text-gray-600 mb-6">VIN: {claim.vehicleVIN} | Khách hàng: {claim.customerName}</p>

            <div className="space-y-8">
                {/* Thanh Trạng thái và Hành động Phê duyệt (Dành cho EVM Staff/Admin) */}
                <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${statusClass(claim.status)}`}>
                            STATUS: {claim.status}
                        </span>
                        <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${statusClass(claim.approvalStatus)}`}>
                            APPROVAL: {claim.approvalStatus}
                        </span>
                    </div>

                    {/* Nút Phê duyệt/Từ chối (Chỉ hiện cho EVM Approver khi trạng thái là PENDING) */}
                    {isEVMApprover && claim.approvalStatus === 'PENDING' && (
                        <div className="space-x-2">
                            <button 
                                onClick={() => handleApproval('APPROVED')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                            >
                                ✅ Phê duyệt
                            </button>
                            <button
                                onClick={() => handleApproval('REJECTED')}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                            >
                                ❌ Từ chối
                            </button>
                        </div>
                    )}
                </div>

                {/* Phần 1: Thông tin cơ bản & Gán kỹ thuật viên */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border space-y-3">
                        <h2 className="text-xl font-bold text-gray-800">Thông tin Claim</h2>
                        <p><strong>Mô tả:</strong> {claim.description}</p>
                        <p><strong>Trung tâm:</strong> ID {claim.centerId}</p>
                        <p><strong>Chi phí dự kiến:</strong> {claim.totalCost.toLocaleString('vi-VN')} VND</p>
                        <p><strong>Tạo lúc:</strong> {new Date(claim.createdAt).toLocaleString()}</p>
                    </div>

                    {/* Module Gán Kỹ thuật viên (Chỉ SC Staff/Tech) */}
                    {(canSendOrDelete || isTech) && (
                        <AssignTechnician 
                            claim={claim}
                            technicians={technicians} 
                            onAssign={handleAssignTechnician} 
                        />
                    )}
                </div>

                {/* Phần 2: Tab Quản lý Công việc & Phụ tùng */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="flex border-b mb-4 space-x-4">
                        <button 
                            onClick={() => setActiveTab('parts')}
                            className={`pb-2 font-semibold ${activeTab === 'parts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                        >
                            Quản lý Phụ tùng
                        </button>
                        <button 
                            onClick={() => setActiveTab('logs')}
                            className={`pb-2 font-semibold ${activeTab === 'logs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                        >
                            Nhật ký Công việc
                        </button>
                    </div>

                    <div>
                        {activeTab === 'parts' && (
                            <ClaimPartsManager 
                                claimId={claim.id} 
                                technicianId={claim.technicianId}
                                initialParts={claimParts} 
                                onPartUpdate={handlePartUpdate} 
                            />
                        )}
                        {activeTab === 'logs' && (
                            <WorkLogManager 
                                claimId={claim.id} 
                                technicianId={claim.technicianId}
                                initialLogs={workLogs} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}