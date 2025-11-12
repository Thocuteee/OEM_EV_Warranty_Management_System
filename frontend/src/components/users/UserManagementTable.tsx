'use client';

import React from 'react';
import { AdminUser } from '@/types/admin';

interface UserManagementTableProps {
  users: AdminUser[];
  onView: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

const statusColorMap: Record<AdminUser['status'], string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-200 text-gray-600',
  Pending: 'bg-yellow-100 text-yellow-700',
};

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onView,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Người dùng
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Vai trò
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Ngày tạo
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Lần đăng nhập cuối
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">
                {user.id}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {user.fullName}
                  </span>
                  <span className="text-xs text-gray-500">@{user.username}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {user.role}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {user.createdAt}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {user.lastLogin ?? '--'}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColorMap[user.status]}`}
                >
                  {user.status === 'Active'
                    ? 'Đang hoạt động'
                    : user.status === 'Inactive'
                    ? 'Đã khóa'
                    : 'Chờ kích hoạt'}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(user)}
                    className="rounded-md border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => onToggleStatus(user)}
                    className="rounded-md border border-amber-100 px-3 py-1 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-50"
                  >
                    {user.status === 'Active' ? 'Khóa' : 'Kích hoạt'}
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="rounded-md border border-red-100 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                Hiện chưa có người dùng nào phù hợp với bộ lọc.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;