export type UserRole = 'Admin' | 'EVM_Staff' | 'SC_Staff' | 'SC_Technician';

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