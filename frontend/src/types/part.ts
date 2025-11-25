export interface PartRequest {
    id?: number;
    name: string;
    partNumber: string;
    price: number;
}

export interface PartResponse {
    id: number;
    name: string;
    partNumber: string;
    price: number;
}