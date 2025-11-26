// frontend/src/parts/InventoryTable.tsx
import React from 'react';
import { InventoryResponse } from '@/types/inventory';

interface InventoryTableProps {
    inventoryRecords: InventoryResponse[];
    onEdit: (record: InventoryResponse) => void;
    onDelete: (id: number) => void;
    canModify: boolean; 
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventoryRecords, onEdit, onDelete, canModify }) => {
    const getAmountClasses = (amount: number) => {
        if (amount < 10) return "text-red-600 font-bold";
        if (amount < 50) return "text-orange-600 font-semibold";
        return "text-green-700";
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-yellow-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Linh kiện (Part No)</th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Trung tâm</th>
                            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700">Tồn kho</th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Ngày Hóa đơn</th>
                            {canModify && <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">Thao tác</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {inventoryRecords.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                                    Không có bản ghi tồn kho nào.
                                </td>
                            </tr>
                        ) : (
                            inventoryRecords.map((r) => (
                                <tr key={r.id} className="hover:bg-yellow-50/50 transition-colors">
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{r.id}</td>
                                    <td className="px-4 py-3 text-sm text-blue-600">
                                        {r.partName || 'N/A'} <span className="text-gray-500">({r.partNumber || 'N/A'})</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{r.centerName || 'N/A'}</td>
                                    <td className={`px-4 py-3 text-sm text-right ${getAmountClasses(r.amount || 0)}`}>
                                        {(r.amount || 0).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                        {r.invoiceDate ? new Date(r.invoiceDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </td>
                                    {canModify && (
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <button 
                                                onClick={() => onEdit(r)} 
                                                className="text-blue-600 hover:text-blue-800 text-xs font-semibold mr-2 p-1 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                onClick={() => onDelete(r.id)} 
                                                className="text-red-600 hover:text-red-800 text-xs font-semibold p-1 hover:bg-red-50 rounded transition-colors"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;