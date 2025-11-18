// frontend/src/vehicles/VehicleTable.tsx

import React from 'react';
import { VehicleResponse } from '@/types/warranty';

interface VehicleTableProps {
  vehicles: VehicleResponse[];
  onEdit: (vehicle: VehicleResponse) => void;
  onDelete: (id: number) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">VIN Xe</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Model</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Năm SX</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Chủ sở hữu</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{vehicle.id}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.VIN}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{vehicle.model}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{vehicle.year}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{vehicle.customerName || 'N/A'}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(vehicle)} className="rounded-md border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50">Sửa</button>
                  <button onClick={() => onDelete(vehicle.id as number)} className="rounded-md border border-red-100 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50">Xóa</button>
                </div>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                Chưa có dữ liệu xe nào được đăng ký.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;