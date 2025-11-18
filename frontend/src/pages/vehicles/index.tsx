"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import Modal from "../../components/common/Modal";
import VehicleForm from "../../components/vehicles/VehicleForm";
import { Plus, Search } from "lucide-react";


export default function VehicleManagementPage() {
  // Mock data
const mockVehicles = [
  {
    id: 1,
    vin: "1HGBH41JXMN109186",
    model: "Honda Civic",
    licensePlate: "51A-12345",
    year: 2020,
    owner: "Nguyễn Văn A",
    status: "ACTIVE",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    vin: "2HGFC2F59FH542321",
    model: "Toyota Camry",
    licensePlate: "30B-67890",
    year: 2021,
    owner: "Trần Thị B",
    status: "ACTIVE",
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    vin: "3FADP4EJ5DM123456",
    model: "Ford Focus",
    licensePlate: "29C-54321",
    year: 2019,
    owner: "Lê Văn C",
    status: "MAINTENANCE",
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    vin: "5YJSA1E26FF123789",
    model: "Tesla Model S",
    licensePlate: "51F-98765",
    year: 2022,
    owner: "Phạm Thị D",
    status: "ACTIVE",
    createdAt: "2024-04-05",
  },
  {
    id: 5,
    vin: "JM1BK32F781234567",
    model: "Mazda 3",
    licensePlate: "50H-11111",
    year: 2018,
    owner: "Hoàng Văn E",
    status: "INACTIVE",
    createdAt: "2024-05-12",
  },
];
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vin.toLowerCase().includes(searchText.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchText.toLowerCase()) ||
    vehicle.owner.toLowerCase().includes(searchText.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddVehicle = (vehicleData) => {
    const newVehicle = {
      id: vehicles.length + 1,
      ...vehicleData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVehicles([...vehicles, newVehicle]);
    setIsModalOpen(false);
  };

  const handleUpdateVehicle = (updatedData) => {
    const updatedVehicles = vehicles.map(v =>
      v.id === currentVehicle.id
        ? { ...v, ...updatedData }
        : v
    );
    setVehicles(updatedVehicles);
    setIsModalOpen(false);
    setCurrentVehicle(null);
    setIsViewMode(false);
  };

  const handleViewEdit = (vehicle) => {
    setCurrentVehicle(vehicle);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentVehicle(null);
    setIsViewMode(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { text: "Hoạt động", class: "bg-green-100 text-green-800" },
      INACTIVE: { text: "Không hoạt động", class: "bg-red-100 text-red-800" },
      MAINTENANCE: { text: "Bảo trì", class: "bg-yellow-100 text-yellow-800" },
    };
    
    const config = statusConfig[status] || statusConfig.ACTIVE;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.class}`}>
        {config.text}
      </span>
    );
  };

  return (
    <Layout>
       <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Control Panel */}
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-2">
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm VIN / Mẫu xe / Chủ sở hữu / Biển số..."
              className="border rounded px-4 py-2 w-80 focus:outline-none focus:border-blue-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => {
              setCurrentVehicle(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={20} /> Thêm mới
          </button>
        </div>

        {/* Vehicle List */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4">Quản lý Xe</h1>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm">
                  <th className="px-6 py-3 text-left">VIN</th>
                  <th className="px-6 py-3 text-left">Mẫu xe</th>
                  <th className="px-6 py-3 text-left">Năm</th>
                  <th className="px-6 py-3 text-left">Chủ sở hữu</th>
                  <th className="px-6 py-3 text-left">Trạng thái</th>
                  <th className="px-6 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono">{vehicle.vin}</td>
                    <td className="px-6 py-4 text-sm">{vehicle.model}</td>
                    <td className="px-6 py-4 text-sm">{vehicle.year}</td>
                    <td className="px-6 py-4 text-sm">{vehicle.owner}</td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(vehicle.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => handleViewEdit(vehicle)}
                      >
                        Xem/Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy xe nào
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h2 className="text-xl font-bold mb-4">
            {currentVehicle ? "Xem/Sửa thông tin Xe" : "Thêm Xe mới"}
          </h2>
          <VehicleForm
            vehicle={currentVehicle}
            onSubmit={currentVehicle ? handleUpdateVehicle : handleAddVehicle}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </div>
    </Layout>
  );
}