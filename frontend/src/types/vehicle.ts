export interface VehicleRequest {
    id?: number; 
    customerId?: number; // FK
    registeredByUserId: number;
    vin: string;
    model: string;
    year: string;
}


export interface VehicleResponse {
    id: number;
    vin: string;
    model: string;
    year: string;
    customerId: number;
    customerName: string; 
    registrationStatus: string;
    registeredByUserId: number;
    registeredByUsername: string;
}