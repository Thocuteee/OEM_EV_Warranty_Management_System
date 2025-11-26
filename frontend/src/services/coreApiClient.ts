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

// 3. THÊM RESPONSE INTERCEPTOR ĐỂ XỬ LÝ LỖI
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            // Xử lý lỗi 401 Unauthorized - Token hết hạn hoặc không hợp lệ
            if (error.response?.status === 401) {
                // Xóa user khỏi localStorage
                localStorage.removeItem('user');
                // Redirect về trang login (chỉ khi không phải đang ở trang login)
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'));
            }
            
            // Xử lý lỗi 403 Forbidden
            if (error.response?.status === 403) {
                return Promise.reject(new Error('Bạn không có quyền truy cập tài nguyên này.'));
            }
            
            // Xử lý lỗi 404 Not Found
            if (error.response?.status === 404) {
                return Promise.reject(new Error('Không tìm thấy tài nguyên yêu cầu.'));
            }
            
            // Xử lý lỗi 500 Server Error
            if (error.response?.status >= 500) {
                return Promise.reject(new Error('Lỗi máy chủ. Vui lòng thử lại sau.'));
            }
            
            // Xử lý lỗi network
            if (!error.response) {
                return Promise.reject(new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.'));
            }
            
            // Xử lý lỗi từ backend response
            const backendError = error.response.data as { message?: string; error?: string };
            const errorMessage = backendError?.message || backendError?.error || `Lỗi ${error.response.status}: ${error.response.statusText}`;
            return Promise.reject(new Error(errorMessage));
        }
        
        return Promise.reject(error);
    }
);


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