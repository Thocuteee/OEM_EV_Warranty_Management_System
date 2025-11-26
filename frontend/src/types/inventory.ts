export interface InventoryRequest {
    id?: number;
    partId: number;
    centerId: number;
    amount: number; // Số lượng tồn kho
    invoiceDate: string; // yyyy-MM-dd
}

export interface InventoryResponse {
    id: number;
    partId: number;
    partNumber: string; 
    partName: string;
    centerId: number;
    centerName: string;
    amount: number;
    invoiceDate: string; 
}