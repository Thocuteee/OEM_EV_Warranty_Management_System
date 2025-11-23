"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { InvoiceResponse, InvoiceRequest } from "@/types/invoice"; 
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { getAllInvoices, createInvoice, updateInvoice, deleteInvoice } from "@/services/modules/invoiceService"; 
import { InvoiceForm, InvoiceTable } from "@/invoices"; // <--- SỬ DỤNG IMPORT TỪ INDEX

export default function AdminInvoicesPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<InvoiceResponse | null>(null);

    const allowedRoles = ["Admin", "EVM_Staff"]; 

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedRoles.includes(user.role)) { router.push("/"); return; }
        
        loadData();
    }, [isAuthenticated, user, router]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getAllInvoices();
            setInvoices(data);
        } catch(err) {
            console.error("Lỗi tải dữ liệu Invoice:", err);
            setToast("Không thể tải danh sách Hóa đơn.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveInvoice = async (payload: InvoiceRequest) => {
        try {
            if (payload.id) {
                await updateInvoice(payload.id, payload);
                setToast("Cập nhật Hóa đơn thành công!");
            } else {
                await createInvoice(payload);
                setToast("Thêm Hóa đơn mới thành công!");
            }
            await loadData(); 
            setModalOpen(false);
            setEditingInvoice(null);
        } catch(err: unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Lỗi khi lưu Hóa đơn.";
            
            throw new Error(errorMessage);
        }
    };
    
    const handleDeleteInvoice = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa Hóa đơn này?")) return;
        try {
            await deleteInvoice(id);
            setToast("Đã xóa Hóa đơn thành công.");
            await loadData();
        } catch {
            setToast("Lỗi khi xóa Hóa đơn.");
        }
    };
    
    const filteredInvoices = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();
        return invoices.filter(i => 
            // Đảm bảo các trường tồn tại trước khi gọi toLowerCase()
            (i.partName && i.partName.toLowerCase().includes(keyword)) || 
            (i.centerName && i.centerName.toLowerCase().includes(keyword)) ||
            (i.paymentsStatus && i.paymentsStatus.toLowerCase().includes(keyword))
        );
    }, [invoices, searchKeyword]);
    
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);
    
    if (isLoading || !user) return <AdminLayout><p>Đang tải dữ liệu...</p></AdminLayout>;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-4">Quản lý Hóa đơn (Invoices)</h1>

            <div className="flex justify-between items-center mb-6">
                <input 
                    placeholder="Tìm theo Tên Part, Trung tâm, Status..." 
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <button
                    onClick={() => { setEditingInvoice(null); setModalOpen(true); }}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
                >
                    + Tạo Hóa đơn
                </button>
            </div>

            {/* SỬ DỤNG COMPONENT TABLE ĐÃ TÁCH */}
            <InvoiceTable 
                invoices={filteredInvoices}
                onEdit={(i) => { setEditingInvoice(i); setModalOpen(true); }}
                onDelete={handleDeleteInvoice}
            />
            
            {/* Modal tạo/cập nhật Invoice */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                         {/* SỬ DỤNG COMPONENT FORM ĐÃ TÁCH */}
                        <InvoiceForm
                            initialData={editingInvoice}
                            onSubmit={handleSaveInvoice}
                            onClose={() => { setModalOpen(false); setEditingInvoice(null); }}
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