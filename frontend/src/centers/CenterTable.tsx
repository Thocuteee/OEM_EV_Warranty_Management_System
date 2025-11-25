// frontend/src/centers/CenterTable.tsx

import React from 'react';
import { ServiceCenterResponse } from '@/types/center';

interface CenterTableProps {
    centers: ServiceCenterResponse[];
    onEdit: (center: ServiceCenterResponse) => void;
    onDelete: (id: number) => void;
    canModify: boolean; 
}

const CenterTable: React.FC<CenterTableProps> = ({ centers, onEdit, onDelete, canModify }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tên Trung tâm</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Vị trí</th>
                {canModify && (
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
                )}
            </tr>
            </thead>
        <tbody className="divide-y divide-gray-200">
            {centers.map((center) => (
                <tr key={center.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{center.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{center.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{center.location}</td>
                
                {canModify && (
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(center)} className="rounded-md border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50">
                        Sửa
                        </button>
                        {/* Chỉ cho phép xóa nếu không phải là ID 1 (tránh phá vỡ logic mặc định) */}
                        {center.id !== 1 && ( 
                            <button onClick={() => onDelete(center.id as number)} className="rounded-md border border-red-100 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50">
                                Xóa
                            </button>
                        )}
                    </div>
                    </td>
                )}
                </tr>
            ))}
            {centers.length === 0 && (
                <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                    Chưa có trung tâm dịch vụ nào được đăng ký.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    );
};

export default CenterTable;