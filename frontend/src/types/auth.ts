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

export interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (userData: UserProfile) => void;
    logout: () => void;
    updateProfile: (profileUpdate: Partial<UserProfile>) => void;
}

export interface UserProfile {
    id: number;
    username: string;
    name: string; 
    email: string;
    role: UserRole;
    token: string;
}