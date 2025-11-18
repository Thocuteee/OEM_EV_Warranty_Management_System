export interface CustomerRequest {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface CustomerResponse {
    id: number; // customer_id
    name: string;
    email: string;
    phone: string;
    address: string;
}

