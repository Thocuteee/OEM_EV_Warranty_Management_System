// frontend/src/services/modules/technicianService.ts
import { apiClient } from "../coreApiClient";
import { TechnicianResponse, TechnicianRequest } from "@/types/technician";

// GET: Lấy tất cả Kỹ thuật viên (cho dropdown gán Claim)
export const getAllTechnicians = async (): Promise<TechnicianResponse[]> => {
    const response = await apiClient.get<TechnicianResponse[]>("/technicians");
    return response.data;
};

// GET: Lấy Kỹ thuật viên theo ID
export const getTechnicianById = async (id: number): Promise<TechnicianResponse> => {
    const response = await apiClient.get<TechnicianResponse>(`/technicians/${id}`);
    return response.data;
};

// THÊM: PUT: Cập nhật thông tin Technician
export const updateTechnician = async (id: number, technicianData: TechnicianRequest): Promise<TechnicianResponse> => {
    const response = await apiClient.put<TechnicianResponse>(`/technicians/${id}`, technicianData);
    return response.data;
};