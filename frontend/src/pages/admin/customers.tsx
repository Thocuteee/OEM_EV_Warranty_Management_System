"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { CustomerRequest, CustomerResponse } from "@/types/customer";
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/services/modules/customerService";

export default function AdminCustomersPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [customers, setCustomers] = useState<CustomerResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);

    // Load data
    const loadCustomers = async () => {
        if (!user) return;
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
    useEffect(() => { loadCustomers(); }, [user]);


    // Xử lý tạo/cập nhật
    const handleSaveCustomer = async (payload: CustomerRequest) => {
        let errorMessage = "Lỗi tạo/cập nhật khách hàng không xác định.";
        try {
            let savedCustomer:CustomerResponse;
            if (payload.id) {
                // UPDATE: Cần ID từ payload
                savedCustomer = await updateCustomer(payload.id as number, payload);
                setCustomers(prev => prev.map(c => c.id === savedCustomer.id ? savedCustomer : c));
            } else {
                // CREATE
                savedCustomer = await createCustomer(payload);
                setCustomers(prev => [...prev, savedCustomer]);
            }
            
            setModalOpen(false);
            setEditingCustomer(null);
            setToast("Đã lưu khách hàng thành công!");

        } catch (err : unknown) {
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string };
                errorMessage = apiError.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            throw new Error(errorMessage); 
        }
    };

    // ... (JSX để hiển thị bảng và modal) ...

    if (!user) return null;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-4">Quản lý Khách hàng</h1>
            {/* ... (Các nút và bảng sẽ ở đây) ... */}
            {isLoading ? <p>Đang tải...</p> : <p>Customer Table will be here</p>}
        </AdminLayout>
    );
}