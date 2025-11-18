    export type UserRole = 'SC_Staff' | 'SC_Technician' | 'EVM_Staff' | 'Admin' | 'Customer';

    export interface LoginRequest {
    username: string;
    password: string;
    }

    export interface LoginResponse {
    id: number;
    username: string;
    role: UserRole;
    token: string;
    }

    export interface UserProfile {
    id: number;
    username: string;
    name: string;
    role: UserRole;
    token: string;
    }

    export interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (userData: UserProfile) => void;
    logout: () => void;
    }

    export interface RegisterRequest {
    fullName: string;
    username: string;
    password: string;
    }

    export interface RegisterResponse {
    message?: string;
    }

    export interface UserRequest {
    id?: number;
    username: string;
    password?: string;
    role: UserRole;
    }

    export interface UserResponse {
    id: number;
    username: string;
    role: UserRole;
    fullName?: string;
    status?: 'Active' | 'Inactive' | 'Pending';
    createdAt?: string;
    lastLogin?: string;
    }

    export type AdminUser = UserResponse;

    export interface RecallCampaignRequest {
    id?: number;
    title: string;
    startDate: string;
    endDate?: string;
    }

    export interface RecallCampaignResponse {
    id: number;
    title: string;
    startDate: string;
    endDate?: string;
    campaignStatus: string;
    }

    export interface ClaimApprovalResponse {
    id: number;
    vehicleId: number;
    vehicleVIN: string;
    customerId: number;
    customerName: string;
    centerId: number;
    technicianId: number;
    status: string;
    approvalStatus: string;
    totalCost: number;
    createdAt: string;
    updatedAt: string;
    description: string
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

// Types cho Report Dashboard 
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

