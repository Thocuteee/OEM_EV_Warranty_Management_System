import axios, { AxiosResponse } from 'axios';

import { 
  LoginRequest, 
  LoginResponse, 
  RecallCampaignRequest, 
  RecallCampaignResponse, 
  ClaimApprovalResponse, 
  UserResponse, 
  UserRole,
  RegisterResponse, 
  UserRequest, // UserRequest và RegisterResponse cần cho chức năng đăng ký
  RegisterRequest // Cần import RegisterRequest nếu hàm registerUser dùng nó
} from '@/types/warranty';

import { CreateUserPayload } from '@/types/admin';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
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

export const registerUser = async (registerRequest: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const payload: UserRequest = {
      username : registerRequest.username,
      password : registerRequest.password,
      role: "SC_Staff" as UserRole

    };
    const response: AxiosResponse<RegisterResponse> = await apiClient.post(`${BASE_URL}/auth/register`, payload);
    return response.data;
  } catch(error) {
    if(axios.isAxiosError(error) && error.response) {
      const backendError = error.response.data as {message?: string};
      throw new Error(backendError.message || 'Lỗi đăng ký người dùng.');
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
export const createNewUser = async (userData: CreateUserPayload): Promise<UserResponse[]> => {
  const response = await apiClient.post<UserResponse[]>('/users', userData);
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

