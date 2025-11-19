export interface WorkLogRequest {
    id?: number;
    claimId: number;
    technicianId: number;
    
    startTime: string; 
    endTime: string;   
    logDate?: string;  
    
    duration?: number; 
    notes?: string;
}

export interface WorkLogResponse {
    id: number;
    claimId: number;
    technicianId: number;
    technicianName: string;
    
    startTime: string;
    endTime: string;
    logDate: string;
    duration: number;
    notes: string;
}