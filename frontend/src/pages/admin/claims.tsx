// frontend/src/pages/admin/claims.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { WarrantyClaimResponse } from "@/types/claim"; 
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
// IMPORT SERVICE MỚI
import { getAllWarrantyClaims, updateClaimStatus, deleteWarrantyClaim, sendClaimToEVM } from "@/services/modules/claimService";
// IMPORT COMPONENT MỚI
import ClaimTable from "@/claims/ClaimTable"; 

export default function AdminClaimsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [claims, setClaims] = useState<WarrantyClaimResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);

    // ---------------------------------------
    // Bảo vệ Route & Load Data
    // ---------------------------------------
    
    useEffect(() => {
        // Bảo vệ route: Chỉ Admin/EVM Staff/SC Staff/SC Technician có quyền truy cập
        if (!isAuthenticated) { router.push("/login"); return; }
        const allowedRoles = ["Admin", "EVM_Staff", "SC_Staff", "SC_Technician"];
        if (user && !allowedRoles.includes(user.role)) { router.push("/"); return; }
    }, [isAuthenticated, user, router]);

    const loadClaims = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await getAllWarrantyClaims(); 
            setClaims(data);
        } catch(err) {
            console.error("Lỗi tải Claims:", err);
            setToast("Không thể tải danh sách Claims.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (user) {
            loadClaims();
        }
    }, [user]);

    // Lọc Claims theo từ khóa
    const filteredClaims = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();
        return claims.filter(c => 
            c.vehicleVIN.toLowerCase().includes(keyword) || 
            c.customerName.toLowerCase().includes(keyword) ||
            c.status.toLowerCase().includes(keyword)
        );
    }, [claims, searchKeyword]);


    // ---------------------------------------
    // Xử lý Actions
    // ---------------------------------------

    const handleSendClaim = async (claimId: number) => {
        if(!confirm("Bạn chắc chắn muốn GỬI yêu cầu bảo hành này lên Hãng? (Trạng thái sẽ chuyển sang SENT)")) return;
        setToast(null);
        try {
            await sendClaimToEVM(claimId);
            setToast("Đã gửi Claim thành công!");
            loadClaims();
        } catch(err:unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message? err.response.data.message : "Lỗi khi gửi Claim.";
            setToast(errorMessage);
        }
    }
    
    const handleDeleteClaim = async (claimId: number) => {
        if (!confirm("Bạn chỉ có thể xóa các Claim ở trạng thái DRAFT. Bạn có chắc muốn xóa?")) return;
        setToast(null);
        try {
            await deleteWarrantyClaim(claimId);
            setToast("Đã xóa Claim thành công.");
            loadClaims();
        } catch(err:unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message? err.response.data.message: "Lỗi khi xóa Claim. Đảm bảo Claim ở trạng thái DRAFT.";
            setToast(errorMessage);
        }
    };

    const handleViewDetail = (claimId: number) => {
        router.push(`/claims/${claimId}`);
    }
    
    // Toast auto hide
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);


    if (!user || isLoading) return <AdminLayout><p>Đang tải dữ liệu...</p></AdminLayout>;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-4">Quản lý Yêu cầu Bảo hành</h1>

            <div className="flex justify-between mb-6">
                 {/* Search bar */}
                <input 
                    placeholder="Tìm theo VIN, Khách hàng, Trạng thái..." 
                    className="border rounded px-3 py-2 w-1/3"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>

            {/* Bảng dữ liệu Claim */}
            <ClaimTable
                claims={filteredClaims}
                onSend={handleSendClaim}
                onViewDetail={handleViewDetail}
                onDelete={handleDeleteClaim}
            />

            {/* Toast thông báo */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
                    {toast}
                </div>
            )}
        </AdminLayout>
    );
}