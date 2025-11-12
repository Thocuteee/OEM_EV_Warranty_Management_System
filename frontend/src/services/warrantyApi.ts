// Logic giao tiếp với Backend API (FE gọi BE)
// Fetching data, axios calls

import axios, { AxiosResponse } from 'axios';
// Đảm bảo bạn đã định nghĩa RegisterRequest và RegisterResponse trong '@/types/warranty'
import { RegisterRequest, RegisterResponse } from "@/types/warranty"; 

// URL cơ sở của Backend Spring Boot
// BASE_URL cho tất cả các endpoint liên quan đến xác thực (auth)
const BASE_URL = 'http://localhost:8080/api/auth';

// --- Login Interfaces ---
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    username: string;
    role: string;
    token: string;
}

// --- Hàm gửi yêu cầu đăng nhập (Giữ nguyên) ---
export const loginUser = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    try {
        const response: AxiosResponse<LoginResponse> = await axios.post(
        `${BASE_URL}/login`, // Endpoint được định nghĩa trong AuthController
        loginRequest 
    );
    return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
        // Giả định lỗi backend trả về một object có trường message hoặc lỗi mặc định
        const backendError = error.response.data as { message?: string };
        throw new Error(backendError.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
        }
        throw new Error('Không thể kết nối đến máy chủ.');
    }
};
