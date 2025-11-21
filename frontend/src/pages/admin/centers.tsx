// frontend/src/pages/admin/centers.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { ServiceCenterResponse } from "@/types/center"; 
import { CenterRequestPayload } from "@/centers/CenterForm"; // Import từ Component mới
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

// IMPORT SERVICE
import { getAllServiceCenters } from "@/services/modules/centerService"; 
// Gán lại tên hàm CRUD từ Controller API (Dùng trực tiếp POST/PUT/DELETE từ Controller)
import { apiClient } from "@/services/coreApiClient";

// IMPORT COMPONENTS
import CenterForm from "@/centers/CenterForm"; 
import CenterTable from "@/centers/CenterTable"; 

export default function AdminCentersPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [centers, setCenters] = useState<ServiceCenterResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingCenter, setEditingCenter] = useState<ServiceCenterResponse | null>(null);
    
    // Chỉ Admin và EVM Staff có quyền quản lý Service Center
    const canModify = user?.role === "Admin" || user?.role === "EVM_Staff"; 
    
    // ---------------------------------------
    // BẢO VỆ ROUTE & LOAD DATA
    // ---------------------------------------
    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        // Kiểm tra quyền (Nếu không có quyền, chuyển hướng về Dashboard)
        if (user && !canModify) { router.push("/"); return; }
        
        loadCenters();
    }, [isAuthenticated, user, router]);

    const loadCenters = async () => {
        setIsLoading(true);
        try {
            const data = await getAllServiceCenters(); // Sử dụng Service đã có
            setCenters(data);
        } catch {
            setToast("Không thể tải danh sách Trung tâm Dịch vụ.");
        } finally {
            setIsLoading(false);
        }
    };
    

    // ---------------------------------------
    // Lọc Trung tâm
    // ---------------------------------------
    const filteredCenters = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();
        return centers.filter(c => 
            c.name.toLowerCase().includes(keyword) || 
            c.location.toLowerCase().includes(keyword)
        );
    }, [centers, searchKeyword]);


    // ---------------------------------------
    // Xử lý tạo/cập nhật (Save Handler)
    // ---------------------------------------
    const handleSaveCenter = async (payload: CenterRequestPayload) => {
        let errorMessage = "Lỗi thao tác Trung tâm không xác định.";
        
        try {
            let response;
            if (payload.id) {
                // UPDATE: PUT /api/centers/{id}
                response = await apiClient.put<ServiceCenterResponse>(`/centers/${payload.id}`, payload);
                setToast("Cập nhật Trung tâm thành công!");
            } else {
                // CREATE: POST /api/centers
                response = await apiClient.post<ServiceCenterResponse>('/centers', payload);
                setToast("Thêm Trung tâm thành công!");
            }
            
            // Tải lại dữ liệu sau khi thành công
            await loadCenters(); 
            setModalOpen(false);
            setEditingCenter(null);

        } catch (err : unknown) {
            // Xử lý lỗi trùng tên (ví dụ: ServiceCenterServiceImpl)
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string };
                errorMessage = apiError.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            // Ném lỗi để Form hiển thị
            throw new Error(errorMessage); 
        }
    };

    // ---------------------------------------
    // Xử lý xóa
    // ---------------------------------------
    const handleDeleteCenter = async (id: number) => {
        if (!confirm(`Bạn chắc chắn muốn xóa Trung tâm ID ${id}? (Chỉ có thể xóa nếu không còn liên kết FK)`)) return;

        try {
            await apiClient.delete(`/centers/${id}`);
            await loadCenters();
            setToast("Đã xóa Trung tâm thành công.");
        } catch {
            setToast("Lỗi khi xóa Trung tâm. Đảm bảo Trung tâm không còn liên kết với Staff/Technician/Claim.");
        }
    };

    if (isLoading || !user) {
        return (
            <AdminLayout>
                <div className="py-20 text-center text-lg text-blue-600">
                    {isLoading ? "Đang tải danh sách Trung tâm..." : "Lỗi truy cập."}
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-4">Quản lý Trung tâm Dịch vụ</h1>

            {/* Search + Button */}
            <div className="flex justify-between mb-4">
                 <input 
                    placeholder="Tìm theo Tên hoặc Vị trí..." 
                    className="border rounded px-3 py-2 w-1/3"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                {canModify && (
                    <button
                        onClick={() => { setEditingCenter(null); setModalOpen(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Thêm Trung tâm
                    </button>
                )}
            </div>

            {/* Bảng dữ liệu */}
            <CenterTable
                centers={filteredCenters}
                onEdit={(c) => { setEditingCenter(c); setModalOpen(true); }}
                onDelete={handleDeleteCenter}
                canModify={canModify}
            />

            {/* Modal tạo/cập nhật */}
            {isModalOpen && canModify && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <CenterForm
                            initialData={editingCenter}
                            onSubmit={handleSaveCenter}
                            onClose={() => { setModalOpen(false); setEditingCenter(null); }}
                        />
                    </div>
                </div>
            )}

            {/* Toast thông báo */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
                    {toast}
                </div>
            )}
        </AdminLayout>
    );
}