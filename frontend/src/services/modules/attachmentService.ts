import { apiClient } from "../coreApiClient";
import { ClaimAttachmentRequest, ClaimAttachmentResponse } from "@/types/attachment";

// 1. GET: Lấy tất cả attachments theo Claim ID
// API: GET /api/attachments/by-claim/{claimId}
export const getAttachmentsByClaimId = async (claimId: number): Promise<ClaimAttachmentResponse[]> => {
    const response = await apiClient.get<ClaimAttachmentResponse[]>(`/attachments/by-claim/${claimId}`);
    return response.data || [];
};

// 2. POST: Tạo mới một Claim Attachment
// API: POST /api/attachments
export const createAttachment = async (attachmentData: ClaimAttachmentRequest): Promise<ClaimAttachmentResponse> => {
    const response = await apiClient.post<ClaimAttachmentResponse>("/attachments", attachmentData);
    return response.data;
};

// 3. DELETE: Xóa Claim Attachment
// API: DELETE /api/attachments/{id}
export const deleteAttachment = async (id: number): Promise<void> => {
    await apiClient.delete(`/attachments/${id}`);
};