"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { RecallCampaignResponse, RecallCampaignRequest } from "@/types/campaign"; 
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

// IMPORT CÁC COMPONENT VÀ SERVICE CẦN THIẾT
import { getAllCampaigns, createCampaign, updateCampaign, deleteCampaign } from "@/services/modules/campaignService"; 
import { RecallCampaignForm, RecallCampaignTable } from "@/campaigns"; // <--- IMPORT CÁC COMPONENT ĐÃ TÁCH

// --- Trang Admin Campaigns ---
export default function AdminCampaignsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [campaigns, setCampaigns] = useState<RecallCampaignResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<RecallCampaignResponse | null>(null);

    const allowedRoles = ["Admin", "EVM_Staff"]; 

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedRoles.includes(user.role)) { router.push("/"); return; }
        
        loadData();
    }, [isAuthenticated, user, router]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getAllCampaigns();
            setCampaigns(data);
        } catch(err) {
            console.error("Lỗi tải dữ liệu Campaign:", err);
            setToast("Không thể tải danh sách Chiến dịch.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCampaign = async (payload: RecallCampaignRequest) => {
        try {
            if (payload.id) {
                await updateCampaign(payload.id, payload);
                setToast("Cập nhật Chiến dịch thành công!");
            } else {
                await createCampaign(payload);
                setToast("Thêm Chiến dịch mới thành công!");
            }
            await loadData(); 
            setIsModalOpen(false);
            setEditingCampaign(null);
        } catch(err: unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Lỗi khi lưu Chiến dịch. Kiểm tra tiêu đề có bị trùng.";
        
            throw new Error(errorMessage);
        }
    };
    
    const handleDeleteCampaign = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa Chiến dịch này? (Chỉ xóa nếu không có xe liên quan)")) return;
        try {
            await deleteCampaign(id);
            setToast("Đã xóa Chiến dịch thành công.");
            await loadData();
        } catch {
            setToast("Lỗi khi xóa Chiến dịch.");
        }
    };
    
    const filteredCampaigns = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();
        return campaigns.filter(c => 
            c.title.toLowerCase().includes(keyword) || 
            c.campaignStatus.toLowerCase().includes(keyword)
        );
    }, [campaigns, searchKeyword]);
    
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);
    
    if (isLoading || !user) return <AdminLayout><p>Đang tải dữ liệu...</p></AdminLayout>;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-4">Quản lý Chiến dịch Triệu hồi (Recall Campaigns)</h1>

            <div className="flex justify-between items-center mb-6">
                <input 
                    placeholder="Tìm theo Tiêu đề, Trạng thái..." 
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <button
                    onClick={() => { setEditingCampaign(null); setIsModalOpen(true); }}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors"
                >
                    + Tạo Chiến dịch mới
                </button>
            </div>

            {/* SỬ DỤNG COMPONENT ĐÃ TÁCH */}
            <RecallCampaignTable 
                campaigns={filteredCampaigns}
                onEdit={(c) => { setEditingCampaign(c); setIsModalOpen(true); }}
                onDelete={handleDeleteCampaign}
            />
            
            {/* Modal tạo/cập nhật Campaign */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                        {/* SỬ DỤNG COMPONENT FORM ĐÃ TÁCH */}
                        <RecallCampaignForm
                            initialData={editingCampaign}
                            onSubmit={handleSaveCampaign}
                            onClose={() => { setIsModalOpen(false); setEditingCampaign(null); }}
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
        </AdminLayout>
    );
}