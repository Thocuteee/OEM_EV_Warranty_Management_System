export type AdminRole = 'Admin' | 'EVM Staff' | 'SC Staff' | 'SC Technician';

export type UserStatus = 'Active' | 'Inactive' | 'Pending';

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  role: AdminRole;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
}

export interface CreateAdminUserPayload {
  username: string;
  password: string;
  fullName: string;
  role: AdminRole;
}