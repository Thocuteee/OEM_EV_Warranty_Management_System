// src/app/cars/new/page.tsx
import React from 'react';
import NewCarForm from '../../../components/CarManagement/NewCarForm';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="p-6 bg-gray-50 min-h-screen">
        {children}
    </div>
);

// Component chính cho route /cars/new
export default function NewCarPage() {
    return (
        <PageLayout>
             
            {/* Import Client Component đã tạo */}
            <NewCarForm />
        </PageLayout>
    );
}