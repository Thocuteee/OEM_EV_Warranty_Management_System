// frontend/src/campaigns/RecallCampaignTable.tsx
"use client";

import React from 'react';
import { RecallCampaignResponse } from '@/types/campaign'; 

interface RecallCampaignTableProps {
    campaigns: RecallCampaignResponse[];
    onEdit: (campaign: RecallCampaignResponse) => void;
    onDelete: (id: number) => void;
}

const RecallCampaignTable: React.FC<RecallCampaignTableProps> = ({ campaigns, onEdit, onDelete }) => {
    
    const getStatusClasses = (status: string) => {
        switch (status.toUpperCase()) {
            case "ONGOING":
                return "bg-green-100 text-green-800";
            case "FINISHED":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };
    
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Tiêu đề</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Ngày Bắt đầu</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Ngày Kết thúc</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {campaigns.map((c) => (
                        <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{c.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{c.title}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{c.startDate}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{c.endDate || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(c.campaignStatus)}`}>
                                    {c.campaignStatus}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                                <button onClick={() => onEdit(c)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold mr-2 p-1">Sửa</button>
                                <button onClick={() => onDelete(c.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold p-1">Xóa</button>
                            </td>
                        </tr>
                    ))}
                    {campaigns.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">Không tìm thấy Chiến dịch nào.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RecallCampaignTable;