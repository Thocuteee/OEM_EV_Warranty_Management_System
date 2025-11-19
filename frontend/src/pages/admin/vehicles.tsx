"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { VehicleRequest, VehicleResponse } from "@/types/vehicle"; 
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

// IMPORT SERVICE MỚI
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle } from "@/services/modules/vehicleService";
// IMPORT COMPONENTS MỚI
import VehicleForm from "@/vehicles/VehicleForm";
import VehicleTable from "@/vehicles/VehicleTable";


export default function AdminVehiclesPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleResponse | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (user && user.role !== "Admin" && user.role !== "EVM_Staff") {
            router.push("/");
            return;
        }
    }, [isAuthenticated, user]);

    // ---------------------------------------
    // Load danh sách xe
    // ---------------------------------------
    const loadVehicles = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await getAllVehicles(); // Gọi service đã tách
            setVehicles(data);
        } catch {
            setToast("Không thể tải danh sách xe.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        loadVehicles();
    }, [user]);

    const filteredVehicles = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();
        return vehicles.filter(v => 
            // Bỏ qua các đối tượng null/undefined
            v && (
                // Kiểm tra v.VIN/v.model có tồn tại trước khi gọi .toLowerCase()
                (v.vin && v.vin.toLowerCase().includes(keyword)) || 
                (v.model && v.model.toLowerCase().includes(keyword))
            )
        );
    }, [vehicles, searchKeyword]);

    const handleSaveVehicle = async (payload: VehicleRequest) => {
        let errorMessage = "Lỗi tạo/cập nhật xe không xác định.";
        try {
            let savedVehicle:VehicleResponse;
            if (payload.id) {
                // Cập nhật
                savedVehicle = await updateVehicle(payload.id as number, payload);
                setVehicles(prev => prev.map(v => v.id === savedVehicle.id ? savedVehicle : v));
                setToast("Cập nhật xe thành công!");
            } else {
                // Tạo mới
                savedVehicle = await createVehicle(payload);
                setVehicles(prev => [...prev, savedVehicle]);
                setToast("Đăng ký xe thành công!");
            }
            
            setModalOpen(false);
            setEditingVehicle(null);

        } catch (err : unknown) {
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string };
                errorMessage = apiError.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            // Ném lỗi cho form hiển thị (quan trọng)
            throw new Error(errorMessage); 
        }
    };
    
    // ---------------------------------------
    // Xóa xe
    // ---------------------------------------
    const handleDeleteVehicle = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa bản ghi xe này?")) return;

        try {
            await deleteVehicle(id);
            setVehicles(prev => prev.filter(v => v.id !== id));
            setToast("Đã xóa xe thành công.");
        } catch {
            setToast("Lỗi khi xóa xe.");
        }
    };

    if (!user) return null;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-4">Quản lý Xe</h1>

            <div className="flex justify-between mb-4">
                 {/* Search bar */}
                <input 
                    placeholder="Tìm theo VIN, Model..." 
                    className="border rounded px-3 py-2 w-1/3"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <button
                    onClick={() => { setEditingVehicle(null); setModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Đăng ký Xe
                </button>
            </div>

            {/* Bảng dữ liệu xe */}
            {isLoading ? (
                <p>Đang tải danh sách xe...</p>
            ) : (
                <VehicleTable
                    vehicles={filteredVehicles}
                    onEdit={(v) => { setEditingVehicle(v); setModalOpen(true); }}
                    onDelete={handleDeleteVehicle}
                    onRefresh={loadVehicles}
                />
            )}

            {/* Modal tạo/cập nhật xe */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                        {/* ... */}
                        <VehicleForm
                            initialData={editingVehicle}
                            onSubmit={handleSaveVehicle}
                            onClose={() => { setModalOpen(false); setEditingVehicle(null); }}
                            currentUserId={user.id} // <--- THÊM PROP QUAN TRỌNG NÀY
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