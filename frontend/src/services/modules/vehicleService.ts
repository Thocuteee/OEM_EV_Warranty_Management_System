// frontend/src/services/modules/vehicleService.ts

import { apiClient } from '../warrantyApi'; 
import { VehicleRequest, VehicleResponse } from '@/types/warranty';

// 1. GET: Lấy tất cả Xe
export const getAllVehicles = async (): Promise<VehicleResponse[]> => {
    // Dùng apiClient đã có Token Interceptor
    const response = await apiClient.get<VehicleResponse[]>('/vehicles');
    return response.data;
};

// 2. POST: Tạo Xe mới
export const createVehicle = async (vehicleData: VehicleRequest): Promise<VehicleResponse> => {
    const response = await apiClient.post<VehicleResponse>('/vehicles', vehicleData);
    return response.data;
};

// 3. PUT: Cập nhật Xe (Sử dụng ID trong payload hoặc path)
export const updateVehicle = async (id: number, vehicleData: VehicleRequest): Promise<VehicleResponse> => {
    const response = await apiClient.put<VehicleResponse>(`/vehicles/${id}`, vehicleData);
    return response.data;
};

// 4. DELETE: Xóa Xe
export const deleteVehicle = async (id: number): Promise<void> => {
    // Controller của bạn dùng ID (Long) cho /api/vehicles/{id}
    await apiClient.delete(`/vehicles/${id}`);
};

// 5. GET: Lấy chi tiết Xe
export const getVehicleById = async (id: number): Promise<VehicleResponse> => {
    const response = await apiClient.get<VehicleResponse>(`/vehicles/${id}`);
    return response.data;
};