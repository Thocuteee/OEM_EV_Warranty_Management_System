import React, { useState, useEffect } from "react";

function CustomerForm({ customer, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.phone && formData.email) {
      onSubmit(formData);
    } else {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Tên Khách Hàng *</label>
        <input
          type="text"
          name="name"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Số điện thoại *</label>
        <input
          type="text"
          name="phone"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Email *</label>
        <input
          type="email"
          name="email"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Địa chỉ</label>
        <input
          type="text"
          name="address"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}
export default CustomerForm;
