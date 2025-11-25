import { apiClient } from "../coreApiClient";
import { RecallCampaignRequest, RecallCampaignResponse } from "@/types/campaign"; 

// 1. GET: Lấy tất cả Campaigns
export const getAllCampaigns = async (): Promise<RecallCampaignResponse[]> => {
    const response = await apiClient.get<RecallCampaignResponse[]>("/campaigns");
    return response.data;
};

// 2. POST: Tạo Campaign mới
export const createCampaign = async (campaignData: RecallCampaignRequest): Promise<RecallCampaignResponse> => {
    const response = await apiClient.post<RecallCampaignResponse>("/campaigns", campaignData);
    return response.data;
};

// 3. PUT: Cập nhật Campaign
export const updateCampaign = async (id: number, campaignData: RecallCampaignRequest): Promise<RecallCampaignResponse> => {
    const response = await apiClient.put<RecallCampaignResponse>(`/campaigns/${id}`, campaignData);
    return response.data;
};

// 4. DELETE: Xóa Campaign
export const deleteCampaign = async (id: number): Promise<void> => {
    await apiClient.delete(`/campaigns/${id}`);
};

