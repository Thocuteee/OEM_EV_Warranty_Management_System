// Logic giao tiếp với Backend API (FE gọi BE)
// Fetching data, axios calls

// Logic giao tiếp với Backend API (FE gọi BE)
// Fetching data, axios calls

import axios, { AxiosResponse } from 'axios';

// URL cơ sở của Backend Spring Boot
const BASE_URL = 'http://localhost:8080/api/auth';

// Interface cho LoginRequest (dựa trên backend DTO)
export interface LoginRequest {
    username: string;
    password: string;
}

// Interface cho LoginResponse (dựa trên backend DTO)
export interface LoginResponse {
    id: number;
    username: string;
    role: string;
    token: string;
}

// Hàm gửi yêu cầu đăng nhập
export const loginUser = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    try {
        const response: AxiosResponse<LoginResponse> = await axios.post(
        `${BASE_URL}/login`, // Endpoint được định nghĩa trong AuthController
        loginRequest 
    );
    return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
        // Xử lý lỗi từ Backend (ví dụ: 401 Unauthorized)
        throw new Error(error.response.data.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
        }
        throw new Error('Không thể kết nối đến máy chủ.');
    }
};
