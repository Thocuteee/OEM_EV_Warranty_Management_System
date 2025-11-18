// frontend/src/components/CarManagement/CarListView.tsx

"use client";

import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';

import { VehicleResponse } from '@/types/vehicle'; 

import { getAllVehicles } from '@/services/modules/vehicleService'; 
import axios from 'axios';


interface CarFilter {
    vin: string;
    customer: string;
    model?: string;
    year?: string;
}

const CarListView: React.FC = () => {
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [searchTerm, setSearchTerm] = useState<CarFilter>({
        vin: '',
        customer: '',
        model: '', 
        year: ''
    } as CarFilter); 
    
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setSearchTerm(prev => ({ 
            ...prev, 
            [name as keyof CarFilter]: value 
        } as CarFilter));
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getAllVehicles(); 
                setVehicles(data);
            } catch (err) {
                console.error("Lỗi tải danh sách xe:", err);
                let errorMessage = "Không thể tải dữ liệu xe từ máy chủ.";
                if (axios.isAxiosError(err) && err.response && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []); 

    // Lọc danh sách xe
    const filteredVehicles = useMemo(() => {
        const vinKeyword = searchTerm.vin.toLowerCase();
        const customerKeyword = searchTerm.customer.toLowerCase();
    
        return vehicles.filter(car => 
            // Lọc theo VIN, Model (Thêm cả Model vào lọc)
            car.VIN.toLowerCase().includes(vinKeyword) || 
            (car.model && car.model.toLowerCase().includes(searchTerm.model?.toLowerCase() || '')) ||
            (car.customerName && car.customerName.toLowerCase().includes(customerKeyword))
        );
    
    }, [vehicles, searchTerm]);
    
    
    if (isLoading) return <div className="p-6 text-center text-gray-500 text-lg">Đang tải dữ liệu xe...</div>;
    if (error) return <div className="p-6 text-center text-red-600 text-lg border border-red-300 rounded-lg">{error}</div>;

    return (
        <>
            {/* 1. Bảng điều khiển (Control Panel) */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Bộ Lọc & Tìm kiếm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    
                    {/* INPUT VIN */}
                    <input
                        type="text"
                        name="vin"
                        placeholder="VIN XE..."
                        value={searchTerm.vin}
                        onChange={handleSearchChange} // Dùng hàm đã định nghĩa
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    {/* INPUT KHÁCH HÀNG */}
                    <input
                        type="text"
                        name="customer"
                        placeholder="Khách hàng..."
                        value={searchTerm.customer}
                        onChange={handleSearchChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    {/* Nút THÊM XE MỚI (Chuyển hướng đến Admin Panel) */}
                    <Link href="/admin/vehicles">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300">
                            Quản lý & Đăng ký Xe (Admin)
                        </button>
                    </Link>
                </div>
            </div>

            {/* 2. Bảng danh sách xe (Vehicle List) */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">VIN XE</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">MODEL</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NĂM</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CHỦ SỞ HỮU</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredVehicles.length > 0 ? (
                            filteredVehicles.map((car) => (
                                <tr key={car.VIN} className="hover:bg-indigo-50/50 transition duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        <Link href={`/cars/${car.VIN}`} className="hover:text-blue-800">
                                            {car.VIN}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.model}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.customerName}</td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        {/* Nút hành động chính cho SC Staff/Tech */}
                                        <Link href={`/claims/new?vin=${car.VIN}`}>
                                            <button className="text-green-600 hover:text-green-800 font-semibold text-sm">
                                                Tạo Yêu cầu Bảo hành
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-lg">
                                    Không tìm thấy xe nào phù hợp với bộ lọc.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CarListView;