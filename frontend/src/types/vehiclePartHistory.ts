export interface VehiclePartHistoryRequest {
    id?: number;
    vehicleId: number;
    partSerialId: number;
    claimId: number;
    dateInstalled?: string; // yyyy-MM-dd
}

export interface VehiclePartHistoryResponse {
    id: number;
    vehicleId: number;
    vehicleVIN: string; // Tên xe/VIN để hiển thị
    partSerialId: number;
    partSerialNumber: string; // Số Serial để hiển thị
    claimId: number;
    claimStatus: string;
    dateInstalled: string;
}