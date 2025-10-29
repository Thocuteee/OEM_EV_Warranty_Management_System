// src/app/cars/[vin]/page.tsx
import React from 'react';
// Đảm bảo đường dẫn import đúng
import CarDetailView from '../../../components/CarManagement/CarDetailView'; 

// Định nghĩa props để nhận tham số dynamic từ URL
interface CarDetailPageProps {
    params: {
        vin: string; // Tên phải khớp với tên thư mục: [vin]
    };
}

// Component chính cho route /cars/[vin]
export default function CarDetailPage({ params }: CarDetailPageProps) {
    const { vin } = params; // Lấy VIN từ params

    return (
        <main className="p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-2">
                Chi tiết Xe: {vin}
            </h1>
            {/* 💡 BƯỚC QUAN TRỌNG: Truyền VIN xuống Client Component */}
            <CarDetailView vin={vin} /> 
        </main>
    );
}