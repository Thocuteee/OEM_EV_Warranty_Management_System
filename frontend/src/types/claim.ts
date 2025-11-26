export interface WarrantyClaimRequest {
    staffId: number;
    vehicleId: number;
    customerId: number;
    centerId: number;
    totalCost: number; // BigDecimal
    description: string;
    technicianId?: number | null;
    currentMileage?: number; // Số KM hiện tại của xe
}

export interface WarrantyClaimResponse {
    id: number;
    vehicleId: number;
    vehicleVIN: string;
    customerId: number;
    customerName: string;
    centerId: number;
    technicianId: number | null;
    status: string;
    approvalStatus: string;
    totalCost: number;
    createdAt: string;
    updatedAt: string;
    description: string;
    currentMileage?: number; // Số KM hiện tại của xe
}