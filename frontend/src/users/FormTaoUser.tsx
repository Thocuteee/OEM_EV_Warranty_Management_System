'use client';
import React, { useState } from 'react';
// FIX: Đảm bảo import đúng hai kiểu dữ liệu này từ file types/admin.ts

import { UserRoleBackend } from '@/types/admin'; 
import { UserRequest} from '@/types/warranty';

interface FormTaoUserProps {
  onSubmit: (payload: UserRequest) => Promise<void>;
  onClose: () => void;
}

const roleOptions: { label: string; value: UserRoleBackend }[] = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'EVM Staff', value: 'EVM_STAFF' },
  { label: 'SC Staff', value: 'SC_STAFF' },
  { label: 'SC Technician', value: 'SC_TECHNICIAN' },
];

const FormTaoUser: React.FC<FormTaoUserProps> = ({ onSubmit, onClose }) => {
  const [formState, setFormState] = useState<UserRequest>({
    username: '',
    password: '',
    role: 'SC_Staff'  
  } as UserRequest);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [centerId, setCenterId] = useState<string>('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
  ) => {
    const { name, value } = event.target;

    if (name === 'name') setName(value);
    if (name === 'phone') setPhone(value);
    if (name === 'email') setEmail(value);
    if (name === 'centerId') setCenterId(value);
    
    setFormState((prev) => {
        // FIX 3: Xử lý trường 'role' (ép kiểu có điều kiện)
        
        return { ...prev, [name as keyof UserRequest]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payloadToSend: FullUserCreationRequest = {
        username: formState.username,
        password: formState.password,
        role: formState.role as any, // Cần ép kiểu nếu role là string literal

        // GIẢ ĐỊNH các biến name, phone, email, centerId đã được quản lý bằng useState
        name: name,
        phone: phone,
        email: email,
        centerId: parseInt(centerId), // Chuyển đổi an toàn
        // specialization: specialization

      // Gửi formState (kiểu CreateUserPayload)
      await onSubmit(formState); 
      
      
      onClose(); 
    } catch (err: unknown) {
      
      let errorMessage: string = "Lỗi tạo người dùng không xác định.";
      
      // Logic xử lý lỗi an toàn từ Service (Hiển thị lỗi trùng lặp Username)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (Phần JSX tương tự) ... */}
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
            placeholder="Ví dụ: admin_ev01"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            autoComplete="username"
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
          value={formState.role}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

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