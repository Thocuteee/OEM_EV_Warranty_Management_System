"use client";

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { StaffResponse } from '@/types/staff'; 
import { TechnicianResponse } from '@/types/technician'; 
import { getStaffById } from '@/services/modules/staffService'; 
import { getTechnicianById } from '@/services/modules/technicianService';
import axios from 'axios'; 

// THÊM: Định nghĩa interface cho đối tượng user truyền vào
interface AuthUserMinimal {
    id: number;
    username: string;
    role: string;
    email?: string; 
    name?: string;
}

// Định nghĩa BasicProfile (là kiểu dữ liệu của đối tượng 'user' từ AuthContext)
interface BasicProfile {
    id: number;
    username: string;
    role: string;
    email: string; 
    name: string;
}

// 2. DEFINE UNION TYPE
type ProfileUnion = StaffResponse | TechnicianResponse | BasicProfile;

export default function UserProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    
    // SỬA LỖI 1: State profileData phải sử dụng ProfileUnion
    const [profileData, setProfileData] = useState<ProfileUnion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // HÀM ÁNH XẠ AN TOÀN (SỬA LỖI ANY)
    const mapToBasicProfile = (userData: AuthUserMinimal): BasicProfile => ({
        id: userData.id,
        username: userData.username,
        role: userData.role,
        email: userData.email || 'N/A', 
        name: userData.name || userData.username,
    });
    
    // Kiểm tra Auth và tải dữ liệu
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (!user) return;
        
        // Cần đảm bảo user luôn là AuthUserMinimal khi gọi mapToBasicProfile
        const userMinimal = user as AuthUserMinimal;

        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            
            const isTechnicianRole = user.role === 'SC_Technician';
            const isStaffRole = user.role === 'Admin' || user.role === 'EVM_Staff' || user.role === 'SC_Staff';

            try {
                let data: StaffResponse | TechnicianResponse;

                if (isTechnicianRole) {
                    data = await getTechnicianById(user.id);
                    setProfileData(data);
                } else if (isStaffRole) {
                    data = await getStaffById(user.id);
                    setProfileData(data);
                } else {
                    // SỬA LỖI 2: Sử dụng mapToBasicProfile an toàn
                    setProfileData(mapToBasicProfile(userMinimal));
                }
            } catch (e: unknown) {
                console.error("Lỗi tải profile:", e);
                
                // Xử lý lỗi 404 (Không tìm thấy hồ sơ nghiệp vụ) -> Fallback về Basic Profile
                if (axios.isAxiosError(e) && e.response && e.response.status === 404 && (isStaffRole || isTechnicianRole)) {
                     // Fallback về hồ sơ cơ bản
                    setProfileData(mapToBasicProfile(userMinimal));
                    setError("Thông tin chi tiết nghiệp vụ chưa được tạo (404 Not Found).");
                } else if (e instanceof Error) {
                    setError(e.message);
                }else {
                    // Lỗi không xác định
                    setError("Lỗi không xác định khi tải dữ liệu profile.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, user, router]);


    if (!user || isLoading) {
        return (
            <Layout>
                <div className="py-20 text-center text-lg text-blue-600">Đang tải thông tin cá nhân...</div>
            </Layout>
        );
    }
    
    // Kiểm tra lỗi sau khi loading kết thúc
    if (error && (!profileData || !('id' in profileData))) {
        return (
            <Layout>
                <div className="p-6 text-red-600 bg-red-100 border border-red-300 rounded-lg">
                    Lỗi: {error}
                </div>
            </Layout>
        );
    }
    
    if (!profileData) return null;

    // --- PHẦN RENDER DỰA TRÊN ROLE ---

    const renderProfileDetails = () => {
        
        // Kiểm tra xem profileData có các trường chi tiết của Staff/Technician không
        const isStaff = 'address' in profileData;
        const isTechnician = 'specialization' in profileData;
        
        // Sử dụng profileData trực tiếp. TypeScript sẽ tự động thu hẹp kiểu trong các khối if/else.
        const data = profileData; 

        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Hồ sơ {user.role} ({user.username})
                </h2>
                
                {/* Các trường cơ bản (luôn tồn tại trong BasicProfile) */}
                <p><strong>Tên hiển thị:</strong> {data.name}</p>
                <p><strong>Email:</strong> {data.email}</p>
                
                {/* Chỉ hiển thị Phone nếu có trường 'phone' (chỉ có trong DTO chi tiết) */}
                {('phone' in data) && ( 
                    <p><strong>Số điện thoại:</strong> {data.phone}</p>
                )}
                
                {isStaff && (
                    <>
                        <p><strong>Vai trò nghiệp vụ:</strong> {(data as StaffResponse).role}</p>
                        <p><strong>Trung tâm (ID {(data as StaffResponse).centerId}):</strong> {(data as StaffResponse).centerName}</p>
                        <p><strong>Địa chỉ:</strong> {(data as StaffResponse).address}</p>
                    </>
                )}
                
                {isTechnician && (
                    <>
                        <p><strong>Chuyên môn:</strong> {(data as TechnicianResponse).specialization}</p>
                        <p><strong>Trung tâm (ID {(data as TechnicianResponse).centerId}):</strong> {(data as TechnicianResponse).centerName}</p>
                    </>
                )}
                
                <p className="pt-4 text-sm text-gray-500">
                    *ID hệ thống: {user.id}
                </p>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Thông tin Cá nhân & Tài khoản</h1>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-2xl">
                    {renderProfileDetails()}
                    
                    <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        Cập nhật Hồ sơ
                    </button>
                </div>
            </div>
        </Layout>
    );
}