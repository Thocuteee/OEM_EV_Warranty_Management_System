import { apiClient } from "../coreApiClient";
import { ServiceCenterResponse } from '@/types/center'; 

// HÀM CHÍNH: Lấy tất cả Trung tâm Dịch vụ
export const getAllServiceCenters = async (): Promise<ServiceCenterResponse[]> => {
    const response = await apiClient.get<ServiceCenterResponse[]>("/centers");
    return response.data;
};