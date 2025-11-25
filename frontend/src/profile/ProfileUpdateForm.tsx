// frontend/src/profile/ProfileUpdateForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { StaffResponse, StaffRequest } from '@/types/staff';
import { TechnicianResponse, TechnicianRequest } from '@/types/technician';
import { updateStaff } from '@/services/modules/staffService';
import { updateTechnician } from '@/services/modules/technicianService';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { UserProfile } from '@/types/auth';
import { getAllServiceCenters } from '@/services/modules/centerService';
import { ServiceCenterResponse } from '@/types/center'; 

// Định nghĩa Union Type cho Initial Data
type ProfileData = StaffResponse | TechnicianResponse;

interface ProfileUpdateFormProps {
    initialData: ProfileData;
    onUpdateSuccess: (updatedData: ProfileData) => void;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({ initialData, onUpdateSuccess }) => {
    // Lấy hàm updateProfile an toàn
    const { user, updateProfile } = useAuth(); 
    
    // Xác định loại profile dựa trên dữ liệu hoặc role của user
    const hasAddress = (initialData as StaffResponse).address !== undefined;
    const hasSpecialization = (initialData as TechnicianResponse).specialization !== undefined;
    const userRole = user?.role || '';
    
    // Nếu profile chưa tồn tại, dùng role của user để xác định loại
    const isStaff = hasAddress || (userRole === 'Admin' || userRole === 'EVM_Staff' || userRole === 'SC_Staff');
    const isTechnician = hasSpecialization || userRole === 'SC_Technician'; 

    const [formState, setFormState] = useState({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        address: isStaff ? (initialData as StaffResponse).address : '',
        specialization: isTechnician ? (initialData as TechnicianResponse).specialization : '',
        centerId: (initialData as StaffResponse | TechnicianResponse).centerId || 0,
        password: '',
        confirmPassword: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [serviceCenters, setServiceCenters] = useState<ServiceCenterResponse[]>([]);
    
    useEffect(() => {
        // Load service centers if centerId is missing
        const loadServiceCenters = async () => {
            if (!(initialData as StaffResponse | TechnicianResponse).centerId) {
                try {
                    const centers = await getAllServiceCenters();
                    setServiceCenters(centers);
                    if (centers.length > 0 && !formState.centerId) {
                        setFormState(prev => ({ ...prev, centerId: centers[0].id }));
                    }
                } catch (err) {
                    console.error('Failed to load service centers:', err);
                }
            }
        };
        
        setFormState({
            name: initialData.name,
            email: initialData.email,
            phone: initialData.phone,
            address: isStaff ? (initialData as StaffResponse).address : '',
            specialization: isTechnician ? (initialData as TechnicianResponse).specialization : '',
            centerId: (initialData as StaffResponse | TechnicianResponse).centerId || formState.centerId || 0,
            password: '',
            confirmPassword: '',
        });
        
        loadServiceCenters();
    }, [initialData, isStaff, isTechnician]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ 
            ...prev, 
            [name]: name === 'centerId' ? parseInt(value) || 0 : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Kiểm tra nếu là profile mới (chưa có centerId ban đầu) thì cần password
        const isNewProfile = !(initialData as StaffResponse | TechnicianResponse).centerId;
        
        if (isNewProfile && !formState.password) {
            setError("Vui lòng nhập mật khẩu để tạo hồ sơ mới.");
            setLoading(false);
            return;
        }
        
        if (formState.password && formState.password.length < 6) {
             setError("Mật khẩu phải có ít nhất 6 ký tự.");
             setLoading(false);
             return;
        }

        if (formState.password && formState.password !== formState.confirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            setLoading(false);
            return;
        }

        try {
            let updatedProfile: ProfileData;
            
            // Validate centerId
            if (!formState.centerId || formState.centerId === 0) {
                setError("Vui lòng chọn Trung tâm Dịch vụ.");
                setLoading(false);
                return;
            }
            
            const basePayload = {
                id: initialData.id,
                centerId: formState.centerId, 
                name: formState.name,
                email: formState.email,
                phone: formState.phone,
                username: initialData.username,
                // Gửi password nếu có, nếu không gửi null (backend sẽ giữ password cũ)
                password: formState.password || null,
            };
            
            if (isStaff) {
                // Lấy role từ initialData hoặc user context
                const staffRole = (initialData as StaffResponse).role || (userRole as any);
                const staffPayload: StaffRequest = {
                    ...basePayload,
                    role: staffRole,
                    address: formState.address || '',
                } as StaffRequest;
                
                updatedProfile = await updateStaff(initialData.id, staffPayload); 
                
            } else if (isTechnician) {
                const techPayload: TechnicianRequest = {
                    ...basePayload,
                    specialization: formState.specialization,
                } as TechnicianRequest;
                
                updatedProfile = await updateTechnician(initialData.id, techPayload); 
            } else {
                throw new Error("Không thể cập nhật: Vai trò không được hỗ trợ.");
            }
            
            // SỬA LỖI TS2779: Cập nhật Auth Context bằng hàm updateProfile an toàn
            updateProfile({
                name: updatedProfile.name,
                email: updatedProfile.email,
            } as Partial<UserProfile>); 

            onUpdateSuccess(updatedProfile);
            setError("Cập nhật hồ sơ thành công!");
            
        } catch (err: unknown) {
            let errorMessage = "Lỗi không xác định khi cập nhật hồ sơ.";
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string, error?: string };
                errorMessage = apiError.message || apiError.error || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const toastClass = error.includes("thành công") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className={`p-3 rounded-lg text-sm font-medium ${toastClass}`}>{error}</div>}

            <h3 className="text-xl font-bold border-b pb-2">Thông tin Cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị *</label>
                    <input type="text" name="name" value={formState.name} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" name="email" value={formState.email} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                    <input type="tel" name="phone" value={formState.phone} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" required />
                </div>
                {(!(initialData as StaffResponse | TechnicianResponse).centerId || serviceCenters.length > 0) && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trung tâm Dịch vụ *</label>
                        <select 
                            name="centerId" 
                            value={formState.centerId} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg p-2 text-sm" 
                            required
                        >
                            <option value="0">-- Chọn Trung tâm Dịch vụ --</option>
                            {serviceCenters.map(center => (
                                <option key={center.id} value={center.id}>
                                    {center.name} - {center.location}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {isStaff && (
                <div className="pt-4 border-t">
                    <h3 className="text-xl font-bold border-b pb-2 mb-4">Thông tin Nhân viên</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                    <textarea 
                        name="address" 
                        value={formState.address} 
                        onChange={handleChange} 
                        rows={2}
                        className="w-full border rounded-lg p-2 text-sm" 
                        required 
                    />
                </div>
            )}

            {isTechnician && (
                <div className="pt-4 border-t">
                    <h3 className="text-xl font-bold border-b pb-2 mb-4">Thông tin Kỹ thuật viên</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên môn *</label>
                    <input 
                        type="text" 
                        name="specialization" 
                        value={formState.specialization} 
                        onChange={handleChange} 
                        className="w-full border rounded-lg p-2 text-sm" 
                        required 
                    />
                </div>
            )}
            
            <div className="pt-4 border-t">
                <h3 className="text-xl font-bold border-b pb-2 mb-4">Đổi Mật khẩu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                        <input type="password" name="password" value={formState.password} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" placeholder="Để trống nếu không đổi" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                        <input type="password" name="confirmPassword" value={formState.confirmPassword} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" />
                    </div>
                </div>
            </div>


            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Đang cập nhật...' : 'Lưu Thay đổi'}
                </button>
            </div>
        </form>
    );
};

export default ProfileUpdateForm;