// src/services/warrantyApi.ts

import axios, { AxiosResponse } from 'axios';

// URL cơ sở của Backend Spring Boot
const BASE_URL = 'http://localhost:8080/api'; 

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
            `${BASE_URL}/auth/login`, 
            loginRequest 
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
        }
        throw new Error('Không thể kết nối đến máy chủ.');
    }
};


const handleApiError = (error: unknown, defaultMessage: string): Error => {
    if (axios.isAxiosError(error) && error.response) {
        return new Error(error.response.data.message || defaultMessage);
    }
    return new Error('Không thể kết nối đến máy chủ: ' + (error as Error).message);
};




 //Lấy tất cả Parts [GET /api/parts]

export const getParts = async () => {
    try {
        // Kiểu "any" sẽ được suy ra tự động
        const response = await axios.get(`${BASE_URL}/parts`);
        return response.data;
    } catch (error) {
        throw handleApiError(error, 'Lỗi khi tải danh sách linh kiện.');
    }
};


 //Lấy tất cả Inventory [GET /api/inventory]
 
export const getInventory = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/inventory`);
        return response.data;
    } catch (error) {
        throw handleApiError(error, 'Lỗi khi tải danh sách tồn kho.');
    }
};


 //Lấy tất cả Part Serials [GET /api/part-serials]
 
export const getPartSerials = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/part-serials`);
        return response.data;
    } catch (error) {
        throw handleApiError(error, 'Lỗi khi tải danh sách serial.');
    }
};