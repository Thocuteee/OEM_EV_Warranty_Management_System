export interface RecallCampaignRequest {
    id?: number;
    title: string;
    startDate: string; 
    endDate?: string; 
}

export interface RecallCampaignResponse {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    campaignStatus: string; 
}

