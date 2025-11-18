import axios, { AxiosResponse } from 'axios';

import { 
  LoginRequest, 
  LoginResponse, 
  RecallCampaignRequest, 
  RecallCampaignResponse, 
  ClaimApprovalResponse, 
  UserResponse, 
  UserRequest,
} from '@/types/warranty';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// THÊM INTERCEPTOR ĐỂ GỬI TOKEN TỰ ĐỘNG
apiClient.interceptors.request.use((config) => {
    // Lấy token từ localStorage (nơi bạn lưu trong AuthContext)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const token = user.token; 
        
        if (token && config.url !== `${BASE_URL}/auth/login`) { // Không gửi token khi login
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- Auth API ---
export const loginUser = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  try {
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


// 1. GET: Lấy tất cả User
export const getAllUsers = async (): Promise<UserResponse[]> => {
  const response = await apiClient.get<UserResponse[]>('/users');
  return response.data;

};

// 2. POST: Tạo User mới (Dành cho Admin)
export const createNewUser = async (userData: UserRequest): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/users', userData);
  return response.data;

};

// 3. DELETE: Xóa User
export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

// Campaign API
// 1. GET: Lấy tất cả RecallCampaign
export const getCampaign = async (): Promise<RecallCampaignResponse[]> => {
  const response = await apiClient.get<RecallCampaignResponse[]>('/campaigns');
  return response.data;
};

// 1. POST: Tạo RecallCampaign mới
export const createCampaign = async (campaignData:RecallCampaignRequest): Promise<RecallCampaignResponse[]> => {
  const response = await apiClient.post<RecallCampaignResponse[]>('/campaigns', campaignData);
  return response.data;
}

// Claim Approval API
export const getPendingClaims = async (): Promise<ClaimApprovalResponse[]> => {
  try {
    const response = await apiClient.get<ClaimApprovalResponse[]>('/claims/search', {params: { approvalStatus: 'PENDING' }});
    // LƯU Ý: Vẫn cần lọc Claim có status là 'SENT' (đã gửi)
    return response.data.filter(claim => claim.status === 'SENT'); 
  } catch (error) {
      console.error("Lỗi khi lấy danh sách claim chờ duyệt:", error);
      throw new Error('Không thể tải danh sách claim.');
  }
};

export const updateClaimApprovalStatus = async (claimId: number, newStatus: 'APPROVED' | 'REJECTED'): Promise<ClaimApprovalResponse> => {
  try {
    const response = await apiClient.put<ClaimApprovalResponse>(`/claims/${claimId}/status/approve`, { status: newStatus } );
      return response.data;
  } catch (error) {
      console.error(`Lỗi khi ${newStatus} claim ${claimId}:`, error);
      throw new Error('Không thể cập nhật trạng thái claim.');
  }
};

// --- Hàm gửi yêu cầu đăng ký (MỚI) ---
/**
 * Hàm gửi yêu cầu đăng ký người dùng mới đến backend.
 * @param registerRequest Dữ liệu đăng ký: fullName, username, password.
 * @returns Promise<RegisterResponse> Dữ liệu trả về từ backend (thường là thông báo thành công).
 */
export const registerUser = async (registerRequest: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await axios.post(
            // SỬ DỤNG BASE_URL ĐÃ ĐỊNH NGHĨA
            `${BASE_URL}/register`, 
            {
                // Dữ liệu tối thiểu cần gửi (Cần khớp với UserRequest.java)
                username: registerRequest.username,
                password: registerRequest.password,
                // LƯU Ý: Phải thêm Role (giả định là SC_Staff theo đề bài của bạn)
                role: 'SC_Staff' // PHẢI KHỚP VỚI ENUM TRONG JAVA
            }
        );
        return response.data;
    } catch (error) {
        // Logic xử lý lỗi: re-throw lỗi để component có thể bắt
        if (axios.isAxiosError(error) && error.response) {
            const backendError = error.response.data as { message?: string };
            throw new Error(backendError.message || 'Đăng ký thất bại.');
        }
        throw new Error('Không thể kết nối đến máy chủ.');
    }
};

import { Part, InventoryItem, SerialPart, ReportResponse, ReportStats, TopPart } from "@/types/warranty";

// --- Parts & Inventory APIs ---
const PARTS_BASE_URL = 'http://localhost:8080/api/parts';
const INVENTORY_BASE_URL = 'http://localhost:8080/api/inventory';
const REPORT_BASE_URL = 'http://localhost:8080/api/reports';

// GET Danh sách Parts
export const getParts = async (): Promise<Part[]> => {
  try {
    const response: AxiosResponse<Part[]> = await axios.get(PARTS_BASE_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const backendError = error.response.data as { message?: string };
      throw new Error(backendError.message || 'Lỗi tải danh sách linh kiện.');
    }
    throw new Error('Không thể kết nối đến máy chủ.');
  }
};

// POST Tạo Part Mới
export const createPart = async (partData: Omit<Part, 'id'>): Promise<Part> => {
  try {
    const response: AxiosResponse<Part> = await axios.post(PARTS_BASE_URL, partData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const backendError = error.response.data as { message?: string };
      throw new Error(backendError.message || 'Tạo linh kiện thất bại.');
    }
    throw new Error('Không thể kết nối đến máy chủ.');
  }
};

// GET Inventory
export const getInventory = async (): Promise<InventoryItem[]> => {
  try {
    const response: AxiosResponse<InventoryItem[]> = await axios.get(INVENTORY_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error('Lỗi tải tồn kho.');
  }
};

// GET Serial Parts
export const getSerialParts = async (): Promise<SerialPart[]> => {
  try {
    const response: AxiosResponse<SerialPart[]> = await axios.get(`${PARTS_BASE_URL}/serial`);
    return response.data;
  } catch (error) {
    throw new Error('Lỗi tải serial parts.');
  }
};

// GET Report Stats 
export const getReportStats = async (): Promise<ReportStats> => {
  try {
    const response: AxiosResponse<ReportStats> = await axios.get(`${REPORT_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    throw new Error('Lỗi tải thống kê báo cáo.');
  }
};

// GET Top 5 Parts 
export const getTopParts = async (): Promise<TopPart[]> => {
  try {
    const response: AxiosResponse<TopPart[]> = await axios.get(`${REPORT_BASE_URL}/top-parts`);
    return response.data;
  } catch (error) {
    throw new Error('Lỗi tải top linh kiện.');
  }
};

// GET Detailed Reports
export const getDetailedReports = async (): Promise<ReportResponse[]> => {
  try {
    const response: AxiosResponse<ReportResponse[]> = await axios.get(REPORT_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error('Lỗi tải báo cáo chi tiết.');
  }
};
