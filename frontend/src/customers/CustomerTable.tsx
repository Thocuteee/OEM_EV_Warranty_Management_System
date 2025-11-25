import React from 'react';
import { CustomerResponse } from '@/types/customer';

interface CustomerTableProps {
    customers: CustomerResponse[];
    onEdit: (customer: CustomerResponse) => void;
    onDelete: (id: number) => void;
    canModify: boolean; 
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onEdit, onDelete, canModify }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tên Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">SĐT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Địa chỉ</th>
                {canModify && (
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
                )}
            </tr>
            </thead>
        <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{customer.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{customer.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{customer.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{customer.phone}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{customer.address}</td>
                
                {/* Cột thao tác chỉ hiển thị nếu canModify là TRUE */}
                {canModify && (
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(customer)} className="rounded-md border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50">
                        Sửa
                        </button>
                        <button onClick={() => onDelete(customer.id as number)} className="rounded-md border border-red-100 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50">
                        Xóa
                        </button>
                    </div>
                    </td>
                )}
                </tr>
            ))}
            {customers.length === 0 && (
                <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                    Chưa có khách hàng nào được đăng ký.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    );
};

export default CustomerTable;