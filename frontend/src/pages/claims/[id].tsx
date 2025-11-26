"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { WarrantyClaimResponse } from '@/types/claim'; 
import { TechnicianResponse } from '@/types/technician';
import { ClaimPartResponse, ClaimPartRequest } from '@/types/claimPart';
import { WorkLogResponse, WorkLogRequest } from '@/types/workLog';
import { ReportRequest } from '@/types/report'; 

// IMPORT FORMS
import ReportForm from "@/reports/ReportForm"; 
import WorkLogForm from "@/worklogs/WorkLogForm"; 
import ClaimPartForm from "@/claims/ClaimPartForm";
import VehiclePartHistoryForm from "@/components/VehiclePartHistoryForm"; 

// IMPORT SERVICES
import { getClaimById, updateClaimStatus, updateClaimTechnician } from '@/services/modules/claimService';
import { getAllTechnicians } from '@/services/modules/technicianService';
import { getClaimPartsByClaimId, createClaimPart, deleteClaimPartByCompositeId } from '@/services/modules/claimPartService'; 
import { getWorkLogsByClaimId, createWorkLog, deleteWorkLog } from '@/services/modules/workLogService'; 
import { createReport } from '@/services/modules/reportService';
import { createVehiclePartHistory } from '@/services/modules/vehiclePartHistoryService';
import { VehiclePartHistoryRequest } from '@/types/vehiclePartHistory'; 

import axios from 'axios';
interface ClaimPartsManagerProps { 
    claimId: number; 
    technicianId: number | null | undefined;
    initialParts: ClaimPartResponse[]; 
    onPartUpdate: () => void;
    onAddPart: () => void; 
    onDeletePart: (partId: number) => void;
}

interface WorkLogManagerProps {
    claimId: number;
    technicianId: number | null | undefined;
    initialLogs: WorkLogResponse[];
    onAddLog: () => void;
    onDeleteLog: (logId: number) => void;
}

interface AssignTechnicianProps {
    claim: WarrantyClaimResponse;
    technicians: TechnicianResponse[];
    onAssign: (technicianId: number) => void; 
}


// 1. ClaimPartsManager (Đã kiểm tra, logic phụ tùng hoàn chỉnh)
const ClaimPartsManager: React.FC<ClaimPartsManagerProps> = ({ claimId, initialParts, onAddPart, onDeletePart }) => (
    <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold text-xl mb-3">Quản lý Phụ tùng ({initialParts?.length || 0})</h3>
        
        {initialParts?.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có linh kiện nào được ghi nhận cho yêu cầu này.</p>
        ) : (
            <ul className="mt-4 space-y-2 text-sm max-h-60 overflow-y-auto border-t pt-3">
                {initialParts?.map(p => (
                    <li key={`${p.partNumber}-${p.claimId}`} className="flex justify-between items-center border-b pb-1">
                        <div>
                            <span className="font-medium text-gray-700">{p.partName} <span className="text-gray-500">({p.partNumber})</span></span>
                            <div className="text-blue-700 font-bold text-xs">{p.quantity} cái x {p.unitPrice.toLocaleString('vi-VN')} VND</div>
                        </div>
                        <button 
                            onClick={() => onDeletePart(p.partId)} 
                            className="text-red-500 hover:text-red-700 text-xs font-semibold p-1"
                        >
                            Xóa
                        </button>
                    </li>
                ))}
            </ul>
        )}
        
        <button 
            onClick={onAddPart} // Gọi hàm handler ở lớp cha
            className="mt-4 bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700"
        >
            + Thêm Phụ tùng
        </button>
    </div>
);

// 2. WorkLogManager (Đã kiểm tra, logic Work Log hoàn chỉnh)
const WorkLogManager: React.FC<WorkLogManagerProps> = ({ claimId, initialLogs, technicianId, onAddLog, onDeleteLog }) => (
    <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold text-xl mb-3">Nhật ký Công việc ({initialLogs?.length || 0})</h3>
        
        {initialLogs?.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có nhật ký công việc nào.</p>
        ) : (
            <ul className="mt-4 space-y-2 text-sm max-h-60 overflow-y-auto border-t pt-3">
                {initialLogs?.map(log => (
                    <li key={log.id} className="border-b pb-1 flex justify-between items-center">
                        <div>
                            <div className="flex justify-start font-medium">
                                <span className="text-gray-800">🛠️ {log.technicianName}</span>
                                <span className="text-indigo-600 ml-4">{log.duration.toLocaleString()} Ngày</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">Notes: {log.notes}</p>
                        </div>
                        <button 
                            onClick={() => onDeleteLog(log.id)} 
                            className="text-red-500 hover:text-red-700 text-xs font-semibold p-1"
                        >
                            Xóa
                        </button>
                    </li>
                ))}
            </ul>
        )}
        
        <button 
            onClick={onAddLog} // Gọi hàm handler ở lớp cha
            className="mt-4 bg-indigo-600 text-white px-3 py-2 text-sm rounded hover:bg-indigo-700"
        >
            + Thêm Log Công việc
        </button>
    </div>
);


