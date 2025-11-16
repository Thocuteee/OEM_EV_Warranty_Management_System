// Định nghĩa TypeScript cho DTOs (PHẦN VẬT LÝ I trong FE)
// Định nghĩa type/interface cho WarrantyClaim, LoginResponse

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
export interface RegisterRequest { 
    fullName: string; 
    username: string; 
    password: string; 
}
export interface RegisterResponse {
  message?: string; 
}

// Types cho Parts & Inventory
export interface Part {
  id: number;
  partName: string;
  description: string;
  price: number;
  quantity: number;
  serialNumber?: string; // Optional cho serial parts
}

export interface InventoryItem {
  id: number;
  partId: number;
  partName: string;
  stockQuantity: number;
  location: string;
  lastUpdated: string;
}

export interface SerialPart {
  id: number;
  serialNumber: string;
  partName: string;
  assignedTo: string; // e.g., VIN or Claim ID
  status: 'Available' | 'Assigned' | 'Used';
}

export interface ReportResponse {
  id: number;
  claimId: number;
  status: 'COMPLETED' | 'IN REVIEW';
  reportDate: string;
  technicianName: string;
  partCost: number;
  actualCost: number;
  totalCalculatedCost: number;
  actionToken: string;
}

// Types cho Report Dashboard (ảnh 3)
export interface ReportStats {
  totalClaims: number;
  completedClaims: number;
  inReview: number;
  totalCost: number;
}

export interface TopPart {
  partName: string;
  usageCount: number;
  cost: number;
}