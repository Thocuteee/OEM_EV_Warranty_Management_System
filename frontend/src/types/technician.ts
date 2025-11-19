import { UserRole } from "./auth"; 

export interface TechnicianRequest {
    id?: number;
    centerId: number;
    name: string;
    phone: string;
    email: string;
    specialization: string;
    username: string;
    password?: string; 
}

export interface TechnicianResponse {
    id: number;
    centerId: number;
    centerName: string;
    name: string;
    phone: string;
    email: string;
    specialization: string;
    username: string;
}