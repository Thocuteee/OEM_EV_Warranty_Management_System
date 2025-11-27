"use client";

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { UserRequest, UserResponse} from "@/types/user";
import {UserRole} from "@/types/auth";
import { FullUserCreationRequest } from "@/types/admin";
// THÊM: Import axios để xử lý lỗi HTTP
import axios from "axios";
import {
  getAllUsers,
  deleteUser,
  createNewUser,
} from "@/services/modules/userService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { FormTaoUser, UserManagementTable } from "@/users";

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  // ---------------------------------------
  // Bảo vệ route
  // ---------------------------------------
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const allowedRoles = ["Admin", "EVM_Staff"];
    if(user && !allowedRoles.includes(user.role)) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router]);

  // ---------------------------------------
  // Load danh sách user
  // ---------------------------------------
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch {
        setToast("Không thể tải danh sách người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user]);

  // ---------------------------------------
  // Lọc user theo search
  // ---------------------------------------
  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.toLowerCase();
    return users.filter((u) => u.username.toLowerCase().includes(keyword));
  }, [users, searchKeyword]);

  // ---------------------------------------
  // Tạo tài khoản
  // ---------------------------------------
  const handleCreateUser = async (payload: FullUserCreationRequest) => {
    let errorMessage = "Lỗi tạo tài khoản không xác định.";
    try {
      const newUser = await createNewUser(payload as UserRequest);
      setUsers((prev) => [...prev, newUser]);
      setModalOpen(false);
      setToast("Tạo tài khoản thành công");
    } catch (err: unknown) {
      setToast("Lỗi khi tạo tài khoản");
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (axios.isAxiosError(err) && err.response) {
        // Cần import axios
        // Lỗi từ backend thường nằm trong response.data
        const apiError = err.response.data as { message: string };
        errorMessage = apiError.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

  // ---------------------------------------
  // Xóa user
  // ---------------------------------------
  const handleDeleteUser = async (u: UserResponse) => {
    if (!confirm("Bạn chắc muốn xóa?")) return;

    await deleteUser(u.id);
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    setToast("Đã xóa");
  };

  // ---------------------------------------
  // Toast auto hide 3s
  // ---------------------------------------
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!user) return null;

  return (
    <Layout>
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Users</h1>
        <p className="text-gray-600">Quản lý tài khoản người dùng trong hệ thống</p>
      </div>

      {/* Search + Button */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <input
          placeholder="Tìm theo username..."
          className="flex-1 max-w-md border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-colors flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          <span>Tạo người dùng</span>
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-xl shadow-md border text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách người dùng...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <UserManagementTable
            users={filteredUsers}
            onView={(u) => setSelectedUser(u)}
            onDelete={handleDeleteUser}
          />
        </div>
      )}

      {/* Detail Panel - Improved */}
      {selectedUser && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md border">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết người dùng</h2>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">ID</p>
              <p className="text-lg font-semibold text-gray-900">{selectedUser.id}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Username</p>
              <p className="text-lg font-semibold text-gray-900">@{selectedUser.username}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Vai trò</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {selectedUser.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo user - Improved */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tạo người dùng mới</h2>
              <p className="text-gray-600 text-sm">Điền thông tin để tạo tài khoản người dùng mới</p>
            </div>
            <FormTaoUser
              onSubmit={handleCreateUser}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Toast - Improved */}
      {toast && (
        <div 
          className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 z-50 cursor-pointer hover:bg-green-700 flex items-center gap-3"
          onClick={() => setToast(null)}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">{toast}</span>
        </div>
      )}
    </Layout>
  );
}
