'use client';
import React, { useState } from 'react';
import { UserRequest, UserRole } from '@/types/warranty';
import { UserRoleBackend, FullUserCreationRequest } from '@/types/admin'; 

interface FormTaoUserProps {
  onSubmit: (payload: FullUserCreationRequest) => Promise<void>; 
  onClose: () => void;
}

const roleOptions: { label: string; value: UserRole }[] = [
  { label: 'Admin', value: 'Admin' as UserRole },
  { label: 'EVM Staff', value: 'EVM_Staff' as UserRole },
  { label: 'SC Staff', value: 'SC_Staff' as UserRole },
  { label: 'SC Technician', value: 'SC_Technician' as UserRole },
];

const FormTaoUser: React.FC<FormTaoUserProps> = ({ onSubmit, onClose }) => {
  // State cho các trường cơ bản
  const [formState, setFormState] = useState<UserRequest>({
    username: '',
    password: '',
    role: 'SC_Staff' as UserRole
  });

  // State cho các trường mở rộng (Staff/Technician)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // Khởi tạo centerId là '1' để dễ dàng test (ID trung tâm mặc định)
  const [centerId, setCenterId] = useState<string>('1'); 
  const [specialization, setSpecialization] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
  ) => {
    const { name, value } = event.target;

    // Cập nhật các trường mở rộng riêng
    if (name === 'name') setName(value);
    else if (name === 'phone') setPhone(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'centerId') setCenterId(value);
    else if (name === 'specialization') setSpecialization(value);
    
    // FIX 2: Cập nhật các trường UserRequest cơ bản (Giải quyết lỗi `prev`)
    setFormState((prev) => ({ 
        ...prev, 
        [name]: value === 'role' ? value as UserRole : value,
    } as UserRequest));
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // FIX 3: Khai báo payload an toàn, thay thế 'any'
      const payload: FullUserCreationRequest = {
        username: formState.username,
        password: formState.password,
        role: formState.role, 
        
        name: name,
        phone: phone,
        email: email,
        centerId: centerId ? parseInt(centerId) : undefined,
        specialization: specialization
      };

      // Thêm các trường Staff/Technician nếu Role không phải là Admin
      if (payload.role === 'Admin' || payload.role === 'EVM_Staff') {
          // Xóa các trường chỉ dành cho SC Staff/Technician
          delete payload.name;
          delete payload.phone;
          delete payload.email;
          delete payload.centerId;
          delete payload.specialization;
      }
      
      // GỌI API với payload đã được chuẩn bị
      await onSubmit(payload); 
      
      onClose(); 
    } catch (err: unknown) {
      
      let errorMessage: string = "Lỗi tạo người dùng không xác định.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logic hiển thị có điều kiện cho các trường nhân sự
  const isStaffOrTechnician = formState.role === 'SC_Staff' || formState.role === 'EVM_Staff' || formState.role === 'SC_Technician';
  const isTechnician = formState.role === 'SC_Technician';


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* --- PHẦN 1: USER CƠ BẢN (KHẮC PHỤC LỖI THIẾU INPUT) --- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tên đăng nhập */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tên đăng nhập
          </label>
          <input
            name="username"
            value={formState.username}
            onChange={handleChange}
            placeholder="Ví dụ: staff_01"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            autoComplete="username"
            required
          />
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            placeholder="Tối thiểu 6 ký tự"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            autoComplete="new-password"
            required
          />
        </div>
      </div>

      {/* Vai trò hệ thống */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Vai trò hệ thống
        </label>
        <select
          name="role"
          value={formState.role as string}
          onChange={handleChange} // Sử dụng handleChange để cập nhật
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* --- PHẦN 2: THÔNG TIN NHÂN SỰ (ĐÃ SỬA LỖI LOGIC) --- */}
      {isStaffOrTechnician && (
        <div className="pt-4 border-t">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Thông tin Nhân sự</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Tên đầy đủ */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tên đầy đủ</label>
                    <input name="name" value={name} onChange={handleChange} placeholder="Nguyễn Văn A" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" required />
                </div>
                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input name="email" type="email" value={email} onChange={handleChange} placeholder="staff@example.com" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" required />
                </div>
                {/* Số điện thoại */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                    <input name="phone" type="tel" value={phone} onChange={handleChange} placeholder="090xxxxxxx" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" required />
                </div>
                {/* Service Center ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ID Trung tâm (Center ID)</label>
                    <input name="centerId" type="number" min="1" value={centerId} onChange={handleChange} placeholder="1" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" required />
                </div>

                {/* Chuyên môn (Chỉ cho Technician) */}
                {isTechnician && (
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Chuyên môn</label>
                        <input name="specialization" value={specialization} onChange={handleChange} placeholder="Ví dụ: Battery, Motor, Charging" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500" required />
                    </div>
                )}
            </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Đang tạo...' : 'Tạo người dùng'}
        </button>
      </div>
    </form>
  );
};

export default FormTaoUser;