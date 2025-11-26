export interface ClaimAttachmentRequest {
    id?: number;
    claimId: number;
    fileUrl: string; // URL lưu trữ file
    type: string;   // Ví dụ: IMAGE, DOCUMENT, VIDEO
}

export interface ClaimAttachmentResponse {
    id: number;
    claimId: number;
    fileUrl: string;
    type: string;
}