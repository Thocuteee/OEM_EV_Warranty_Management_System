'use client';

import React, { useState } from 'react';
import { AdminRole, CreateAdminUserPayload } from '@/types/admin';

interface FormTaoUserProps {
  onSubmit: (payload: CreateAdminUserPayload) => Promise<void> | void;
  onClose: () => void;
}

const roleOptions: { label: string; value: AdminRole }[] = [
  { label: 'Admin', value: 'Admin' },
  { label: 'EVM Staff', value: 'EVM Staff' },
  { label: 'SC Staff', value: 'SC Staff' },
  { label: 'SC Technician', value: 'SC Technician' },
];

const FormTaoUser: React.FC<FormTaoUserProps> = ({ onSubmit, onClose }) => {
  const [formState, setFormState] = useState<CreateAdminUserPayload>({
    fullName: '',
    username: '',
    password: '',
    role: 'SC Staff',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.fullName || !formState.username || !formState.password) {
      setError('Vui lòng nhập đầy đủ Họ tên, Tên đăng nhập và Mật khẩu.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(formState);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Không thể tạo tài khoản mới. Vui lòng thử lại.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Họ và tên
        </label>
        <input
          name="fullName"
          value={formState.fullName}
          onChange={handleChange}
          placeholder="Ví dụ: Nguyễn Văn A"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          autoComplete="name"
        />
      </div>

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
            Mật khẩu tạm
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
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
        </button>
      </div>
    </form>
  );
};

export default FormTaoUser;
