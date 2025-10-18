// Các interface đã có trước đó...

// Interface cho Thông tin Người dùng (User Profile)
export interface UserProfile {
  id: number;
  username: string;
  name: string; // Tên hiển thị đầy đủ
  role: 'SC Staff' | 'SC Technician' | 'EVM Staff' | 'Admin' | 'Customer';
  token: string;
}

// Interface cho Auth Context Type
export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
}

// Interface cho Dữ liệu Bảng
export interface WarrantyClaimData {
  id: number;
  vin: string;
  model: string;
  customer: string;
  status: 'Đang chờ duyệt' | 'Đã duyệt' | 'Đã hoàn thành' | 'Đang xử lý';
}

// Interface cho Dữ liệu Thẻ
export interface OtherSectionItem {
  title: string;
  description: string;
}