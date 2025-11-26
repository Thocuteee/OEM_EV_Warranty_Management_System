import { apiClient } from "../coreApiClient";
import { WarrantyPolicyRequest, WarrantyPolicyResponse } from "@/types/warrantyPolicy";

// 1. GET ALL
export const getAllPolicies = async (): Promise<WarrantyPolicyResponse[]> => {
    const response = await apiClient.get<WarrantyPolicyResponse[]>("/warranty-policies");
    return response.data;
};

// 2. CREATE
export const createPolicy = async (data: WarrantyPolicyRequest): Promise<WarrantyPolicyResponse> => {
    const response = await apiClient.post<WarrantyPolicyResponse>("/warranty-policies", data);
    return response.data;
};

// 3. UPDATE
export const updatePolicy = async (id: number, data: WarrantyPolicyRequest): Promise<WarrantyPolicyResponse> => {
    const response = await apiClient.put<WarrantyPolicyResponse>(`/warranty-policies/${id}`, data);
    return response.data;
};

// 4. DELETE
export const deletePolicy = async (id: number): Promise<void> => {
    await apiClient.delete(`/warranty-policies/${id}`);
};