// 3. AssignTechnician (KHÔNG ĐỔI)
const AssignTechnician: React.FC<AssignTechnicianProps> = ({ claim, technicians, onAssign }) => {
    const { user } = useAuth();
    const canAssign = user && ['Admin', 'EVM_Staff', 'SC_Staff'].includes(user.role);
    
    // Tìm tech hiện tại để hiển thị tên
    const currentTech = technicians.find(t => t.id === claim.technicianId);

    const [selectedTech, setSelectedTech] = useState(claim.technicianId ? String(claim.technicianId) : '');
    
    // Chỉ cho phép gán nếu Claim chưa hoàn thành hoặc bị từ chối phê duyệt
    const isModificationAllowed = !['COMPLETED', 'REJECTED'].includes(claim.status.toUpperCase()) && canAssign;

    const handleAssignClick = () => {
        if (!selectedTech || !canAssign) return;

        const techId = parseInt(selectedTech);
        onAssign(techId); 
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border space-y-3">
            <h3 className="font-bold text-lg text-gray-800">Gán Kỹ thuật viên</h3>
            
            <p className="text-sm text-gray-700">
                Kỹ thuật viên hiện tại: <span className="font-semibold text-indigo-600">
                    {claim.technicianId ? `${currentTech?.name || 'ID không rõ'}` : 'Chưa gán'}
                </span>
            </p>
            
            {isModificationAllowed && (
                <>
                    <select 
                        className="w-full border rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        value={selectedTech}
                        onChange={(e) => setSelectedTech(e.target.value)}
                        disabled={!isModificationAllowed}
                    >
                        <option value="">-- Chọn Kỹ thuật viên --</option>
                        {technicians.map(t => <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>)}
                    </select>
                    <button 
                        className="w-full bg-indigo-600 text-white px-3 py-2 text-sm rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        onClick={handleAssignClick}
                        disabled={!selectedTech || !isModificationAllowed}
                    >
                        Gán Kỹ thuật viên
                    </button>
                </>
            )}
        </div>
    );
};


