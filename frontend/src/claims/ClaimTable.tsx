// frontend/src/claims/ClaimTable.tsx
import React from 'react';
import { WarrantyClaimResponse } from '@/types/claim';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface ClaimTableProps {
    claims: WarrantyClaimResponse[];
    onSend: (claimId: number) => void; 
    onViewDetail: (claimId: number) => void;
    onDelete: (claimId: number) => void;
    canModify?: boolean; // Thêm prop để kiểm soát quyền sửa/xóa
}

const ClaimTable: React.FC<ClaimTableProps> = ({ claims, onSend, onViewDetail, onDelete, canModify: canModifyProp }) => {
    const { user } = useAuth();
    // Sử dụng prop canModify nếu được truyền, nếu không thì dùng logic cũ
    const canModify = canModifyProp !== undefined ? canModifyProp : (user?.role === 'Admin' || user?.role === 'SC_Staff');
    const isApprover = user?.role === 'Admin' || user?.role === 'EVM_Staff';

    const getStatusClasses = (status: string) => {
        switch (status.toUpperCase().trim()) {
            case "APPROVED":
            case "COMPLETED":
            case "IN_PROGRESS":
            case "IN_PROCESS": // Hỗ trợ cả hai format (cũ và mới)
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            case "DRAFT":
            case "PENDING":
            case "SENT":
            case "WAITING_APPROVAL":
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
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">VIN XE</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Khách hàng</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Chi phí</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Phê duyệt</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {claims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{claim.id}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                                <Link href={`/cars/${claim.vehicleVIN}`} className="hover:underline">{claim.vehicleVIN}</Link>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{claim.customerName}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">{claim.totalCost.toLocaleString('vi-VN')} VND</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(claim.status)}`}>
                                    {claim.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(claim.approvalStatus)}`}>
                                    {claim.approvalStatus}
                                </span>
                            </td>
                            
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onViewDetail(claim.id)} className="text-gray-600 hover:text-gray-800 text-xs font-semibold">Chi tiết</button>
                                    
                                    {/* Nút Gửi (Chỉ hiện khi là DRAFT và là Staff) */}
                                    {canModify && claim.status.trim() === 'DRAFT' && (
                                        <button 
                                            onClick={() => onSend(claim.id)} 
                                            className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold ml-2"
                                        >
                                            Gửi (Send)
                                        </button>
                                    )}

                                    {/* Nút Xóa (Chỉ hiện khi là DRAFT và là Staff) */}
                                    {canModify && claim.status.trim() === 'DRAFT' && (
                                        <button 
                                            onClick={() => onDelete(claim.id)} 
                                            className="text-red-500 hover:text-red-700 text-xs font-semibold ml-2"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {claims.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                                Không tìm thấy yêu cầu bảo hành nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClaimTable;