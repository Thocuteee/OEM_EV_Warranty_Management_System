// frontend/src/services/modules/campaignVehicleService.ts
import { apiClient } from "../coreApiClient";
import { CampaignVehicleRequest, CampaignVehicleResponse } from "@/types/campaignVehicle";

const BASE_URL = "/campaign-vehicles";

// 1. GET: Lấy tất cả Campaign Vehicles theo Campaign ID
// API: GET /api/campaign-vehicles/by-campaign/{campaignId}
export const getCampaignVehiclesByCampaignId = async (campaignId: number): Promise<CampaignVehicleResponse[]> => {
    const response = await apiClient.get<CampaignVehicleResponse[]>(`${BASE_URL}/by-campaign/${campaignId}`);
    return response.data || [];
};

// 2. GET: Lấy tất cả Campaign Vehicles theo Vehicle ID
// API: GET /api/campaign-vehicles/by-vehicle/{vehicleId}
export const getCampaignVehiclesByVehicleId = async (vehicleId: number): Promise<CampaignVehicleResponse[]> => {
    const response = await apiClient.get<CampaignVehicleResponse[]>(`${BASE_URL}/by-vehicle/${vehicleId}`);
    return response.data || [];
};

// 3. POST: Thêm Vehicle vào Campaign
// API: POST /api/campaign-vehicles
export const addVehicleToCampaign = async (campaignVehicleData: CampaignVehicleRequest): Promise<CampaignVehicleResponse> => {
    const response = await apiClient.post<CampaignVehicleResponse>(BASE_URL, campaignVehicleData);
    return response.data;
};

// 4. DELETE: Xóa Vehicle khỏi Campaign (bằng Campaign ID và Vehicle ID)
// API: DELETE /api/campaign-vehicles/{campaignId}/{vehicleId}
export const removeVehicleFromCampaign = async (campaignId: number, vehicleId: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${campaignId}/${vehicleId}`);
};