export default function ClaimDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    
    const claimId = typeof id === 'string' ? parseInt(id) : null;
    
    const [claim, setClaim] = useState<WarrantyClaimResponse | null>(null);
    const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);
    const [claimParts, setClaimParts] = useState<ClaimPartResponse[]>([]);
    const [workLogs, setWorkLogs] = useState<WorkLogResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'parts' | 'logs'>('parts'); 
    
    const [isReportModalOpen, setIsReportModalOpen] = useState(false); 
    const [isWorkLogModalOpen, setIsWorkLogModalOpen] = useState(false);
    const [isClaimPartModalOpen, setIsClaimPartModalOpen] = useState(false);
    const [isVehiclePartHistoryModalOpen, setIsVehiclePartHistoryModalOpen] = useState(false);

    // Định nghĩa quyền
    const isEVMApprover = user?.role === 'Admin' || user?.role === 'EVM_Staff';
    const canSendOrDelete = user?.role === 'SC_Staff';
    const isTech = user?.role === 'SC_Technician';

    const fetchData = useCallback(async () => {
        if (!claimId) return;
        setIsLoading(true);
        try {
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
            await updateClaimStatus(claim.id, status);
            alert(`Claim đã được cập nhật thành ${status}.`);
            fetchData();
        } catch (e: unknown) {
            const message = axios.isAxiosError(e) ? e.response?.data?.message || 'Lỗi server khi phê duyệt.' : 'Lỗi không xác định.';
            alert(message);
        }
    }

    const handleAssignTechnician = async (technicianId: number) => {
        if (!claim) return;
        try {
            await updateClaimTechnician(claim.id, technicianId); 
            alert(`Đã gán thành công Kỹ thuật viên ID ${technicianId}.`);
            fetchData(); 
        } catch (e: unknown) {
            const message = axios.isAxiosError(e) ? e.response?.data?.message || 'Lỗi gán kỹ thuật viên.' : 'Lỗi không xác định.';
            alert(message);
        }
    };
    
    const handlePartUpdate = () => {
        fetchData(); 
    }; 
    
    const handleCreateWorkLog = async (payload: WorkLogRequest) => {
        try {
            await createWorkLog(payload);
            alert("Đã thêm Nhật ký Công việc thành công!");
            setIsWorkLogModalOpen(false);
            fetchData(); 
        } catch (e: unknown) {
            const message = axios.isAxiosError(e) ? e.response?.data?.message || 'Lỗi thêm Work Log.' : 'Lỗi không xác định.';
            throw new Error(message); 
        }
    }
    
    const handleDeleteWorkLog = async (logId: number) => {
        if (!confirm(`Bạn có chắc muốn xóa Nhật ký Công việc ID ${logId}?`)) return;
        try {
            await deleteWorkLog(logId);
            alert("Đã xóa Nhật ký Công việc.");
            fetchData();
        } catch (e: unknown) {
            alert('Lỗi khi xóa Work Log.');
        }
    }

    const handleCreateClaimPart = async (payload: ClaimPartRequest) => {
        try {
            await createClaimPart(payload); 
            alert("Phụ tùng đã được thêm/cập nhật thành công!");
            setIsClaimPartModalOpen(false);
            fetchData(); 
        } catch (e: unknown) {
            const message = axios.isAxiosError(e) ? e.response?.data?.message || 'Lỗi thêm Phụ tùng Claim. Kiểm tra Part ID và Claim ID.' : 'Lỗi không xác định.';
            throw new Error(message); 
        }
    }
    
    const handleDeleteClaimPart = async (partId: number) => {
        if (!confirm(`Bạn có chắc muốn xóa Linh kiện ID ${partId} khỏi Claim này?`)) return;
        try {
            await deleteClaimPartByCompositeId(claimId!, partId); 
            alert("Đã xóa Linh kiện khỏi Claim.");
            fetchData();
        } catch (e: unknown) {
            alert('Lỗi khi xóa Claim Part.');
        }
    }

    const handleReportSubmit = async (payload: ReportRequest) => {
        if (!user || !claim) return;
        
        const finalPayload: ReportRequest = {
            ...payload,
            claimId: claim.id,
            vehicleId: claim.vehicleId, 
            centerId: claim.centerId, 
        }

        try {
            await createReport(finalPayload); 
            alert("Báo cáo công việc đã được tạo thành công!");
            setIsReportModalOpen(false);
            fetchData(); 
        } catch (e: unknown) {
            const message = axios.isAxiosError(e) ? e.response?.data?.message || 'Lỗi tạo báo cáo. Đảm bảo dữ liệu không bị trùng lặp.' : 'Lỗi không xác định.';
            throw new Error(message); 
        }
    }

    const handleCreateVehiclePartHistory = async (payload: VehiclePartHistoryRequest) => {
        if (!claim) return;
        
        try {
            await createVehiclePartHistory(payload);
            alert("Đã ghi nhận lịch sử linh kiện thành công!");
            setIsVehiclePartHistoryModalOpen(false);
            fetchData();
        } catch (e: unknown) {
            const message = axios.isAxiosError(e) ? e.response?.data?.message || 'Lỗi ghi nhận lịch sử linh kiện. Kiểm tra Vehicle ID, Part Serial ID và Claim ID.' : 'Lỗi không xác định.';
            throw new Error(message);
        }
    }
    
    // ĐỊNH NGHĨA BIẾN KIỂM TRA QUYỀN
    // Chấp nhận cả IN_PROCESS và IN_PROGRESS (do có thể có dữ liệu cũ)
    const statusUpper = claim?.status.toUpperCase();
    const isClaimInProgress = statusUpper === 'IN_PROCESS' || statusUpper === 'IN_PROGRESS'; 
    const isAllowedToWork = (isEVMApprover || canSendOrDelete || isTech) && isClaimInProgress;
    const canCreateReport = isAllowedToWork;
    
    const handleAddWorkDataClick = (type: 'log' | 'part') => {
        const currentStatus = claim?.status.toUpperCase();

        if (isAllowedToWork) {
            // Trường hợp 1: ĐƯỢC PHÉP THAO TÁC -> MỞ MODAL
            if (type === 'part') {
                setIsClaimPartModalOpen(true);
            } else {
                setIsWorkLogModalOpen(true);
            }
        } else {
            // Trường hợp 2: BỊ CHẶN -> HIỂN THỊ LỖI RÕ RÀNG
            let message = "Bạn không có quyền thực hiện thao tác này.";
            
            if (currentStatus === 'COMPLETED' || currentStatus === 'REJECTED') {
                message = `Claim đã ở trạng thái ${currentStatus}. Không thể thêm dữ liệu mới.`;
            } 
            // SỬA LỖI LOGIC: Nếu không phải là trạng thái sẵn sàng làm việc (IN_PROCESS hoặc IN_PROGRESS)
            else if (currentStatus !== 'IN_PROCESS' && currentStatus !== 'IN_PROGRESS') { 
                message = `Claim hiện đang ở trạng thái ${currentStatus}. Vui lòng chờ Claim được chuyển sang IN_PROCESS để bắt đầu công việc.`;
            } else {
                // Trạng thái là IN_PROCESS nhưng isAllowedToWork là false => Lỗi quyền
                 message = "Bạn không thuộc nhóm Nhân viên/Kỹ thuật viên có quyền cập nhật công việc.";
            }

            alert(message);
        }
    }

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
            case "APPROVED": 
            case "IN_PROCESS": 
            case "IN_PROGRESS": // Hỗ trợ cả hai format (cũ và mới)
            case "COMPLETED": 
                return "bg-green-500";
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
                {/* Thanh Trạng thái và Hành động Phê duyệt */}
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

                {/* Phần 1: Thông tin cơ bản, Nút Report & Gán kỹ thuật viên */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border space-y-3">
                        <h2 className="text-xl font-bold text-gray-800">Thông tin Claim</h2>
                        <p><strong>Mô tả:</strong> {claim.description}</p>
                        <p><strong>Trung tâm:</strong> ID {claim.centerId}</p>
                        <p><strong>Chi phí dự kiến:</strong> {claim.totalCost.toLocaleString('vi-VN')} VND</p>
                        <p><strong>Tạo lúc:</strong> {new Date(claim.createdAt).toLocaleString()}</p>
                        
                        {/* NÚT TẠO REPORT */}
                        {canCreateReport && (
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={() => setIsReportModalOpen(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
                                >
                                    📝 Tạo Báo cáo Công việc
                                </button>
                                <button
                                    onClick={() => setIsVehiclePartHistoryModalOpen(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                                >
                                    🔧 Ghi nhận Lịch sử Linh kiện
                                </button>
                            </div>
                        )}
                    </div>

                    {(canSendOrDelete || isTech || isEVMApprover) && claim && (
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
                        {/* NÚT CHUYỂN TAB */}
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
                                onPartUpdate={fetchData} 
                                onAddPart={() => handleAddWorkDataClick('part')}
                                onDeletePart={handleDeleteClaimPart}
                            />
                        )}
                        {activeTab === 'logs' && (
                            <WorkLogManager 
                                claimId={claim.id} 
                                technicianId={claim.technicianId}
                                initialLogs={workLogs} 
                                onAddLog={() => handleAddWorkDataClick('log')}
                                onDeleteLog={handleDeleteWorkLog}
                            />
                        )}
                    </div>
                </div>
            </div>
            
            {/* MODAL TẠO REPORT */}
            {isReportModalOpen && claim && user && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300 overflow-y-auto max-h-[90vh]">
                        <ReportForm
                            initialClaimId={claim.id} 
                            initialVehicleId={claim.vehicleId} 
                            initialCenterId={claim.centerId} 
                            currentUserId={user.id}
                            currentUsername={user.username}
                            onSubmit={handleReportSubmit}
                            onClose={() => setIsReportModalOpen(false)}
                        />
                    </div>
                </div>
            )}
            
            {/* MODAL TẠO WORK LOG */}
            {isWorkLogModalOpen && claim && user && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                        <WorkLogForm
                            claimId={claim.id}
                            initialTechnicianId={claim.technicianId}
                            onSubmit={handleCreateWorkLog}
                            onClose={() => setIsWorkLogModalOpen(false)}
                        />
                    </div>
                </div>
            )}
            
            {/* MODAL TẠO CLAIM PART */}
            {isClaimPartModalOpen && claim && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                        <ClaimPartForm
                            claimId={claim.id}
                            onSubmit={handleCreateClaimPart}
                            onClose={() => setIsClaimPartModalOpen(false)}
                        />
                    </div>
                </div>
            )}
            
            {/* MODAL TẠO VEHICLE PART HISTORY */}
            {isVehiclePartHistoryModalOpen && claim && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                        <VehiclePartHistoryForm
                            vehicleId={claim.vehicleId}
                            claimId={claim.id}
                            onSubmit={handleCreateVehiclePartHistory}
                            onClose={() => setIsVehiclePartHistoryModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </Layout>
    );
}