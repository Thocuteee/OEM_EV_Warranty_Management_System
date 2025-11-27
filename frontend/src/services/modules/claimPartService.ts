import { apiClient } from "../coreApiClient";
import { ClaimPartRequest, ClaimPartResponse } from "@/types/claimPart"; 

// GET: Lấy tất cả ClaimPart theo Claim ID
export const getClaimPartsByClaimId = async (claimId: number): Promise<ClaimPartResponse[]> => {
    try {
        // Backend có endpoint GET /api/claim-parts/by-claim/{claimId}
        const response = await apiClient.get<ClaimPartResponse[]>(`/claim-parts/by-claim/${claimId}`);
        // Đảm bảo trả về mảng rỗng nếu response.data là null/undefined
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error(`Error fetching claim parts for claim ${claimId}:`, error);
        // Trả về mảng rỗng thay vì throw error để không làm gián đoạn việc load claim detail
        return [];
    }
};

// POST: Thêm ClaimPart mới
export const createClaimPart = async (claimPartData: ClaimPartRequest): Promise<ClaimPartResponse> => {
    console.log("Creating claim part with data:", claimPartData);
    try {
        const response = await apiClient.post<ClaimPartResponse>("/claim-parts", claimPartData);
        console.log("Claim part created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating claim part:", error);
        throw error;
    }
};

// PUT: Cập nhật thông tin ClaimPart
export const updateClaimPart = async (id: number, claimPartData: ClaimPartRequest): Promise<ClaimPartResponse> => {
    const response = await apiClient.put<ClaimPartResponse>(`/claim-parts/${id}`, claimPartData);
    return response.data;
};

// DELETE: Xóa ClaimPart
export const deleteClaimPart = async (id: number): Promise<void> => {
    await apiClient.delete(`/claim-parts/${id}`);
};

export const deleteClaimPartByCompositeId = async (claimId: number, partId: number): Promise<void> => {
    await apiClient.delete(`/claim-parts/${claimId}/${partId}`);
};