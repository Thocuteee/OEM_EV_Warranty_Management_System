    export type UserRole = 'SC_Staff' | 'SC_Technician' | 'EVM_Staff' | 'Admin' | 'Customer';

    export interface LoginRequest {
    username: string;
    password: string;
    }

    export interface LoginResponse {
    id: number;
    username: string;
    role: UserRole;
    token: string;
    }

    export interface UserProfile {
    id: number;
    username: string;
    name: string;
    role: UserRole;
    token: string;
    }

    export interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (userData: UserProfile) => void;
    logout: () => void;
    }

    export interface RegisterRequest {
    fullName: string;
    username: string;
    password: string;
    }

    export interface RegisterResponse {
    message?: string;
    }

    export interface UserRequest {
    id?: number;
    username: string;
    password?: string;
    role: UserRole;
    }

    export interface UserResponse {
    id: number;
    username: string;
    role: UserRole;
    fullName?: string;
    status?: 'Active' | 'Inactive' | 'Pending';
    createdAt?: string;
    lastLogin?: string;
    }

    export type AdminUser = UserResponse;

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
    endDate?: string;
    campaignStatus: string;
    }

    export interface ClaimApprovalResponse {
    id: number;
    vehicleId: number;
    vehicleVIN: string;
    customerId: number;
    customerName: string;
    centerId: number;
    technicianId: number;
    status: string;
    approvalStatus: string;
    totalCost: number;
    createdAt: string;
    updatedAt: string;
    description: string;
    }