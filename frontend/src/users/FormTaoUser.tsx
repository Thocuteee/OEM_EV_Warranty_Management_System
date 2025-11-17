'use client';
import React, { useState } from 'react';
// FIX: Đảm bảo import đúng hai kiểu dữ liệu này từ file types/admin.ts
import { CreateUserPayload, UserRoleBackend } from '@/types/admin'; 
import { createNewUser } from '@/services/warrantyApi';
// Cần import React.FC nếu bạn sử dụng nó

interface FormTaoUserProps {
  onSuccess: (message: string) => void;
  onClose: () => void;
}

const roleOptions: { label: string; value: UserRoleBackend }[] = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'EVM Staff', value: 'EVM_STAFF' },
  { label: 'SC Staff', value: 'SC_STAFF' },
  { label: 'SC Technician', value: 'SC_TECHNICIAN' },
];

const FormTaoUser: React.FC<FormTaoUserProps> = ({ onSuccess, onClose }) => {
  const [formState, setFormState] = useState<CreateUserPayload>({
    username: '',
    password: '',
    role: 'SC_STAFF' as UserRoleBackend, 
  } as CreateUserPayload);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
  ) => {
    const { name, value } = event.target;
    
    setFormState((prev) => {
        // FIX 3: Xử lý trường 'role' (ép kiểu có điều kiện)
        if (name === 'role') {
            return { ...prev, role: value as UserRoleBackend }; 
        }

        return { ...prev, [name as keyof CreateUserPayload]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gửi formState (kiểu CreateUserPayload)
      await createNewUser(formState); 
      
      onSuccess("Tài khoản đã được tạo thành công!");
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