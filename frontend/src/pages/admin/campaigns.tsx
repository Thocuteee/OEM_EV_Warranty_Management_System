"use client";

import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

// Import Types
import { RecallCampaignResponse, RecallCampaignRequest } from "@/types/campaign"; 

// Import Components
import RecallCampaignTable from "@/campaigns/RecallCampaignTable";
import RecallCampaignForm from "@/campaigns/RecallCampaignForm";
import CampaignVehicleManager from "@/campaigns/CampaignVehicleManager"; 

// Import Service functions
import { getAllCampaigns, createCampaign, updateCampaign, deleteCampaign } from "@/services/modules/campaignService";

interface RecallCampaignTableProps {
    campaigns: RecallCampaignResponse[];
    onEdit: (c: RecallCampaignResponse) => void;
    onDelete: (id: number) => void;
    onManageVehicles: (campaign: RecallCampaignResponse) => void; // [MỚI] Handler quản lý xe
    canModify: boolean; 
}

const CampaignTable: React.FC<RecallCampaignTableProps> = ({ campaigns, onEdit, onDelete, onManageVehicles, canModify }) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-800">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-800">Tiêu đề</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-800">Thời gian</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-800">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-800">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {campaigns.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                                Không có Chiến dịch nào.
                            </td>
                        </tr>
                    ) : (
                        campaigns.map((c) => (
                            <tr key={c.id} className="hover:bg-red-50/50 transition-colors">
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{c.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{c.title}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                    {c.startDate} - {c.endDate}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.campaignStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {c.campaignStatus}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm space-x-2">
                                    {canModify && (
                                        <>
                                            <button 
                                                onClick={() => onManageVehicles(c)} 
                                                className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold p-1 hover:bg-indigo-50 rounded transition-colors"
                                            >
                                                Quản lý Xe
                                            </button>
                                            <button 
                                                onClick={() => onEdit(c)} 
                                                className="text-blue-600 hover:text-blue-800 text-xs font-semibold p-1 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                onClick={() => onDelete(c.id)} 
                                                className="text-red-600 hover:text-red-800 text-xs font-semibold p-1 hover:bg-red-50 rounded transition-colors"
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);


export default function CampaignsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [campaigns, setCampaigns] = useState<RecallCampaignResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<RecallCampaignResponse | null>(null);

    // [MỚI] State cho Quản lý Xe
    const [isVehicleManagerOpen, setIsVehicleManagerOpen] = useState(false);
    const [managingCampaign, setManagingCampaign] = useState<RecallCampaignResponse | null>(null);
    

    const allowedRoles = ["Admin", "EVM_Staff"];
    const canModify = !!(user && allowedRoles.includes(user.role));

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedRoles.includes(user.role)) { router.push("/admin"); return; }
        
        loadData();
    }, [isAuthenticated, user, router]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getAllCampaigns();
            setCampaigns(data);
        } catch(err) {
            console.error("Lỗi tải dữ liệu:", err);
            setToast("Không thể tải danh sách Chiến dịch.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handlers (Giữ nguyên)
    const handleSave = async (payload: RecallCampaignRequest) => {
        try {
            if (payload.id) {
                await updateCampaign(payload.id, payload);
                setToast("Cập nhật Chiến dịch thành công!");
            } else {
                await createCampaign(payload);
                setToast("Thêm Chiến dịch thành công!");
            }
            await loadData(); 
            setIsModalOpen(false);
            setEditingCampaign(null);
        } catch(err: unknown) {
             const errorMessage = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Lỗi khi lưu Chiến dịch.";
             throw new Error(errorMessage);
        }
    };
    
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa Chiến dịch này?")) return;
        try {
            await deleteCampaign(id);
            setToast("Đã xóa Chiến dịch thành công.");
            await loadData();
        } catch {
            setToast("Lỗi khi xóa Chiến dịch. Đảm bảo không có liên kết FK.");
        }
    };

    // [MỚI] Handler mở modal Quản lý Xe
    const handleManageVehicles = (campaign: RecallCampaignResponse) => {
        setManagingCampaign(campaign);
        setIsVehicleManagerOpen(true);
    };
    
    // [MỚI] Handler đóng modal Quản lý Xe
    const handleCloseVehicleManager = () => {
        setIsVehicleManagerOpen(false);
        setManagingCampaign(null);
        loadData(); // Tải lại danh sách nếu cần
    };

    const filteredCampaigns = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();
        return campaigns.filter(c => 
            c.title.toLowerCase().includes(keyword) || 
            (c.campaignStatus?.toLowerCase() || '').includes(keyword)
        );
    }, [campaigns, searchKeyword]);
    
    
    if (isLoading || !user) return <Layout><p>Đang tải dữ liệu...</p></Layout>;

    return (
        <Layout>
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Chiến dịch Triệu hồi & Dịch vụ</h1>
                <p className="text-gray-600 mt-1">Quản lý các chiến dịch Recall/Service Campaigns và gán các xe bị ảnh hưởng.</p>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <input 
                    placeholder="Tìm theo Tiêu đề, Trạng thái..."
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:ring-red-500 focus:border-red-500 transition-shadow"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                {canModify && (
                    <button
                        onClick={() => { setEditingCampaign(null); setIsModalOpen(true); }}
                        className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-colors"
                    >
                        + Thêm Chiến dịch
                    </button>
                )}
            </div>

            <CampaignTable
                campaigns={filteredCampaigns}
                onEdit={(c) => { setEditingCampaign(c); setIsModalOpen(true); }}
                onDelete={handleDelete}
                onManageVehicles={handleManageVehicles} // [MỚI] Truyền handler vào Table
                canModify={canModify}
            />
            
            {/* Modal tạo/cập nhật Campaign */}
            {isModalOpen && canModify && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                        <RecallCampaignForm
                            initialData={editingCampaign}
                            onSubmit={handleSave}
                            onClose={() => { setIsModalOpen(false); setEditingCampaign(null); }}
                        />
                    </div>
                </div>
            )}
            
            {/* [MỚI] Modal Quản lý Xe trong Campaign */}
            {isVehicleManagerOpen && managingCampaign && canModify && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300 overflow-y-auto max-h-[90vh]">
                        <CampaignVehicleManager
                            campaign={managingCampaign}
                            onClose={handleCloseVehicleManager}
                        />
                    </div>
                </div>
            )}


            {/* Toast thông báo */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg transition-opacity duration-300">
                    {toast}
                </div>
            )}
        </Layout>
    );
}