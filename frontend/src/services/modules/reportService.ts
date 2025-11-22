// frontend/src/services/modules/reportService.ts
import { apiClient } from "../coreApiClient";
import { ReportRequest, ReportResponse } from "@/types/report";

// 1. GET: Lấy tất cả Reports
export const getAllReports = async (): Promise<ReportResponse[]> => {
    const response = await apiClient.get<ReportResponse[]>("/reports");
    return response.data;
};

// 2. GET: Lấy Report theo ID
export const getReportById = async (id: number): Promise<ReportResponse> => {
    const response = await apiClient.get<ReportResponse>(`/reports/${id}`);
    return response.data;
};

// 3. POST: Tạo Report mới
export const createReport = async (reportData: ReportRequest): Promise<ReportResponse> => {
    const response = await apiClient.post<ReportResponse>("/reports", reportData);
    return response.data;
};

// 4. Các hàm tìm kiếm (Ví dụ: theo Ngày)
export const getReportsByDateRange = async (startDate: string, endDate: string): Promise<ReportResponse[]> => {
    // Backend API: GET /api/reports/search/date?start={date}&end={date}
    const response = await apiClient.get<ReportResponse[]>(`/reports/search/date?start=${startDate}&end=${endDate}`);
    return response.data;
};

// 5. Cập nhật Report
export const updateReport = async (id: number, reportData: ReportRequest): Promise<ReportResponse> => {
    const response = await apiClient.put<ReportResponse>(`/reports/${id}`, reportData);
    return response.data;
};