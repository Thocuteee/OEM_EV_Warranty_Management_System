import { apiClient } from "../coreApiClient";
import { PartSerialRequest, PartSerialResponse } from "@/types/partSerial";

// 1. GET: Lấy tất cả Serial
export const getAllPartSerials = async (): Promise<PartSerialResponse[]> => {
    const response = await apiClient.get<PartSerialResponse[]>("/part-serials");
    return response.data;
};

// 2. POST: Tạo Serial mới
export const createPartSerial = async (serialData: PartSerialRequest): Promise<PartSerialResponse> => {
    const response = await apiClient.post<PartSerialResponse>("/part-serials", serialData);
    return response.data;
};

// 3. PUT: Cập nhật Serial
export const updatePartSerial = async (id: number, serialData: PartSerialRequest): Promise<PartSerialResponse> => {
    const response = await apiClient.put<PartSerialResponse>(`/part-serials/${id}`, serialData);
    return response.data;
};

// 4. DELETE: Xóa Serial
export const deletePartSerial = async (id: number): Promise<void> => {
    await apiClient.delete(`/part-serials/${id}`);
};

// 5. GET: Lấy Serial theo ID
export const getPartSerialById = async (id: number): Promise<PartSerialResponse> => {
    const response = await apiClient.get<PartSerialResponse>(`/part-serials/${id}`);
    return response.data;
}

