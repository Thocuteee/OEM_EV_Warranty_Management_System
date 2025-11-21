
import { apiClient } from "../coreApiClient";
import { StaffRequest, StaffResponse } from "@/types/staff";


// Lấy thông tin Staff theo ID (Dùng cho Admin, EVM_Staff, SC_Staff)
export const getStaffById = async (id: number): Promise<StaffResponse> => {
    // Backend API: GET /api/staffs/{id}
    const response = await apiClient.get<StaffResponse>(`/staffs/${id}`);
    return response.data;
};

// Cập nhật thông tin Staff
export const updateStaff = async (id: number, staffData: StaffRequest): Promise<StaffResponse> => {
    const response = await apiClient.put<StaffResponse>(`/staffs/${id}`, staffData);
    return response.data;
};