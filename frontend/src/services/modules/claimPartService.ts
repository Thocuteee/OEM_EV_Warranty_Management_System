import { apiClient } from "../coreApiClient";
import { ClaimPartRequest, ClaimPartResponse } from "@/types/claimPart"; 

// GET: Lấy tất cả ClaimPart theo Claim ID
export const getClaimPartsByClaimId = async (claimId: number): Promise<ClaimPartResponse[]> => {
    // Giả định API Backend có endpoint GET /api/claim-parts?claimId={claimId}
    const response = await apiClient.get<ClaimPartResponse[]>(`/claim-parts?claimId=${claimId}`);
    return response.data;
};

// POST: Thêm ClaimPart mới
export const createClaimPart = async (claimPartData: ClaimPartRequest): Promise<ClaimPartResponse> => {
    const response = await apiClient.post<ClaimPartResponse>("/claim-parts", claimPartData);
    return response.data;
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