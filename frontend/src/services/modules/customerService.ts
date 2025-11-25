import { apiClient } from '../coreApiClient';
import { CustomerRequest, CustomerResponse } from '@/types/customer';

// 1. GET: Lấy tất cả Khách hàng (Read)
export const getAllCustomers = async (): Promise<CustomerResponse[]> => {
    const response = await apiClient.get<CustomerResponse[]>('/customers');
    return response.data;
};

// 2. POST: Tạo Khách hàng mới (Create)
export const createCustomer = async (customerData: CustomerRequest): Promise<CustomerResponse> => {
    const response = await apiClient.post<CustomerResponse>('/customers', customerData);
    return response.data;
};

// 3. PUT: Cập nhật Khách hàng (Update)
export const updateCustomer = async (id: number, customerData: CustomerRequest): Promise<CustomerResponse> => {
    const response = await apiClient.put<CustomerResponse>(`/customers/${id}`, customerData);
    return response.data;
};

// 4. DELETE: Xóa Khách hàng (Delete)
export const deleteCustomer = async (id: number): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
};

