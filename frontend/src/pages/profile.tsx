// frontend/src/pages/profile.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { StaffResponse } from '@/types/staff'; 
import { TechnicianResponse } from '@/types/technician'; 
import axios from 'axios'; 
import ProfileUpdateForm from '@/profile/ProfileUpdateForm'; 
import { UserProfile } from '@/types/auth';

import { getStaffByUsername } from '@/services/modules/staffService';
import { getTechnicianByUsername } from '@/services/modules/technicianService';

interface AuthUserMinimal {
    id: number;
    username: string;
    role: string;
    email?: string; 
    name?: string;
}
interface BasicProfile {
    id: number;
    username: string;
    role: string;
    email: string; 
    name: string;
}
type ProfileUnion = StaffResponse | TechnicianResponse | BasicProfile;

export default function UserProfilePage() {
    const { user, isAuthenticated, updateProfile } = useAuth(); // Thêm updateProfile
    const router = useRouter();
    
    const [profileData, setProfileData] = useState<ProfileUnion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isEditing, setIsEditing] = useState(false); 
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    const mapToBasicProfile = (userData: AuthUserMinimal): BasicProfile => ({
        id: userData.id,
        username: userData.username,
        role: userData.role,
        email: userData.email || 'N/A', 
        name: userData.name || userData.username,
    });
    
    const fetchProfile = async () => {
        if (!user) return;

        const userMinimal = user as AuthUserMinimal;
        const isTechnicianRole = user.role === 'SC_Technician';
        const isStaffRole = user.role === 'Admin' || user.role === 'EVM_Staff' || user.role === 'SC_Staff';

        try {
            let data: StaffResponse | TechnicianResponse;

            if (isTechnicianRole) {
                // Ưu tiên Technician
                data = await getTechnicianByUsername(user.username);
            } else if (isStaffRole) {
                // Sau đó là Staff
                data = await getStaffByUsername(user.username);
            } else {
                // Fallback cho các vai trò khác (như Customer)
                setProfileData(mapToBasicProfile(userMinimal));
                return; 
            }
            
            // Nếu gọi API thành công:
            setProfileData(data);
            setError(null);

        } catch (e: unknown) {
            console.error("Lỗi tải profile:", e);
            
            // LUÔN FALLBACK: Gán hồ sơ cơ bản từ AuthContext để tránh màn hình trắng
            setProfileData(mapToBasicProfile(userMinimal)); 
            
            if (axios.isAxiosError(e) && e.response && e.response.status === 404) {
                setError("Thông tin chi tiết nghiệp vụ chưa được tạo (404 Not Found). Vui lòng cập nhật hồ sơ.");
            } else if (e instanceof Error) {
                setError("Lỗi khi tải dữ liệu: " + e.message);
            } else {
                setError("Lỗi không xác định khi tải profile.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // Cập nhật Auth Context với dữ liệu mới từ Profile
    const handleUpdateSuccess = (updatedData: ProfileUnion) => {
        // Cập nhật Profile trong Auth Context để hiển thị tên mới trên Navbar
        updateProfile({ 
            name: updatedData.name, 
            email: updatedData.email 
        } as Partial<UserProfile>); 

        setProfileData(updatedData); 
        setIsEditing(false); 
        setError("Cập nhật hồ sơ thành công!"); // Hiển thị thông báo thành công
    };


    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchProfile();
        }
    }, [isAuthenticated, user, router, refreshTrigger]); 


    if (!user) return null; // Luôn kiểm tra user trước khi render

    if (isLoading) {
        return (
            <Layout>
                <div className="py-20 text-center text-lg text-blue-600">Đang tải thông tin cá nhân...</div>
            </Layout>
        );
    }
    
    // [ĐÃ SỬA]: Loại bỏ 'if (!profileData) return null;' gây màn hình trắng.
    if (!profileData) {
        // Nếu load xong (isLoading=false) mà vẫn null, đây là lỗi nghiêm trọng không thể phục hồi bằng fallback
         return (
            <Layout>
                <div className="p-6 text-red-600 bg-red-100 border border-red-300 rounded-lg">
                    Lỗi nghiêm trọng: Không thể khởi tạo Profile Data. Vui lòng kiểm tra console.
                </div>
            </Layout>
        );
    }


    const isStaff = 'address' in profileData && profileData.role !== 'SC_Technician';
    const isTechnician = 'specialization' in profileData;
    const canEdit = isStaff || isTechnician;
    
    const renderProfileDetails = () => {
        const data = profileData; 

        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Hồ sơ {user.role} ({user.username})
                </h2>
                
                {/* Các trường cơ bản */}
                <p><strong>Tên hiển thị:</strong> {data.name}</p>
                <p><strong>Email:</strong> {data.email}</p>
                
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
                {/* Hiển thị lỗi từ Backend hoặc Frontend */}
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Thông tin Cá nhân & Tài khoản</h1>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-4xl">
                    
                    {isEditing && canEdit && (profileData as StaffResponse | TechnicianResponse) ? (
                        <ProfileUpdateForm
                            initialData={profileData as StaffResponse | TechnicianResponse}
                            onUpdateSuccess={handleUpdateSuccess}
                        />
                    ) : (
                        <>
                            {renderProfileDetails()}
                            
                            {canEdit && (
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                                >
                                    Cập nhật Hồ sơ
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}