import { apiClient } from "../coreApiClient";
import { PartRequest, PartResponse } from "@/types/part"; 

// 1. GET: Lấy tất cả Linh kiện
export const getAllParts = async (): Promise<PartResponse[]> => {
    const response = await apiClient.get<PartResponse[]>("/parts");
    return response.data;
};

// 2. POST: Tạo Linh kiện mới
export const createPart = async (partData: PartRequest): Promise<PartResponse> => {
    const response = await apiClient.post<PartResponse>("/parts", partData);
    return response.data;
};

// 3. PUT: Cập nhật Linh kiện
export const updatePart = async (id: number, partData: PartRequest): Promise<PartResponse> => {
    const response = await apiClient.put<PartResponse>(`/parts/${id}`, partData);
    return response.data;
};

// 4. DELETE: Xóa Linh kiện
export const deletePart = async (id: number): Promise<void> => {
    await apiClient.delete(`/parts/${id}`);
};