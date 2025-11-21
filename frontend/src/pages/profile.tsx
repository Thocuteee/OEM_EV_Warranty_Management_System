// frontend/src/pages/profile.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { StaffResponse } from '@/types/staff'; 
import { TechnicianResponse } from '@/types/technician'; 
import { getStaffById } from '@/services/modules/staffService'; 
import { getTechnicianById } from '@/services/modules/technicianService';
import axios from 'axios'; 
import ProfileUpdateForm from '@/profile/ProfileUpdateForm'; 

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
    const { user, isAuthenticated } = useAuth();
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
                data = await getTechnicianById(user.id);
                setProfileData(data);
            } else if (isStaffRole) {
                data = await getStaffById(user.id);
                setProfileData(data);
            } else {
                setProfileData(mapToBasicProfile(userMinimal));
            }
            // Xóa lỗi 404 sau khi tải thành công
            setError(null);
        } catch (e: unknown) {
            console.error("Lỗi tải profile:", e);
            
            if (axios.isAxiosError(e) && e.response && e.response.status === 404 && (isStaffRole || isTechnicianRole)) {
                 // Fallback về hồ sơ cơ bản
                setProfileData(mapToBasicProfile(userMinimal));
                setError("Thông tin chi tiết nghiệp vụ chưa được tạo (404 Not Found).");
            } else if (e instanceof Error) {
                setError(e.message);
            }else {
                setError("Lỗi không xác định khi tải dữ liệu profile.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUpdateSuccess = (updatedData: ProfileUnion) => {
        setProfileData(updatedData); 
        setIsEditing(false); 
        // Lỗi 404 đã được khắc phục bằng cách chèn dữ liệu DB, nên bước này sẽ thành công.
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


    if (!user || isLoading) {
        return (
            <Layout>
                <div className="py-20 text-center text-lg text-blue-600">Đang tải thông tin cá nhân...</div>
            </Layout>
        );
    }
    
    if (!profileData) return null;

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
                {/* Chỉ hiển thị lỗi nếu có lỗi, không hiển thị message fallback 404 cũ */}
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