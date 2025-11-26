export interface WarrantyPolicyRequest {
    id?: number;
    policyName: string;
    durationMonths: number;
    mileageLimit: number;
    coverageDescription?: string;
}

export interface WarrantyPolicyResponse {
    id: number;
    policyName: string;
    durationMonths: number;
    mileageLimit: number;
    coverageDescription: string;
}