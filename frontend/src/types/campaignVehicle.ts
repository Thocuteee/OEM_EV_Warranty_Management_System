
import { VehicleResponse } from "./vehicle";

export interface CampaignVehicleRequest {
    campaignId: number; // Backend expects campaignId, not recallCampaignId
    vehicleId: number; // Đây là ID của Vehicle
    status: string; // Bắt buộc: PENDING, ACTIVE, COMPLETED, etc.
}

export interface CampaignVehicleResponse {
    campaignId: number;
    vehicleId: number;
    campaignTitle?: string;
    vehicleVIN: string; 
    vehicleModel?: string;
    status?: string;
    // For compatibility with table display
    id?: number; // Can be derived from campaignId + vehicleId if needed
    recallCampaignId?: number; // Alias for campaignId
}