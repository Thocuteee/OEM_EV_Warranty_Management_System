import { apiClient } from "../coreApiClient";
import { WorkLogRequest, WorkLogResponse } from "@/types/workLog";

// POST: Tạo mới một Work Log
export const createWorkLog = async (logData: WorkLogRequest): Promise<WorkLogResponse> => {
    const response = await apiClient.post<WorkLogResponse>("/worklogs", logData);
    return response.data;
};

// GET: Lấy tất cả Work Logs (thường dùng để hiển thị trong bảng con)
export const getAllWorkLogs = async (): Promise<WorkLogResponse[]> => {
    const response = await apiClient.get<WorkLogResponse[]>("/worklogs");
    return response.data;
};

// GET: Lấy Work Logs theo Claim ID (Cần thiết cho trang Chi tiết Claim)
export const getWorkLogsByClaimId = async (claimId: number): Promise<WorkLogResponse[]> => {
    const response = await apiClient.get<WorkLogResponse[]>(`/worklogs/search/claim/${claimId}`);
    return response.data;
};

// DELETE: Xóa Work Log
export const deleteWorkLog = async (id: number): Promise<void> => {
    await apiClient.delete(`/worklogs/${id}`);
};