// src/components/CarManagement/CarDetailView.tsx

"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// Import từ thư mục cha
import { mockCars } from '../../data/mockCars'; 
import { Car, CarStatus } from '../../types';
import { useCars } from '../../context/CarContext'; 


// Định nghĩa props để nhận VIN
interface CarDetailViewProps {
    vin: string; 
}

const CarDetailView: React.FC<CarDetailViewProps> = ({ vin }) => {
    const { cars, updateCar } = useCars();  
    // State dữ liệu xe và trạng thái chỉnh sửa
    const [carData, setCarData] = useState<Car | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    const availableModels = ['EV-A', 'EV-B', 'EV-C', 'EV-Truck'];
    const availableStatuses: CarStatus[] = ['Đang hoạt động', 'Trong bảo hành', 'Ngừng hoạt động'];

    
    useEffect(() => {
        if (vin) {
            // 💡 TÌM KIẾM XE TRONG DỮ LIỆU TỪ CONTEXT
            const car = cars.find(c => c.vin === vin);
            setCarData(car ? { ...car } : null); 
        }
       
    }, [vin,cars]); // Tải lại khi VIN thay đổi

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCarData(prev => prev ? ({ ...prev, [name]: value }) : null);
    };

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        
        if (!carData) return;
        updateCar(carData); 
       

        // 2. Xử lý thành công
        alert(`Cập nhật thông tin xe VIN: ${carData.vin} thành công!`);
        setIsEditing(false);
        // Dữ liệu đã được cập nhật trong state, giao diện sẽ tự động hiển thị
    };

    if (!vin) return <div className="p-6 text-center text-gray-500">Đang tải...</div>;
    if (carData === null) return <div className="p-6 text-center text-red-500">Không tìm thấy xe VIN: {vin}</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Thông tin Cơ bản</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`font-bold py-2 px-6 rounded-lg transition duration-150 shadow-md ${isEditing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                >
                    {isEditing ? 'Hủy' : 'Chỉnh Sửa'}
                </button>
            </div>
            
            <form onSubmit={handleUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* VIN (Không cho chỉnh sửa) */}
                    <ReadOnlyField label="VIN XE" value={carData.vin} />
                    
                    {/* Model */}
                    <DetailField 
                        label="Model" name="model" value={carData.model} onChange={handleChange} 
                        readOnly={!isEditing} isSelect={true} options={availableModels}
                    />

                    {/* Năm */}
                    <DetailField 
                        label="Năm Sản xuất" name="year" value={carData.year.toString()} onChange={handleChange} 
                        readOnly={!isEditing} type="number"
                    />
                    
                    {/* Ngày Đăng ký */}
                    <DetailField 
                        label="Ngày Đăng ký" name="registrationDate" value={carData.registrationDate} onChange={handleChange} 
                        readOnly={!isEditing} type="date"
                    />

                    {/* Tên Khách hàng */}
                    <DetailField 
                        label="Tên Khách hàng" name="customerName" value={carData.customerName} onChange={handleChange} 
                        readOnly={!isEditing}
                    />

                    {/* ID Khách hàng */}
                    <DetailField 
                        label="ID Khách hàng" name="customerId" value={carData.customerId} onChange={handleChange} 
                        readOnly={!isEditing}
                    />
                    
                    {/* Số Serial Pin */}
                    <DetailField 
                        label="Số Serial Pin" name="batterySerial" value={carData.batterySerial} onChange={handleChange} 
                        readOnly={!isEditing}
                    />
                     
                    {/* Trạng thái */}
                    <DetailField 
                        label="Trạng thái" name="status" value={carData.status} onChange={handleChange} 
                        readOnly={!isEditing} isSelect={true} options={availableStatuses}
                    />
                </div>
                
                {/* Ghi chú */}
                <div className="flex flex-col mt-6">
                    <label htmlFor="notes" className="mb-2 font-medium text-gray-700">Ghi chú</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={carData.notes}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`p-3 border rounded-lg ${!isEditing ? 'bg-gray-100 border-gray-200' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} resize-none`}
                    />
                </div>

                {/* Nút Cập nhật (Chỉ hiện khi đang chỉnh sửa) */}
                {isEditing && (
                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-150"
                        >
                            Lưu Cập nhật
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};



// Component phụ trợ cho trường chỉ đọc
const ReadOnlyField: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">{label}</label>
        <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-semibold">
            {value}
        </div>
    </div>
);

// Component phụ trợ cho trường chi tiết/chỉnh sửa
interface DetailFieldProps {
    label: string;
    name: keyof Car;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    readOnly: boolean;
    type?: string;
    isSelect?: boolean;
    options?: (string | number)[];
}

const DetailField: React.FC<DetailFieldProps> = ({ label, name, value, onChange, readOnly, type = 'text', isSelect = false, options = [] }) => {
    const inputClasses = `p-3 border rounded-lg ${readOnly ? 'bg-gray-100 border-gray-200' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} ${isSelect ? 'bg-white' : ''}`;
    
    return (
        <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">{label}</label>
            {!isSelect ? (
                <input
                    type={type}
                    name={name as string}
                    value={value}
                    onChange={onChange as any}
                    readOnly={readOnly}
                    className={inputClasses}
                />
            ) : (
                 <select
                    name={name as string}
                    value={value}
                    onChange={onChange as any}
                    disabled={readOnly}
                    className={inputClasses}
                >
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            )}
        </div>
    );
};
export default CarDetailView;