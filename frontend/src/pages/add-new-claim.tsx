import React, { useState } from 'react';
import Layout from '../components/layout/Layout'; // Đảm bảo bạn có Layout này

interface NewClaimFormData {
  centerName: string;
  technicianName: string;
  claimNo: string;
  vin: string;
  model: string;
  customer: string;
  totalCost: number;
  createdAt: string;
}

export default function AddNewClaim() {
  const [formData, setFormData] = useState<NewClaimFormData>({
    centerName: '',
    technicianName: '',
    claimNo: '',
    vin: '',
    model: '',
    customer: '',
    totalCost: 0,
    createdAt: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/add-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Yêu cầu bảo hành mới đã được thêm thành công!');
        // Optionally reset form data here
        setFormData({
          centerName: '',
          technicianName: '',
          claimNo: '',
          vin: '',
          model: '',
          customer: '',
          totalCost: 0,
          createdAt: '',
        });
      } else {
        alert('Đã xảy ra lỗi trong quá trình thêm yêu cầu mới.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Đã xảy ra lỗi trong quá trình kết nối tới server.');
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Thêm mới yêu cầu bảo hành</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trung tâm
            </label>
            <input
              type="text"
              name="centerName"
              value={formData.centerName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kỹ thuật viên
            </label>
            <input
              type="text"
              name="technicianName"
              value={formData.technicianName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã yêu cầu
            </label>
            <input
              type="text"
              name="claimNo"
              value={formData.claimNo}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              VIN
            </label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Khách hàng
            </label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tổng chi phí
            </label>
            <input
              type="number"
              name="totalCost"
              value={formData.totalCost}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày tạo
            </label>
            <input
              type="date"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Thêm yêu cầu
          </button>
        </form>
      </div>
    </Layout>
  );
}