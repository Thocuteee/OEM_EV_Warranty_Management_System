import { UserRole } from "./auth"; // Import từ file mới

export interface UserRequest {
    id?: number;
    username: string;
    password: string;
    role: UserRole;
}

export interface UserResponse {
    id: number;
    username: string;
    role: UserRole;
}

