// frontend/src/pages/claims/index.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/components/layout/Layout"; 
import { WarrantyClaimResponse } from "@/types/claim"; 
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { getAllWarrantyClaims, deleteWarrantyClaim, sendClaimToEVM } from "@/services/modules/claimService";
import { getStaffByUsername } from "@/services/modules/staffService";
import { getTechnicianByUsername } from "@/services/modules/technicianService";
import ClaimTable from "@/claims/ClaimTable"; 

export default function ClaimsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [claims, setClaims] = useState<WarrantyClaimResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    const [userCenterId, setUserCenterId] = useState<number | null>(null); // Center ID của user hiện tại

    const allowedRoles = ["Admin", "EVM_Staff", "SC_Staff", "SC_Technician"];

    // ---------------------------------------
    // Bảo vệ Route & Load Data
    // ---------------------------------------
    useEffect(() => {
        // Bảo vệ route: Tất cả các vai trò nghiệp vụ đều được truy cập
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedRoles.includes(user.role)) { router.push("/"); return; }
    }, [isAuthenticated, user, router]);

    // Load centerId của user (nếu là SC Staff/Technician)
    useEffect(() => {
        const loadUserCenter = async () => {
            if (!user) return;
            
            // Chỉ load centerId cho SC Staff/Technician
            if (user.role === 'SC_Staff' || user.role === 'SC_Technician') {
                try {
                    let centerId: number | null = null;
                    if (user.role === 'SC_Staff') {
                        const staffData = await getStaffByUsername(user.username);
                        centerId = staffData.centerId || null;
                    } else if (user.role === 'SC_Technician') {
                        const techData = await getTechnicianByUsername(user.username);
                        centerId = techData.centerId || null;
                    }
                    setUserCenterId(centerId);
                } catch (err) {
                    console.error("Lỗi tải thông tin center:", err);
                }
            }
        };
        loadUserCenter();
    }, [user]);

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

    // Phân quyền: SC Staff/Technician chỉ xem claims của center mình
    const isSCUser = user?.role === 'SC_Staff' || user?.role === 'SC_Technician';
    const canModify = user?.role === 'SC_Staff'; // Chỉ SC Staff mới có thể gửi/xóa claim
    
    // Lọc Claims theo từ khóa và centerId (nếu là SC Staff/Technician)
    const filteredClaims = useMemo(() => {
        let filtered = claims;
        
        // Filter theo centerId nếu là SC Staff/Technician
        if (isSCUser && userCenterId !== null) {
            filtered = filtered.filter(c => c.centerId === userCenterId);
        }
        
        // Filter theo từ khóa
        if (searchKeyword) {
            const keyword = searchKeyword.toLowerCase();
            filtered = filtered.filter(c => 
                c.vehicleVIN.toLowerCase().includes(keyword) || 
                c.customerName.toLowerCase().includes(keyword) ||
                c.status.toLowerCase().includes(keyword)
            );
        }
        
        return filtered;
    }, [claims, searchKeyword, isSCUser, userCenterId]);

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


    if (!user || isLoading) return <Layout><p>Đang tải dữ liệu...</p></Layout>;

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-4">Quản lý Yêu cầu Bảo hành</h1>

            <div className="flex justify-between mb-6">
                 {/* Search bar */}
                <input 
                    placeholder="Tìm theo VIN, Khách hàng, Trạng thái..." 
                    className="border rounded px-3 py-2 w-1/3"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {/* Nút Tạo mới nên trỏ đến trang tìm xe (cars) */}
                <button
                    onClick={() => router.push('/cars')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    + Tạo Yêu cầu Mới
                </button>
            </div>

            {/* Bảng dữ liệu Claim */}
            <ClaimTable
                claims={filteredClaims}
                onSend={handleSendClaim}
                onViewDetail={handleViewDetail}
                onDelete={handleDeleteClaim}
                canModify={canModify || false}
            />

            {/* Toast thông báo */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
                    {toast}
                </div>
            )}
        </Layout>
    );
}