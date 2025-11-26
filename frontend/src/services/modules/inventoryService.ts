import { apiClient } from "../coreApiClient";
import { InventoryRequest, InventoryResponse } from "@/types/inventory";

// 1. GET: Lấy tất cả Inventory Records
export const getAllInventory = async (): Promise<InventoryResponse[]> => {
    const response = await apiClient.get<InventoryResponse[]>("/inventory");
    return response.data;
};

// 2. POST: Tạo/Cập nhật Inventory Record (Upsert)
export const createOrUpdateInventory = async (inventoryData: InventoryRequest): Promise<InventoryResponse> => {
    // API Controller chỉ dùng POST cho cả tạo mới và update (nếu không có ID)
    const response = await apiClient.post<InventoryResponse>("/inventory", inventoryData);
    return response.data;
};

// 3. PUT: Cập nhật Inventory (Sử dụng PUT nếu có ID)
export const updateInventory = async (id: number, inventoryData: InventoryRequest): Promise<InventoryResponse> => {
    const response = await apiClient.put<InventoryResponse>(`/inventory/${id}`, inventoryData);
    return response.data;
};

// 4. DELETE: Xóa Inventory Record
export const deleteInventory = async (id: number): Promise<void> => {
    await apiClient.delete(`/inventory/${id}`);
};