import React from 'react';
import { WarrantyPolicyResponse } from '@/types/warrantyPolicy';

interface Props {
    policies: WarrantyPolicyResponse[];
    onEdit: (policy: WarrantyPolicyResponse) => void;
    onDelete: (id: number) => void;
}

const WarrantyPolicyTable: React.FC<Props> = ({ policies, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Tên Chính sách</th>
                        <th className="px-6 py-3">Thời hạn</th>
                        <th className="px-6 py-3">Giới hạn KM</th>
                        <th className="px-6 py-3">Mô tả</th>
                        <th className="px-6 py-3">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.map((p) => (
                        <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">{p.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{p.policyName}</td>
                            <td className="px-6 py-4">{p.durationMonths} tháng</td>
                            <td className="px-6 py-4">{p.mileageLimit.toLocaleString()} km</td>
                            <td className="px-6 py-4 truncate max-w-xs">{p.coverageDescription}</td>
                            <td className="px-6 py-4 space-x-2">
                                <button onClick={() => onEdit(p)} className="font-medium text-blue-600 hover:underline">Sửa</button>
                                <button onClick={() => onDelete(p.id)} className="font-medium text-red-600 hover:underline">Xóa</button>
                            </td>
                        </tr>
                    ))}
                    {policies.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-4 text-center">Chưa có dữ liệu</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default WarrantyPolicyTable;