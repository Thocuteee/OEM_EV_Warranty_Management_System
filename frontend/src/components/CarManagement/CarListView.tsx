// frontend/src/components/CarManagement/CarListView.tsx

"use client";

import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
// Import types đã tách
import { VehicleResponse, VehicleRequest } from '@/types/vehicle'; 
// Import service thực tế
import { getAllVehicles, createVehicle } from '@/services/modules/vehicleService'; 
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import VehicleForm from '@/vehicles/VehicleForm';

// FIX 1: Định nghĩa CarFilter (hoặc import từ types/index nếu có)
interface CarFilter {
    vin: string;
    customer: string;
}

const CarListView: React.FC = () => {
    // 💡 SỬ DỤNG STATE THỰC TẾ
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    
    // Modal state
    const [isModalOpen, setModalOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);
    
    // FIX 2: Dùng CarFilter thay vì any
    const [searchTerm, setSearchTerm] = useState<CarFilter>({
        vin: '',
        customer: '',
    }); 

    // FIX 3: THÊM HÀM handleSearchChange BỊ THIẾU
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Cập nhật state tìm kiếm động (FIX LỖI 'any' trong hàm)
        setSearchTerm(prev => ({ 
            ...prev, 
            [name as keyof CarFilter]: value 
        } as CarFilter));
    };


    // ---------------------------------------
    // LOAD DATA THỰC TẾ TỪ BACKEND
    // ---------------------------------------
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // SỬ DỤNG SERVICE ĐÃ HOÀN THIỆN
                const data = await getAllVehicles(); 
                setVehicles(data);
            } catch (err) {
                console.error("Lỗi tải danh sách xe:", err);
                // Xử lý lỗi API để hiển thị thông báo
                let errorMessage = "Không thể tải dữ liệu xe từ máy chủ.";
                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (axios.isAxiosError(err)) {
                    if (!err.response) {
                        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend có đang chạy không.";
                    } else if (err.response.data?.message) {
                        errorMessage = err.response.data.message;
                    } else {
                        errorMessage = err.message || errorMessage;
                    }
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
    
        return vehicles.filter(car => {
            if (!car) return false; 

            const vinMatches = car.vin?.toLowerCase().includes(vinKeyword);
            const customerMatches = car.customerName?.toLowerCase().includes(customerKeyword);

            return vinMatches || customerMatches;
        });
    
    }, [vehicles, searchTerm]);
    
    
    if (isLoading) return <div className="p-6 text-center text-gray-500 text-lg">Đang tải dữ liệu xe...</div>;
    if (error) return (
        <div className="p-6 text-center text-red-600 bg-red-100 border border-red-300 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Lỗi tải dữ liệu</h2>
            <p className="mb-4">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Thử lại
            </button>
        </div>
    );

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
                    
                    {/* Nút THÊM XE MỚI (Mở Modal) */}
                    <button 
                        onClick={() => setModalOpen(true)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Đăng ký Xe
                    </button>
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
                                <tr key={car.vin} className="hover:bg-indigo-50/50 transition duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        <Link href={`/cars/${car.vin}`} className="hover:text-blue-800">
                                            {car.vin}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.model}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.customerName}</td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        {/* Nút hành động chính cho SC Staff/Tech */}
                                        <Link href={`/claims/new?vin=${car.vin}`}>
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

            {/* Modal Đăng ký Xe */}
            {isModalOpen && user && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký Xe mới</h2>
                            <p className="text-gray-600 text-sm">Điền thông tin để đăng ký xe điện mới vào hệ thống</p>
                        </div>
                        <VehicleForm
                            initialData={null}
                            onSubmit={async (payload: VehicleRequest) => {
                                try {
                                    const newVehicle = await createVehicle(payload);
                                    setVehicles(prev => [...prev, newVehicle]);
                                    setModalOpen(false);
                                    setToast("Đăng ký xe thành công!");
                                } catch (err: unknown) {
                                    let errorMessage = "Lỗi đăng ký xe không xác định.";
                                    if (err instanceof Error) {
                                        errorMessage = err.message;
                                    } else if (axios.isAxiosError(err) && err.response) {
                                        const apiError = err.response.data as { message?: string };
                                        errorMessage = apiError.message || errorMessage;
                                    }
                                    throw new Error(errorMessage);
                                }
                            }}
                            onClose={() => setModalOpen(false)}
                            currentUserId={user.id}
                        />
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div 
                    className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 z-50 cursor-pointer hover:bg-green-700 flex items-center gap-3"
                    onClick={() => setToast(null)}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{toast}</span>
                </div>
            )}
        </>
    );
};

export default CarListView;