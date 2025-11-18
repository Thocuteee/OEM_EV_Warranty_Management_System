import { apiClient } from '../coreApiClient'; // Import Client mới
import { UserResponse, UserRequest } from '@/types/user';
import { FullUserCreationRequest } from '@/types/admin'; // Cho DTO tạo user phức tạp

// 1. GET: Lấy tất cả User
export const getAllUsers = async (): Promise<UserResponse[]> => {
    const response = await apiClient.get<UserResponse[]>('/users');
    return response.data;
};

// 2. POST: Tạo User mới (Dành cho Admin)
export const createNewUser = async (userData: FullUserCreationRequest): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/users', userData as UserRequest); 
    return response.data;
}

// 3. DELETE: Xóa User
export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};