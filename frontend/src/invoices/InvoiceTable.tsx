// frontend/src/invoices/InvoiceTable.tsx
"use client";

import React from 'react';
import { InvoiceResponse } from '@/types/invoice'; 

interface InvoiceTableProps {
    invoices: InvoiceResponse[];
    onEdit: (invoice: InvoiceResponse) => void;
    onDelete: (id: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onEdit, onDelete }) => {
    
    const getStatusClasses = (status: string) => {
        switch (status.toUpperCase()) {
            case "PAID":
            case "REIMBURSED":
                return "bg-green-100 text-green-800";
            case "OVERDUE":
                return "bg-red-100 text-red-800";
            case "PENDING":
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };
    
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Claim ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Part Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Trung tâm</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">SL</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Vị trí</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Thanh toán</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {invoices.map((i) => (
                        <tr key={i.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{i.id}</td>
                            <td className="px-4 py-3 text-sm text-blue-600">{i.claimId}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{i.partName}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{i.centerName}</td>
                            <td className="px-4 py-3 text-sm font-medium text-right text-gray-700">{i.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{i.locationType}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(i.paymentsStatus)}`}>
                                    {i.paymentsStatus}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                                <button onClick={() => onEdit(i)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold mr-2 p-1">Sửa</button>
                                <button onClick={() => onDelete(i.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold p-1">Xóa</button>
                            </td>
                        </tr>
                    ))}
                    {invoices.length === 0 && (
                        <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">Không tìm thấy Hóa đơn nào.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceTable;