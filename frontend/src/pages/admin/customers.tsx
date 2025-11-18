// frontend/src/pages/admin/customers.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
// FIX: Tách types theo domain
import { CustomerRequest, CustomerResponse } from "@/types/customer"; 
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

// IMPORT SERVICE
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/services/modules/customerService";

// IMPORT COMPONENTS (Giả định bạn đã tạo và export CustomerForm/CustomerTable từ thư mục customers/)
import CustomerForm from "@/customers/CustomerForm"; 
import CustomerTable from "@/customers/CustomerTable"; 


export default function AdminCustomersPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [customers, setCustomers] = useState<CustomerResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);

    // ---------------------------------------
    // BẢO VỆ ROUTE & LOAD DATA
    // ---------------------------------------
    useEffect(() => {
        // Bảo vệ route: Chỉ Admin/EVM Staff có quyền truy cập
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && user.role !== "Admin" && user.role !== "EVM_Staff") { router.push("/"); return; }

        const loadCustomers = async () => {
            setIsLoading(true);
            try {
                const data = await getAllCustomers();
                setCustomers(data);
            } catch {
                setToast("Không thể tải danh sách khách hàng.");
            } finally {
                setIsLoading(false);
            }
        };
        loadCustomers();
    }, [isAuthenticated, user, router]);


    // ---------------------------------------
    // Lọc Khách hàng
    // ---------------------------------------
    const filteredCustomers = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();
        return customers.filter(c => 
             c.name.toLowerCase().includes(keyword) || 
             c.email.toLowerCase().includes(keyword) ||
             c.phone.includes(keyword)
         );
    }, [customers, searchKeyword]);


    // ---------------------------------------
    // Xử lý tạo/cập nhật (Save Handler)
    // ---------------------------------------
    const handleSaveCustomer = async (payload: CustomerRequest) => {
        let errorMessage = "Lỗi tạo/cập nhật khách hàng không xác định.";
        
        try {
            let savedCustomer: CustomerResponse;
            
            if (payload.id) {
                // UPDATE: Sử dụng ID để cập nhật
                savedCustomer = await updateCustomer(payload.id as number, payload);
                setCustomers(prev => prev.map(c => c.id === savedCustomer.id ? savedCustomer : c));
                setToast("Cập nhật khách hàng thành công!");
            } else {
                // CREATE
                savedCustomer = await createCustomer(payload);
                setCustomers(prev => [...prev, savedCustomer]);
                setToast("Thêm khách hàng thành công!");
            }
            
            setModalOpen(false);
            setEditingCustomer(null);

        } catch (err : unknown) {
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string };
                errorMessage = apiError.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            // Ném lỗi chi tiết ra Form
            throw new Error(errorMessage); 
        }
    };

    // ---------------------------------------
    // Xử lý xóa
    // ---------------------------------------
    const handleDeleteCustomer = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa khách hàng này? Thao tác này không thể hoàn tác.")) return;

        try {
            await deleteCustomer(id);
            setCustomers(prev => prev.filter(c => c.id !== id));
            setToast("Đã xóa khách hàng thành công.");
        } catch {
            setToast("Lỗi khi xóa khách hàng. Hãy đảm bảo khách hàng không còn liên kết với xe hoặc Claim nào.");
        }
    };

    // ---------------------------------------
    // Render JSX
    // ---------------------------------------

    const canModify = user?.role === "Admin" || user?.role === "EVM_Staff";
    
    if (!user || (!isAuthenticated && canModify)) return null;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-4">Quản lý Khách hàng</h1>

            {/* Search + Button */}
            <div className="flex justify-between mb-4">
                 <input 
                    placeholder="Tìm theo Tên, Email, SĐT..." 
                    className="border rounded px-3 py-2 w-1/3"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                {canModify && (
                    <button
                        onClick={() => { setEditingCustomer(null); setModalOpen(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Thêm Khách hàng
                    </button>
                )}
            </div>

            {/* Bảng dữ liệu Khách hàng */}
            {isLoading ? (
                <p>Đang tải danh sách khách hàng...</p>
            ) : (
                <CustomerTable
                    customers={filteredCustomers}
                    onEdit={(c) => { setEditingCustomer(c); setModalOpen(true); }}
                    onDelete={handleDeleteCustomer}
                    canModify={canModify}
                />
            )}

            {/* Modal tạo/cập nhật */}
            {isModalOpen && canModify && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingCustomer ? "Cập nhật Khách hàng" : "Thêm Khách hàng mới"}
                        </h2>
                        <CustomerForm
                            initialData={editingCustomer}
                            onSubmit={handleSaveCustomer}
                            onClose={() => { setModalOpen(false); setEditingCustomer(null); }}
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