import { apiClient } from "../coreApiClient";
import { WarrantyClaimRequest, WarrantyClaimResponse } from "@/types/claim";

// 1. GET: Lấy tất cả Claims
export const getAllWarrantyClaims = async (): Promise<WarrantyClaimResponse[]> => {
    const response = await apiClient.get<WarrantyClaimResponse[]>("/warranty-claims");
    return response.data;
};

// 2. GET: Lấy chi tiết Claim theo ID (ĐÃ THÊM HÀM THIẾU)
export const getClaimById = async (id: number): Promise<WarrantyClaimResponse> => {
  // API Backend Controller sử dụng endpoint GET /api/warranty-claims/{id}
    const response = await apiClient.get<WarrantyClaimResponse>(`/warranty-claims/${id}`);
    return response.data;
};

// 3. POST: Tạo Claim mới
export const createWarrantyClaim = async (claimData: WarrantyClaimRequest): Promise<WarrantyClaimResponse> => {
    const response = await apiClient.post<WarrantyClaimResponse>("/warranty-claims", claimData);
    return response.data;
};

// 4. PUT: Cập nhật Trạng thái Phê duyệt (dùng cho EVM Staff)
export const updateClaimStatus = async (id: number, approvalStatus: 'APPROVED' | 'REJECTED'): Promise<WarrantyClaimResponse> => {
    const response = await apiClient.put<WarrantyClaimResponse>(`/warranty-claims/${id}/status/approve?approvalStatus=${approvalStatus}`
    );
    return response.data;
};

// 5. DELETE: Xóa Claim (Chỉ Claim ở trạng thái DRAFT) - API này có trong Controller
export const deleteWarrantyClaim = async (id: number): Promise<void> => {
    await apiClient.delete(`/warranty-claims/${id}`);
};

export const sendClaimToEVM = async (id: number): Promise<WarrantyClaimResponse> => {
    const response = await apiClient.put<WarrantyClaimResponse>(`/warranty-claims/${id}/send`);
    return response.data;
};

export const getClaimsByStatuses = async(statuses:string[]): Promise<WarrantyClaimResponse[]> => {
    const statusList = statuses.join(',');
    const response = await apiClient.get<WarrantyClaimResponse[]>(`/warranty-claims/search/statuses?statuses=${statusList}`);
    return response.data;
};

// 8. PUT: Cập nhật Technician ID cho Claim
export const updateClaimTechnician = async (claimId: number, technicianId: number): Promise<WarrantyClaimResponse> => {
    const response = await apiClient.put<WarrantyClaimResponse>(`/warranty-claims/${claimId}/assign-tech?technicianId=${technicianId}`);
    return response.data;
};