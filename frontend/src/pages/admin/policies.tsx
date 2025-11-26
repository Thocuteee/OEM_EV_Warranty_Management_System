import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { WarrantyPolicyResponse, WarrantyPolicyRequest } from "@/types/warrantyPolicy";
import { getAllPolicies, createPolicy, updatePolicy, deletePolicy } from "@/services/modules/warrantyPolicyService";
import { WarrantyPolicyForm, WarrantyPolicyTable } from "@/policies";
import axios from "axios";

export default function PoliciesPage() {
    const [policies, setPolicies] = useState<WarrantyPolicyResponse[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<WarrantyPolicyResponse | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const loadData = async () => {
        try {
            const data = await getAllPolicies();
            setPolicies(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSave = async (data: WarrantyPolicyRequest) => {
        try {
            if (data.id) await updatePolicy(data.id, data);
            else await createPolicy(data);
            
            setIsModalOpen(false);
            setEditingPolicy(null);
            loadData();
            alert("Lưu thành công!");
        } catch (err: any) {
            const msg = err.response?.data?.message || "Có lỗi xảy ra";
            alert("Lỗi: " + msg);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa?")) return;
        try {
            await deletePolicy(id);
            loadData();
        } catch (err: any) {
            alert("Lỗi xóa: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Quản lý Chính sách Bảo hành</h1>
                    <button 
                        onClick={() => { setEditingPolicy(null); setIsModalOpen(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Thêm Mới
                    </button>
                </div>

                <WarrantyPolicyTable policies={policies} onEdit={(p) => { setEditingPolicy(p); setIsModalOpen(true); }} onDelete={handleDelete} />

                {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                        <WarrantyPolicyForm
                            initialData={editingPolicy}
                            onSubmit={handleSave}
                            onClose={() => { setIsModalOpen(false); setEditingPolicy(null); }}
                        />
                    </div>
                </div>
            )}
            </div>
        </AdminLayout>
    );
}