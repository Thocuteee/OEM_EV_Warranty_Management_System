import axios, { AxiosResponse } from 'axios';
import {
  LoginRequest, LoginResponse,
  UserRequest, UserResponse,
  RecallCampaignRequest, RecallCampaignResponse,
  ClaimApprovalResponse
} from "@/types/warranty";

const API_BASE_URL = 'http://localhost:8080/api';
const USE_MOCK_DATA = true; // THÊM DÒNG NÀY

// THÊM MOCK DATA Ở ĐÂY
const MOCK_USERS: UserResponse[] = [
  {
    id: 1,
    username: 'admin',
    role: 'Admin',
    fullName: 'Quản trị viên Hệ thống',
    status: 'Active',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15'
  },
  {
    id: 2,
    username: 'evm_staff',
    role: 'EVM_Staff',
    fullName: 'Nhân viên EVM',
    status: 'Active',
    createdAt: '2024-01-02',
    lastLogin: '2024-01-14'
  },
  {
    id: 3,
    username: 'sc_staff',
    role: 'SC_Staff',
    fullName: 'Nhân viên Trung tâm',
    status: 'Active',
    createdAt: '2024-01-03',
    lastLogin: '2024-01-13'
  },
  {
    id: 4,
    username: 'technician',
    role: 'SC_Technician',
    fullName: 'Kỹ thuật viên',
    status: 'Active',
    createdAt: '2024-01-04',
    lastLogin: '2024-01-12'
  }
];

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Auth API ---
export const loginUser = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  // SỬ DỤNG MOCK DATA
  if (USE_MOCK_DATA) {
    console.log('🔧 Đang sử dụng mock data để login...');
    
    // Giả lập delay call API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Tìm user trong mock data
    const foundUser = MOCK_USERS.find(u => 
      u.username === loginRequest.username
    );
    
    // Cho phép đăng nhập với bất kỳ password nào
    if (foundUser) {
      console.log('✅ Login thành công với user:', foundUser.username);
      return {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        token: `mock-jwt-token-${foundUser.username}-${Date.now()}`
      };
    } else {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử: admin, evm_staff, sc_staff, technician');
    }
  }

  // Kết nối với backend thật (nếu có)
  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${API_BASE_URL}/auth/login`,
      loginRequest
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const backendError = error.response.data as { message?: string };
      throw new Error(backendError.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
    }
    throw new Error('Không thể kết nối đến máy chủ.');
  }
};

// --- User API (admin/users) ---
export const getUsers = async (): Promise<UserResponse[]> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_USERS;
  }
  
  const response = await apiClient.get<UserResponse[]>('/users');
  return response.data;
};

export const createUser = async (userData: UserRequest): Promise<UserResponse> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: UserResponse = {
      id: Date.now(),
      username: userData.username,
      role: userData.role,
      fullName: userData.username,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: undefined
    };
    MOCK_USERS.push(newUser);
    return newUser;
  }
  
  const response = await apiClient.post<UserResponse>('/users', userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index > -1) {
      MOCK_USERS.splice(index, 1);
    }
    return;
  }
  
  await apiClient.delete(`/users/${id}`);
};

export const getCampaigns = async (): Promise<RecallCampaignResponse[]> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        title: 'Chiến dịch thu hồi pin EV 2024',
        startDate: '2024-01-01',
        campaignStatus: 'ONGOING'
      },
      {
        id: 2,
        title: 'Kiểm tra hệ thống phanh',
        startDate: '2024-02-01',
        endDate: '2024-02-28',
        campaignStatus: 'FINISHED'
      }
    ];
  }
  
  const response = await apiClient.get<RecallCampaignResponse[]>('/campaigns');
  return response.data;
};

export const createCampaign = async (campaignData: RecallCampaignRequest): Promise<RecallCampaignResponse> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCampaign: RecallCampaignResponse = {
      id: Date.now(),
      title: campaignData.title,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      campaignStatus: 'ONGOING'
    };
    return newCampaign;
  }
  
  const response = await apiClient.post<RecallCampaignResponse>('/campaigns', campaignData);
  return response.data;
};

export const getPendingClaims = async (): Promise<ClaimApprovalResponse[]> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        vehicleId: 101,
        vehicleVIN: 'VIN123456789',
        customerId: 201,
        customerName: 'Nguyễn Văn A',
        centerId: 301,
        technicianId: 401,
        status: 'SENT',
        approvalStatus: 'PENDING',
        totalCost: 2500000,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        description: 'Thay thế pin chính'
      },
      {
        id: 2,
        vehicleId: 102,
        vehicleVIN: 'VIN987654321',
        customerId: 202,
        customerName: 'Trần Thị B',
        centerId: 302,
        technicianId: 402,
        status: 'SENT',
        approvalStatus: 'PENDING',
        totalCost: 1800000,
        createdAt: '2024-01-16T14:20:00Z',
        updatedAt: '2024-01-16T14:20:00Z',
        description: 'Bảo dưỡng định kỳ'
      }
    ];
  }
  
  try {
    const response = await apiClient.get<ClaimApprovalResponse[]>('/claims/search', {
      params: { approvalStatus: 'PENDING' }
    });
    return response.data.filter(claim => claim.status === 'SENT');
  } catch (error) {
    console.error("Lỗi khi lấy danh sách claim chờ duyệt:", error);
    throw new Error('Không thể tải danh sách claim.');
  }
};

export const updateClaimApprovalStatus = async (
  claimId: number,
  newStatus: 'APPROVED' | 'REJECTED'
): Promise<ClaimApprovalResponse> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockClaim: ClaimApprovalResponse = {
      id: claimId,
      vehicleId: 101,
      vehicleVIN: 'VIN123456789',
      customerId: 201,
      customerName: 'Nguyễn Văn A',
      centerId: 301,
      technicianId: 401,
      status: newStatus === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      approvalStatus: newStatus,
      totalCost: 2500000,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: new Date().toISOString(),
      description: 'Thay thế pin chính'
    };
    return mockClaim;
  }
  
  try {
    const response = await apiClient.put<ClaimApprovalResponse>(
      `/claims/${claimId}/status`,
      { status: newStatus }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi ${newStatus} claim ${claimId}:`, error);
    throw new Error('Không thể cập nhật trạng thái claim.');
  }
};


// Hàm gọi API tạo User
export const createNewUser = async (userData: CreateUserRequest): Promise<UserResponse> => {
  try {
    const response: AxiosResponse<UserResponse> = await axios.post(`${BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const backendError = error.response.data as { message?: string };
      throw new Error(backendError.message || 'Tạo tài khoản thất bại.');
    }
    throw new Error('Không thể kết nối đến máy chủ.');
  }
};


