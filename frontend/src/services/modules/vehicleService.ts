import { apiClient } from "../coreApiClient";
import { VehicleRequest, VehicleResponse } from "@/types/vehicle";

// 1. GET: Lấy tất cả Xe
export const getAllVehicles = async (): Promise<VehicleResponse[]> => {
  const response = await apiClient.get<VehicleResponse[]>("/vehicles");
  return response.data;
};

// 2. POST: Tạo Xe mới
export const createVehicle = async (vehicleData: VehicleRequest): Promise<VehicleResponse> => {
  const response = await apiClient.post<VehicleResponse>("/vehicles", vehicleData);
  return response.data;
};

// 3. PUT: Cập nhật Xe (Sử dụng ID trong payload hoặc path)
export const updateVehicle = async (id: number,vehicleData: VehicleRequest): Promise<VehicleResponse> => {
  const response = await apiClient.put<VehicleResponse>(`/vehicles/${id}`, vehicleData);
  return response.data;
};

// 4. DELETE: Xóa Xe
export const deleteVehicle = async (id: number): Promise<void> => {
  await apiClient.delete(`/vehicles/${id}`);
};

// 5. GET: Lấy chi tiết Xe
export const getVehicleById = async (id: number): Promise<VehicleResponse> => {
  const response = await apiClient.get<VehicleResponse>(`/vehicles/${id}`);
  return response.data;
};

// 6. GET: Lấy chi tiết Xe theo VIN (Cần thiết cho Claim Creation)
export const getVehicleByVIN = async (vin: string): Promise<VehicleResponse> => {
  const response = await apiClient.get<VehicleResponse>(`/vehicles/search?vin=${vin}`);
  return response.data;
};


// 7. PUT: Cập nhật Trạng thái Đăng ký
export const updateVehicleRegistrationStatus = async (id: number, newStatus: 'APPROVED' | 'REJECTED', approverUserId: number): Promise<VehicleResponse> => {
  const response = await apiClient.put<VehicleResponse>(`/vehicles/${id}/status?newStatus=${newStatus}&approverUserId=${approverUserId}`);
  return response.data;
};