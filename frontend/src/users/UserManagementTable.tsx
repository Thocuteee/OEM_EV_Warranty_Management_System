'use client';

import React from 'react';
// Sửa 1: Dùng đường dẫn tương đối và import đúng kiểu
import { UserResponse } from '../types/warranty'; 

import { getAllUsers } from '@/services/warrantyApi';

interface UserManagementTableProps {
  users: UserResponse[];
  onView: (user: UserResponse) => void;
  // Sửa 2: Xóa onToggleStatus vì UserResponse không có 'status'
  onDelete: (user: UserResponse) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onView,
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
              Người dùng (Username)
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Vai trò
            </th>
            {/* Sửa 3: Xóa cột Trạng thái */}
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
                  {/* Sửa 4: Chỉ dùng user.username */}
                  <span className="text-sm font-semibold text-gray-900">
                    @{user.username}
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {user.role}
              </td>
              {/* Sửa 5: Xóa ô Trạng thái */}
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(user)}
                    className="rounded-md border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    Xem
                  </button>
                  {/* Sửa 6: Xóa nút Khóa/Kích hoạt */}
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
                colSpan={4} // Sửa 7: Giảm colSpan
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                Hiện chưa có người dùng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;