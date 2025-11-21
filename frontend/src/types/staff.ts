import { UserRole } from "./auth";

export interface StaffRequest {
    id?: number;
    centerId: number;
    name: string;
    role: UserRole;
    phone: string;
    address?: string; 
    email: string;
    username: string;
    password?: string; 
}

export interface StaffResponse {
    id: number;
    centerId: number;
    centerName: string;
    name: string;
    role: UserRole;
    phone: string;
    address: string;
    email: string;
    username: string;
}