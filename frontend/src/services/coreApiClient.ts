// frontend/src/services/coreApiClient.ts (Đổi tên từ warrantyApi.ts)

import axios, { AxiosResponse } from 'axios';
import { LoginRequest, LoginResponse } from '@/types/auth'; 

export const BASE_URL = 'http://localhost:8080/api';

// 1. KHỞI TẠO INSTANCE CÓ INTERCEPTOR
export const apiClient = axios.create({
    baseURL: BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. THÊM INTERCEPTOR ĐỂ GỬI TOKEN TỰ ĐỘNG
apiClient.interceptors.request.use((config) => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            const token = user.token; 
            
            if (token && !config.url?.includes('/auth/login')) { 
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.error("Lỗi parse user từ localStorage:", e);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// 3. API: POST /api/auth/login (GIỮ LẠI TRONG FILE NÀY VÌ LÀ AUTH CORE)
export const loginUser = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    try {
        // Dùng axios TRỰC TIẾP và BASE_URL
        const response: AxiosResponse<LoginResponse> = await axios.post(`${BASE_URL}/auth/login`, loginRequest);
        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error) && error.response) {
            const backendError = error.response.data as {message?: string};
            throw new Error(backendError.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
        }
        throw new Error('Không thể kết nối đến máy chủ.');
    }
};