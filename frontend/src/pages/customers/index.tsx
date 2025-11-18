"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import Modal from "../../components/common/Modal";
import CustomerForm from "../../components/customers/CustomerForm";

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Nguyễn Văn A', phone: '0123456789', email: 'vana@example.com', address: '123 Đường A, TP. HCM' },
    { id: 2, name: 'Trần Thị B', phone: '0987654321', email: 'thib@example.com', address: '456 Đường B, Hà Nội' },
    { id: 3, name: 'Lê Văn C', phone: '0901234567', email: 'vanc@example.com', address: '789 Đường C, Đà Nẵng' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const handleEditCustomer = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleUpdateCustomer = (updatedCustomerData) => {
    const updatedCustomers = customers.map(c =>
      c.id === currentCustomer.id
        ? { ...c, ...updatedCustomerData }
        : c
    );
    setCustomers(updatedCustomers);
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý Khách hàng</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Địa chỉ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm">{customer.name}</td>
                  <td className="px-6 py-4 text-sm">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm">{customer.email}</td>
                  <td className="px-6 py-4 text-sm">{customer.address}</td>
                  <td className="px-6 py-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      Xem/Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h2 className="text-xl font-bold mb-4">Xem/Sửa thông tin Khách hàng</h2>
          <CustomerForm
            customer={currentCustomer}
            onSubmit={handleUpdateCustomer}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </div>
  
    </Layout>
  );
}