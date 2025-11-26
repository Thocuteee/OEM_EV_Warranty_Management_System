import { apiClient } from "../coreApiClient";
import { VehiclePartHistoryRequest, VehiclePartHistoryResponse } from "@/types/vehiclePartHistory";

// 1. GET: Lấy tất cả bản ghi Lịch sử (Trả về MẢNG)
export const getAllVehiclePartHistory = async (): Promise<VehiclePartHistoryResponse[]> => {
    const response = await apiClient.get<VehiclePartHistoryResponse[]>("/vehicle-history");
    return response.data;
};

// 2. GET: Lấy lịch sử theo Vehicle ID (Trả về MẢNG)
export const getHistoryByVehicleId = async (vehicleId: number): Promise<VehiclePartHistoryResponse[]> => {
    const response = await apiClient.get<VehiclePartHistoryResponse[]>(`/vehicle-history/by-vehicle/${vehicleId}`);
    return response.data || [];
};

// 3. POST: Tạo mới Lịch sử Linh kiện (Trả về ĐỐI TƯỢNG ĐƠN LẺ)
export const createVehiclePartHistory = async (record: VehiclePartHistoryRequest): Promise<VehiclePartHistoryResponse> => {
    // Dữ liệu tạo mới chỉ trả về một đối tượng
    const response = await apiClient.post<VehiclePartHistoryResponse>("/vehicle-history", record);
    return response.data;
};

// 4. DELETE: Xóa Lịch sử
export const deleteVehiclePartHistory = async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicle-history/${id}`);
};