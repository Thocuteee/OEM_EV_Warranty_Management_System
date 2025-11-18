// frontend/src/services/customerService.ts

import { apiClient } from './warrantyApi';
import { CustomerResponse } from '@/types/warranty';

// GET: Lấy tất cả Khách hàng (Cần cho dropdown trong VehicleForm)
export const getAllCustomers = async (): Promise<CustomerResponse[]> => {
    const response = await apiClient.get<CustomerResponse[]>('/customers');
    return response.data;
};

