"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
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
    if (user && user.role !== "Admin") {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user]);

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
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Quản lý Users</h1>

      {/* Search + Button */}
      <div className="flex justify-between mb-4">
        <input
          placeholder="Tìm theo username..."
          className="border rounded px-3 py-2"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Tạo người dùng
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <UserManagementTable
          users={filteredUsers}
          onView={(u) => setSelectedUser(u)} // FIX: thêm onView bắt buộc
          onDelete={handleDeleteUser}
        />
      )}

      {/* Detail Panel */}
      {selectedUser && (
        <div className="mt-6 p-4 border rounded-xl bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">Chi tiết người dùng</h2>
          <p>
            <b>ID:</b> {selectedUser.id}
          </p>
          <p>
            <b>Username:</b> {selectedUser.username}
          </p>
          <p>
            <b>Role:</b> {selectedUser.role}
          </p>

          <button
            onClick={() => setSelectedUser(null)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Modal tạo user */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow">
            <FormTaoUser
              onSubmit={handleCreateUser}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </AdminLayout>
  );
}
