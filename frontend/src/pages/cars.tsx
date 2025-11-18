"use client";

import React from 'react';
import Layout from '@/components/layout/Layout'; 
import CarListView from '@/components/CarManagement/CarListView'; 

export default function CarsPage() {
    return (
        <Layout>
            <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Danh sách Xe và Khởi tạo Bảo hành</h1>
                <CarListView /> 
            </div>
        </Layout>
    );
}