import { apiClient } from "../coreApiClient";
import { InvoiceRequest, InvoiceResponse } from "@/types/invoice"; 

// 1. GET: Lấy tất cả Invoices
export const getAllInvoices = async (): Promise<InvoiceResponse[]> => {
    const response = await apiClient.get<InvoiceResponse[]>("/invoices");
    return response.data;
};

// 2. POST: Tạo Invoice mới
export const createInvoice = async (invoiceData: InvoiceRequest): Promise<InvoiceResponse> => {
    const response = await apiClient.post<InvoiceResponse>("/invoices", invoiceData);
    return response.data;
};

// 3. PUT: Cập nhật Invoice
export const updateInvoice = async (id: number, invoiceData: InvoiceRequest): Promise<InvoiceResponse> => {
    const response = await apiClient.put<InvoiceResponse>(`/invoices/${id}`, invoiceData);
    return response.data;
};

// 4. DELETE: Xóa Invoice
export const deleteInvoice = async (id: number): Promise<void> => {
    await apiClient.delete(`/invoices/${id}`);
};