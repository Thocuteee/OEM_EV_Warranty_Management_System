"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { WarrantyPolicyResponse, WarrantyPolicyRequest } from "@/types/warrantyPolicy";
import { getAllPolicies, createPolicy, updatePolicy, deletePolicy } from "@/services/modules/warrantyPolicyService";
import { WarrantyPolicyForm, WarrantyPolicyTable } from "@/policies";
import axios from "axios";

export default function PoliciesPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    
    const [policies, setPolicies] = useState<WarrantyPolicyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<WarrantyPolicyResponse | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const allowedRoles = ["Admin", "EVM_Staff"];

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedRoles.includes(user.role)) { router.push("/"); return; }
        loadData();
    }, [isAuthenticated, user, router]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getAllPolicies();
            setPolicies(data || []);
        } catch (error) {
            console.error("Lỗi tải dữ liệu chính sách:", error);
            setToast("Không thể tải danh sách chính sách bảo hành.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (data: WarrantyPolicyRequest) => {
        try {
            if (data.id) {
                await updatePolicy(data.id, data);
                setToast("Cập nhật chính sách thành công!");
            } else {
                await createPolicy(data);
                setToast("Thêm chính sách thành công!");
            }
            
            setIsModalOpen(false);
            setEditingPolicy(null);
            await loadData();
        } catch (err: unknown) {
            let errorMessage = "Lỗi khi lưu chính sách.";
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    const responseData = err.response.data;
                    if (typeof responseData === 'object' && responseData !== null) {
                        if ('message' in responseData) {
                            errorMessage = (responseData as { message?: string }).message || errorMessage;
                        } else {
                            errorMessage = `Lỗi ${err.response.status}: ${err.response.statusText}`;
                        }
                    } else {
                        errorMessage = `Lỗi ${err.response.status}: ${err.response.statusText}`;
                    }
                } else if (err.request) {
                    errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend có đang chạy không.";
                } else {
                    errorMessage = err.message || errorMessage;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage);
            console.error("Lỗi chi tiết khi lưu chính sách:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa chính sách này?")) return;
        try {
            await deletePolicy(id);
            setToast("Đã xóa chính sách thành công!");
            await loadData();
        } catch (err: unknown) {
            let errorMessage = "Lỗi khi xóa chính sách.";
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    const responseData = err.response.data;
                    if (typeof responseData === 'object' && responseData !== null) {
                        if ('message' in responseData) {
                            errorMessage = (responseData as { message?: string }).message || errorMessage;
                        } else {
                            errorMessage = `Lỗi ${err.response.status}: ${err.response.statusText}`;
                        }
                    } else {
                        errorMessage = `Lỗi ${err.response.status}: ${err.response.statusText}`;
                    }
                } else if (err.request) {
                    errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend có đang chạy không.";
                } else {
                    errorMessage = err.message || errorMessage;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage);
            console.error("Lỗi chi tiết khi xóa chính sách:", err);
        }
    };

    if (isLoading || !user) return <Layout><p>Đang tải dữ liệu...</p></Layout>;

    return (
        <Layout>
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Chính sách Bảo hành</h1>
                <p className="text-gray-600 mt-1">Quản lý các chính sách bảo hành cho xe điện</p>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex-1"></div>
                <button 
                    onClick={() => { setEditingPolicy(null); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
                >
                    + Thêm Chính sách Mới
                </button>
            </div>

            <WarrantyPolicyTable 
                policies={policies} 
                onEdit={(p) => { setEditingPolicy(p); setIsModalOpen(true); }} 
                onDelete={handleDelete} 
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 overflow-y-auto max-h-[90vh]">
                        <WarrantyPolicyForm
                            initialData={editingPolicy}
                            onSubmit={handleSave}
                            onClose={() => { setIsModalOpen(false); setEditingPolicy(null); }}
                        />
                    </div>
                </div>
            )}

            {toast && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg transition-opacity duration-300 z-50" onClick={() => setToast(null)}>
                    {toast}
                </div>
            )}
        </Layout>
    );
}