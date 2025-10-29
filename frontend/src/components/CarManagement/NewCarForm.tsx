// src/components/CarManagement/NewCarForm.tsx

"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';
// Sử dụng next/navigation cho App Router
import { useRouter } from 'next/navigation'; 
// Import từ thư mục cha
import { Car } from '../../types'; 
import { useCars } from '../../context/CarContext';




const NewCarForm: React.FC = () => {
    const router = useRouter();
    const { addCar } = useCars();
    // Khởi tạo state với kiểu Car
    const [formData, setFormData] = useState<Omit<Car, 'id'>>({
        vin: '',
        model: 'EV-A',
        year: new Date().getFullYear(),
        customerName: '',
        customerId: '',
        registrationDate: new Date().toISOString().substring(0, 10),
        status: 'Trong bảo hành',
        batterySerial: '',
        notes: '',
    });

    const availableModels = ['EV-A', 'EV-B', 'EV-C', 'EV-Truck'];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // 1. Kiểm tra dữ liệu bắt buộc
        if (!formData.vin || !formData.customerName || !formData.model) {
            alert('Vui lòng nhập VIN, Model và Tên Khách hàng.');
            return;
        }
        addCar(formData); 
        
        alert(`Đăng ký xe VIN: ${formData.vin} thành công!`);
        router.push('/cars'); // Chuyển về trang danh sách (sẽ hiển thị xe mới)
        // Tạo đối tượng xe hoàn chỉnh (giả định xe mới luôn là 'Trong bảo hành')
       
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* VIN (Bắt buộc) */}
                    <InputField label="VIN XE" name="vin" value={formData.vin} onChange={handleChange} required type="text" />

                    {/* Model (Select) */}
                    <SelectField label="Model" name="model" value={formData.model} onChange={handleChange} required options={availableModels} />
                    
                    {/* Năm */}
                    <InputField label="Năm Sản xuất" name="year" value={formData.year.toString()} onChange={handleChange} required type="number" />
                    
                    {/* Ngày Đăng ký */}
                    <InputField label="Ngày Đăng ký" name="registrationDate" value={formData.registrationDate} onChange={handleChange} required type="date" />

                    {/* Khách hàng (Bắt buộc) */}
                    <InputField label="Tên Khách hàng" name="customerName" value={formData.customerName} onChange={handleChange} required type="text" />

                    {/* ID Khách hàng */}
                    <InputField label="ID Khách hàng" name="customerId" value={formData.customerId} onChange={handleChange} required={false} type="text" />
                    
                    {/* Số Serial Pin */}
                    <InputField label="Số Serial Pin" name="batterySerial" value={formData.batterySerial} onChange={handleChange} required={false} type="text" />
                </div>

                {/* Ghi chú */}
                <div className="flex flex-col mt-6">
                    <label htmlFor="notes" className="mb-2 font-medium text-gray-700">Ghi chú</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                </div>

                {/* Nút hành động */}
                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        type="button"
                        onClick={() => router.push('/cars')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded-lg transition duration-150"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-150"
                    >
                        Đăng ký Xe
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewCarForm;

interface InputFieldProps {
    label: string;
    name: keyof Omit<Car, 'id'>;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    type: string;
}


const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, required = true, type }) => (
    <div className="flex flex-col">
        <label htmlFor={name as string} className="mb-1 font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={name as string}
            name={name as string}
            value={value}
            onChange={onChange as any} 
            required={required}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);

interface SelectFieldProps {
    label: string;
    name: keyof Omit<Car, 'id'>;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    options: string[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, required = true, options }) => (
    <div className="flex flex-col">
        <label htmlFor={name as string} className="mb-1 font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            id={name as string}
            name={name as string}
            value={value}
            onChange={onChange}
            required={required}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);