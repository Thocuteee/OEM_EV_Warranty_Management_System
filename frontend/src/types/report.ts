// frontend/src/types/report.ts
export interface ReportRequest {
    id?: number;
    claimId: number;
    technicianId: number;
    centerId: number;
    vehicleId: number;
    campaignId?: number;
    
    createdById: number; 

    status: string;
    reportDate?: string; 

    startedAt?: string; 
    finishedAt?: string; 

    description?: string;
    actionTaken?: string;
    partUsed?: string;
    replacedPart?: string;

    partCost: number;      
    actualCost: number;   
    
    createdByText?: string; 
    updatedBy?: string;
    diagnosticCodes?: string;
}

export interface ReportResponse {
    id: number;

    status: string; 
    reportDate: string;
    diagnosticCodes?: string; 
    
    partCost: number;
    actualCost: number;
    totalCalculatedCost: number; 

    startedAt: string;
    finishedAt: string;
    actionTaken: string;
    
    claimId: number;
    technicianId: number;
    technicianName: string;
    centerId: number;
    vehicleId?: number;
    campaignId?: number;
    
    createdByText: string;
    createdDate: string;
    updatedAt: string;

    description?: string;
    
    partUsed?: string;
    replacedPart?: string;

}
