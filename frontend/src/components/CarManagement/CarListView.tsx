// frontend/src/components/CarManagement/CarListView.tsx

"use client";

import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
// Import types đã tách
import { VehicleResponse } from '@/types/vehicle'; 
// Import service thực tế
import { getAllVehicles } from '@/services/modules/vehicleService'; 
import axios from 'axios';

interface CarFilter {
    vin: string;
    customer: string;
    model?: string;
    year?: string;
}


const CarListView: React.FC = () => {
    // ... (Khai báo StatusBadge, CarFilter giữ nguyên) ...

    // FIX 2: Dùng CarFilter thay vì any
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<CarFilter>({
        vin: '',
        customer: '',
        model: '', // Thêm các trường này để form control hoạt động đúng
        year: ''
    }); 
    
    // FIX 3: THÊM HÀM handleSearchChange (Chức năng bị thiếu)
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Sử dụng Type Assertion an toàn cho key động
        setSearchTerm(prev => ({ 
            ...prev, 
            [name as keyof CarFilter]: value 
        } as CarFilter));
    };

    // ---------------------------------------
    // LOAD DATA THỰC TẾ TỪ BACKEND (Giữ nguyên)
    // ---------------------------------------
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

    // Lọc danh sách xe (Giữ nguyên)
    const filteredVehicles = useMemo(() => {
        const vinKeyword = searchTerm.vin.toLowerCase();
        const customerKeyword = searchTerm.customer.toLowerCase();
    
        return vehicles.filter(car => 
            car.VIN.toLowerCase().includes(vinKeyword) || 
            (car.customerName && car.customerName.toLowerCase().includes(customerKeyword))
        );
    
    }, [vehicles, searchTerm]);
    
    
    if (isLoading) return <div className="p-6 text-center text-gray-500 text-lg">Đang tải dữ liệu xe...</div>;
    if (error) return <div className="p-6 text-center text-red-600 text-lg border border-red-300 rounded-lg">{error}</div>;

    return (
        // ... (Phần JSX đã sửa ở phản hồi trước giữ nguyên)
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


    );
};

export default CarListView;