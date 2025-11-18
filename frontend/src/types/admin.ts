import { UserRequest } from '@/types/user';


export type UserRoleBackend = 'ADMIN' | 'EVM_STAFF' | 'SC_STAFF' | 'SC_TECHNICIAN';

export type UserStatus = 'Active' | 'Inactive' ;

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  role: UserRoleBackend;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  //fullName: string;
  role: UserRoleBackend;
}

export interface FullUserCreationRequest extends UserRequest {
    name?: string;
    phone?: string;
    email?: string;
    centerId?: number; 
    specialization?: string; 
}