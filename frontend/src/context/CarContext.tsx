// src/context/CarContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Car } from '../types'; 
import { mockCars } from '../data/mockCars';

// 1. Định nghĩa kiểu dữ liệu cho Context
interface CarContextType {
    cars: Car[];
    addCar: (newCar: Omit<Car, 'id'>) => void;
    updateCar: (updatedCar: Car) => void;
}

// Giả định ban đầu
const initialContext: CarContextType = {
    cars: mockCars,
    addCar: () => {},
    updateCar: () => {},
};

// 2. Tạo Context
export const CarContext = createContext<CarContextType>(initialContext);

// 3. Tạo Provider (Component quản lý State)
interface CarProviderProps {
    children: ReactNode;
}

export const CarProvider: React.FC<CarProviderProps> = ({ children }) => {
    // State chứa danh sách xe (Nguồn sự thật duy nhất)
    const [cars, setCars] = useState<Car[]>(mockCars);

    // Hàm thêm xe mới
    const addCar = (newCarData: Omit<Car, 'id'>) => {
        const newCar: Car = {
            ...newCarData,
            id: Date.now(), // ID duy nhất
            status: 'Trong bảo hành',
            year: Number(newCarData.year),
        };
        setCars(prevCars => [...prevCars, newCar]);
    };

    // Hàm cập nhật xe
    const updateCar = (updatedCar: Car) => {
        setCars(prevCars => 
            prevCars.map(car => (car.vin === updatedCar.vin ? updatedCar : car))
        );
    };

    return (
        <CarContext.Provider value={{ cars, addCar, updateCar }}>
            {children}
        </CarContext.Provider>
    );
};

// 4. Hook tùy chỉnh để sử dụng Context
export const useCars = () => useContext(CarContext);