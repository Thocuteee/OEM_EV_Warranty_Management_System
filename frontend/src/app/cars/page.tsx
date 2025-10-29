// src/app/cars/page.tsx
// Đây là Server Component, dùng để import và render Client Component

import React from 'react';
import CarListView from '../../components/CarManagement/CarListView';

// Giả định bạn có một Layout (header/sidebar) chung
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="p-6 bg-gray-50 min-h-screen">
        {children}
    </div>
);

// Component chính cho route /cars
export default function CarListPage() {
    return (
        
        <PageLayout>
           <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-2">
                           OEM EV Warranty Management System - Đăng ký Xe Mới
                       </h1>
            <CarListView />
        </PageLayout>
    );
}