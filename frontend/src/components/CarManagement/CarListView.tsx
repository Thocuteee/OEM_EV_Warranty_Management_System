// src/components/CarManagement/CarListView.tsx
"use client";

import React, { useState, useMemo, ChangeEvent } from 'react';
import Link from 'next/link';
// Import từ thư mục cha
import { mockCars } from '../../data/mockCars'; 
import { Car, CarFilter } from '../../types';
import { useCars } from '../../context/CarContext';

const CarListView: React.FC = () => {
    // State cho bộ lọc
    const { cars: data } = useCars();
    const [searchTerm, setSearchTerm] = useState<CarFilter>({
        vin: '',
        model: '',
        customer: '',
        year: ''
    });
    // Giả định dữ liệu tĩnh
    

    // Xử lý thay đổi input trong Control Panel
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearchTerm(prev => ({ ...prev, [name as keyof CarFilter]: value } as CarFilter));
    };

    // Lọc danh sách xe (Sử dụng useMemo để tối ưu)
    const filteredCars = useMemo(() => {
       return data.filter(car => 
            // Logic lọc sử dụng 'data'
            car.vin.toLowerCase().includes(searchTerm.vin.toLowerCase()) || 
            car.customerName.toLowerCase().includes(searchTerm.customer.toLowerCase())
        );
      
    }, [data, searchTerm]);

    // Component để hiển thị trạng thái
    const StatusBadge: React.FC<{ status: Car['status'] }> = ({ status }) => {
        let colorClass = '';
        switch (status) {
            case 'Trong bảo hành':
                colorClass = 'bg-green-100 text-green-800';
                break;
            case 'Đang hoạt động':
                colorClass = 'bg-blue-100 text-blue-800';
                break;
            case 'Ngừng hoạt động':
                colorClass = 'bg-red-100 text-red-800';
                break;
            default:
                colorClass = 'bg-gray-100 text-gray-800';
        }
        return (
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                {status}
            </span>
        );
    };

    return (
        <>
            {/* 1. Bảng điều khiển (Control Panel) */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Bộ Lọc & Tìm kiếm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <input
                        type="text"
                        name="vin"
                        placeholder="VIN XE..."
                        value={searchTerm.vin}
                        onChange={handleSearchChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        name="model"
                        placeholder="Model..."
                        value={searchTerm.model}
                        onChange={handleSearchChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        name="customer"
                        placeholder="Khách hàng..."
                        value={searchTerm.customer}
                        onChange={handleSearchChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                     <select
                        name="year"
                        value={searchTerm.year}
                        onChange={handleSearchChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">-- Năm --</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>

                    {/* Nút "Thêm Xe Mới" */}
                    <Link href="/cars/new">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300">
                            + Thêm Xe Mới
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
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">KHÁCH HÀNG</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NGÀY ĐK</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TRẠNG THÁI</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredCars.length > 0 ? (
                            filteredCars.map((car) => (
                                <tr key={car.vin} className="hover:bg-indigo-50/50 transition duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        <Link href={`/cars/${car.vin}`} className="hover:text-blue-800">
                                            {car.vin}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.model}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.registrationDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={car.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <Link href={`/cars/${car.vin}`}>
                                            <button className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm">
                                                Xem/Sửa
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-500 text-lg">
                                    Không tìm thấy xe nào phù hợp với bộ lọc.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-600">
                Hiển thị {filteredCars.length} kết quả.
            </div>
        </>
    );
};

export default CarListView;