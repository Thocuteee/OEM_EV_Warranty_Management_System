// frontend/src/vehicles/VehicleTable.tsx

import React from 'react';
import { VehicleResponse } from '@/types/vehicle';
import { useAuth } from '@/context/AuthContext'; 
import { updateVehicleRegistrationStatus } from '@/services/modules/vehicleService'; 

interface VehicleTableProps {
    vehicles: VehicleResponse[];
    onEdit: (vehicle: VehicleResponse) => void;
    onDelete: (id: number) => void;
    onRefresh: () => void; // Thêm prop này để load lại data sau khi duyệt
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onEdit, onDelete, onRefresh }) => {
    const { user } = useAuth();
    const isApprover = user?.role === "Admin" || user?.role === "EVM_Staff";

    const handleUpdateStatus = async (vehicleId: number, newStatus: 'APPROVED' | 'REJECTED') => {
        if (!user || !user.id) return;
        if (!confirm(`Bạn có chắc muốn ${newStatus === 'APPROVED' ? 'PHÊ DUYỆT' : 'TỪ CHỐI'} đăng ký xe VIN ${vehicles.find(v => v.id === vehicleId)?.vin}?`)) return;

        try {
            await updateVehicleRegistrationStatus(vehicleId, newStatus, user.id);
            onRefresh(); // Load lại dữ liệu để cập nhật trạng thái
        } catch (error) {
            alert(`Lỗi khi cập nhật trạng thái: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
        }
    };
    
    const getStatusClasses = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">VIN Xe</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Model</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Chủ sở hữu</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Người đăng ký</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                {/* ... (Các cột khác) */}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{vehicle.registeredByUsername || 'N/A'}</td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(vehicle.registrationStatus)}`}>
                        {vehicle.registrationStatus}
                    </span>
                </td>
                
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                        {/* Nút Sửa */}
                        {(isApprover || vehicle.registrationStatus === 'PENDING') && ( 
                            <button onClick={() => onEdit(vehicle)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold">Sửa</button>
                        )}
                        
                        {/* Nút Duyệt/Từ chối chỉ hiển thị cho Approver và khi status là PENDING */}
                        {isApprover && vehicle.registrationStatus === 'PENDING' && (
                            <>
                                <button 
                                    onClick={() => handleUpdateStatus(vehicle.id, 'APPROVED')} 
                                    className="text-green-600 hover:text-green-800 text-xs font-semibold"
                                >
                                    Duyệt
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(vehicle.id, 'REJECTED')} 
                                    className="text-red-600 hover:text-red-800 text-xs font-semibold"
                                >
                                    Từ chối
                                </button>
                            </>
                        )}

                        {/* Nút Xóa */}
                        {isApprover && vehicle.registrationStatus !== 'APPROVED' && (
                            <button onClick={() => onDelete(vehicle.id as number)} className="text-gray-500 hover:text-red-600 text-xs font-semibold">
                                Xóa
                            </button>
                        )}
                    </div>
                </td>
                </tr>
            ))}
            {/* ... (empty state) */}
            </tbody>
        </table>
        </div>
    );
};

export default VehicleTable;