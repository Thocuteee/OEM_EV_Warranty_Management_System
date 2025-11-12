'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { FormTaoUser, UserManagementTable } from '@/components/users';
import { AdminUser, AdminRole, CreateAdminUserPayload } from '@/types/admin';
import {
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  toggleAdminUserStatus,
} from '@/services/adminUserService';

interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

const roleLabels: Record<AdminRole, string> = {
  Admin: 'Admin',
  'EVM Staff': 'EVM Staff',
  'SC Staff': 'SC Staff',
  'SC Technician': 'SC Technician',
};

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | AdminRole>('ALL');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAdminUsers();
        setUsers(data);
      } catch (error) {
        console.error('Không thể tải danh sách người dùng.', error);
        setToast({ type: 'error', message: 'Không thể tải danh sách người dùng.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const handleCreateUser = async (payload: CreateAdminUserPayload) => {
    try {
      const newUser = await createAdminUser(payload);
      setUsers((prev) => [...prev, newUser]);
      setModalOpen(false);
      setToast({ type: 'success', message: 'Tạo tài khoản mới thành công.' });
    } catch (error) {
      console.error('Có lỗi xảy ra khi tạo tài khoản mới.', error);
      setToast({ type: 'error', message: 'Có lỗi xảy ra khi tạo tài khoản mới.' });
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const updated = await toggleAdminUserStatus(user.id);
    if (!updated) {
      setToast({ type: 'error', message: 'Không thể cập nhật trạng thái tài khoản.' });
      return;
    }
    setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setToast({ type: 'success', message: `Đã cập nhật trạng thái cho ${updated.fullName}.` });
  };

  const handleDeleteUser = async (user: AdminUser) => {
    await deleteAdminUser(user.id);
    setUsers((prev) => prev.filter((item) => item.id !== user.id));
    if (selectedUser?.id === user.id) {
      setSelectedUser(null);
    }
    setToast({ type: 'success', message: `Đã xóa tài khoản ${user.fullName}.` });
  };

  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return users.filter((user) => {
      const matchesKeyword = keyword
        ? user.fullName.toLowerCase().includes(keyword) ||
          user.username.toLowerCase().includes(keyword)
        : true;
      const matchesRole = roleFilter === 'ALL' ? true : user.role === roleFilter;
      return matchesKeyword && matchesRole;
    });
  }, [users, searchKeyword, roleFilter]);

  const metrics = useMemo(
    () => [
      {
        label: 'Tổng số tài khoản',
        value: users.length,
      },
      {
        label: 'Đang hoạt động',
        value: users.filter((user) => user.status === 'Active').length,
      },
      {
        label: 'Chờ kích hoạt',
        value: users.filter((user) => user.status === 'Pending').length,
      },
    ],
    [users],
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
                Admin Dashboard
              </p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                Quản trị Người dùng & Phân quyền
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Theo dõi trạng thái tài khoản của SC Staff, Technician và EVM Staff. Tạo mới,
                khóa/mở khóa hoặc xóa tài khoản để đảm bảo quy trình vận hành hệ thống an
                toàn.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-transform hover:-translate-y-0.5 hover:bg-blue-700"
            >
              + Tạo người dùng mới
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-sm"
              >
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Danh sách tài khoản</h2>
              <p className="text-sm text-gray-500">
                Thực hiện GET từ <code className="rounded bg-gray-100 px-1 py-0.5">/api/users</code>
                {' '}để hiển thị danh sách người dùng cùng quyền hạn.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="Tìm kiếm theo tên hoặc username"
                  className="w-full rounded-full border border-gray-300 px-4 py-2 pl-9 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                  🔍
                </span>
              </div>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as 'ALL' | AdminRole)}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="ALL">Tất cả vai trò</option>
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-sm text-gray-500">
                Đang tải dữ liệu người dùng...
              </div>
            ) : (
              <UserManagementTable
                users={filteredUsers}
                onView={(user) => setSelectedUser(user)}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteUser}
              />
            )}
          </div>
        </div>

        {selectedUser && (
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h3>
            <p className="mt-1 text-sm text-gray-500">
              Chi tiết nhanh cho tài khoản đang được quản lý.
            </p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Họ và tên
                </dt>
                <dd className="text-base font-semibold text-gray-900">
                  {selectedUser.fullName}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Tên đăng nhập
                </dt>
                <dd className="text-base font-semibold text-gray-900">
                  @{selectedUser.username}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Vai trò
                </dt>
                <dd className="text-base font-semibold text-gray-900">{selectedUser.role}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Trạng thái hiện tại
                </dt>
                <dd className="text-base font-semibold text-gray-900">{selectedUser.status}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Ngày tạo
                </dt>
                <dd className="text-base text-gray-700">{selectedUser.createdAt}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Lần đăng nhập cuối
                </dt>
                <dd className="text-base text-gray-700">
                  {selectedUser.lastLogin ?? 'Chưa ghi nhận'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tạo tài khoản mới</h3>
                <p className="text-xs text-gray-500">
                  Gửi yêu cầu POST tới <code className="rounded bg-gray-100 px-1 py-0.5">/api/users</code>
                  {' '}để thêm tài khoản mới.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full border border-gray-200 p-2 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600"
                aria-label="Đóng form tạo tài khoản"
              >
                ✕
              </button>
            </div>
            <FormTaoUser
              onSubmit={handleCreateUser}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-40 rounded-full px-5 py-3 text-sm font-semibold shadow-lg ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </Layout>
  );
};

export default AdminUsersPage;