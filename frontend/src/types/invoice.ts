export interface InvoiceRequest {
    id?: number;
    claimId: number;
    partId: number;
    centerId: number;
    
    locationType: string;
    quantity: number;
    minStockLevel: number;
    paymentsStatus: string;
}

export interface InvoiceResponse {
    id: number;
    claimId: number;
    partId: number;
    partName: string; 
    centerId: number;
    centerName: string;
    
    locationType: string;
    quantity: number;
    minStockLevel: number;
    paymentsStatus: string;
}


