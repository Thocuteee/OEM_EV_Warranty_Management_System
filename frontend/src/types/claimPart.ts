export interface ClaimPartRequest {
    claimId: number;
    partId: number;
    quantity: number;
    unitPrice: number; 
    totalPrice?: number;
}

export interface ClaimPartResponse {
    claimId: number;
    partId: number;

    partNumber: string;
    partName: string;

    quantity: number;
    unitPrice: number;
    totalPrice: number;
}