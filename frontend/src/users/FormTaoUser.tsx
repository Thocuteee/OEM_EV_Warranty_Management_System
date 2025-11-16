'use client';
import React, { useState } from 'react';
import { UserRequest, UserRole } from '../types/warranty'; // Đảm bảo đường dẫn đúng
import { createNewUser } from '@/services/warrantyApi';
// Cần import CreateUserRequest nếu nó là DTO riêng
import { CreateUserRequest, UserRoleBackend } from '@/types/admin'; // Giả định import từ file types/admin.ts

interface FormTaoUserProps {
  // Thêm onSuccess vào props
  onSuccess: (message: string) => void;
  onClose: () => void;
}

const roleOptions: { label: string; value: UserRole }[] = [
  { label: 'Admin', value: 'ADMIN' as UserRole }, // SỬ DỤNG ENUM CHÍNH XÁC
  { label: 'EVM Staff', value: 'EVM_STAFF' as UserRole },
  { label: 'SC Staff', value: 'SC_STAFF' as UserRole },
  { label: 'SC Technician', value: 'SC_TECHNICIAN' as UserRole },
];

// FIX 1: Thêm kiểu dữ liệu cho props (onSuccess, onClose)
const FormTaoUser: React.FC<FormTaoUserProps> = ({ onSuccess, onClose }) => {
  // FIX 2: Khởi tạo state với kiểu dữ liệu chính xác
  const [formState, setFormState] = useState<CreateUserRequest>({
    username: '',
    password: '',
    role: 'SC_STAFF', // Mặc định SC Staff
  }); // Ép kiểu an toàn

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, ) => {
    const { name, value } = event.target;
    setFormState((prev) => {
      if (name === 'role') {
          return { ...prev, role: value as UserRoleBackend }; 
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createNewUser(formState);
      
      onSuccess("Tài khoản đã được tạo thành công!");
      onClose(); // Đóng form
    } catch (err: unknown) {
      
      let errorMessage: string = "Lỗi tạo người dùng không xác định.";
      
      if(err instanceof Error) {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          disabled={loading} // FIX: Sử dụng loading state
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Đang tạo...' : 'Tạo người dùng'}
        </button>
      </div>
    </form>
  );
};

export default FormTaoUser;