// // Định nghĩa TypeScript cho DTOs (PHẦN VẬT LÝ I trong FE)
// // Định nghĩa type/interface cho WarrantyClaim, LoginResponse

// // Các interface đã có trước đó...

// // Interface cho Thông tin Người dùng (User Profile)
// export interface UserProfile {
//     id: number;
//     username: string;
//     name: string; // Tên hiển thị đầy đủ
//     role: 'SC Staff' | 'SC Technician' | 'EVM Staff' | 'Admin' | 'Customer';
//     token: string;
// }

// // Interface cho Auth Context Type
// export interface AuthContextType {
//     user: UserProfile | null;
//     isAuthenticated: boolean;
//     login: (userData: UserProfile) => void;
//     logout: () => void;
// }

// // Interface cho Dữ liệu Bảng
// export interface WarrantyClaimData {
//     id: number;
//     vin: string;
//     model: string;
//     customer: string;
//     status: 'Đang chờ duyệt' | 'Đã duyệt' | 'Đã hoàn thành' | 'Đang xử lý';
// }

// // Interface cho Dữ liệu Thẻ
// export interface OtherSectionItem {
//     title: string;
//     description: string;
// }
// Định nghĩa TypeScript cho DTOs (PHẦN VẬT LÝ I trong FE)
// Định nghĩa type/interface cho WarrantyClaim, LoginResponse

// --- CÁC KIỂU (INTERFACE) CŨ CỦA BẠN ---
export interface UserProfile {
    id: number;
    username: string;
    name: string; // Tên hiển thị đầy đủ
    
    // SỬA LỖI: Đồng bộ Role ở đây với UserRole bên dưới
    role: UserRole; 
    
    token: string;
}

export interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (userData: UserProfile) => void;
    logout: () => void;
}

export interface WarrantyClaimData {
    id: number;
    vin: string;
    model: string;
    customer: string;
    status: 'Đang chờ duyệt' | 'Đã duyệt' | 'Đã hoàn thành' | 'Đang xử lý';
}

export interface OtherSectionItem {
    title: string;
    description: string;
}

// --- CÁC KIỂU (TYPE) MỚI CẦN THÊM VÀO ---
// (Đây là phần bị thiếu gây ra lỗi)

// 1. Định nghĩa Role khớp với Backend (Admin, EVM_Staff, SC_Staff, SC_Technician)
export type UserRole = "SC_Staff" | "SC_Technician" | "EVM_Staff" | "Admin";

// 2. DTO cho User Response (từ UserController.GET)
export interface UserResponse {
  id: number;
  username: string;
  role: UserRole;
}

// 3. DTO cho User Request (cho UserController.POST/PUT)
export interface UserRequest {
  id?: number; // Tùy chọn, vì khi tạo mới sẽ không có
  username: string;
  password?: string; // Tùy chọn, vì khi cập nhật có thể không đổi
  role: UserRole;
}