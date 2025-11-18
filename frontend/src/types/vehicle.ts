// /types/vehicle.ts

export interface Vehicle {
  id: number;
  vin: string;
  model: string;
  licensePlate: string;
  year: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  createdAt: string;
  updatedAt: string;
}

// Request tạo mới
export interface CreateVehicleRequest {
  vin: string;
  model: string;
  licensePlate: string;
  year: number;
}

// Request update
export interface UpdateVehicleRequest {
  model?: string;
  licensePlate?: string;
  year?: number;
  status?: string;
}
