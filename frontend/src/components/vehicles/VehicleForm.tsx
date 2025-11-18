import React, { useState } from "react";

function VehicleForm({ vehicle, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    vin: vehicle?.vin || "",
    model: vehicle?.model || "",
    licensePlate: vehicle?.licensePlate || "",
    year: vehicle?.year || new Date().getFullYear(),
    owner: vehicle?.owner || "",
    status: vehicle?.status || "ACTIVE",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.vin) newErrors.vin = "VIN là bắt buộc";
    if (!formData.model) newErrors.model = "Mẫu xe là bắt buộc";
    if (!formData.licensePlate) newErrors.licensePlate = "Biển số là bắt buộc";
    if (!formData.year) newErrors.year = "Năm sản xuất là bắt buộc";
    if (!formData.owner) newErrors.owner = "Chủ sở hữu là bắt buộc";
    
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-medium mb-1">VIN *</label>
          <input
            type="text"
            name="vin"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={formData.vin}
            onChange={handleChange}
            placeholder="Nhập VIN"
          />
          {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Mẫu xe *</label>
          <input
            type="text"
            name="model"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={formData.model}
            onChange={handleChange}
            placeholder="Nhập mẫu xe"
          />
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Biển số xe *</label>
          <input
            type="text"
            name="licensePlate"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={formData.licensePlate}
            onChange={handleChange}
            placeholder="Nhập biển số"
          />
          {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Năm sản xuất *</label>
          <input
            type="number"
            name="year"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={formData.year}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
          />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Chủ sở hữu *</label>
          <input
            type="text"
            name="owner"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={formData.owner}
            onChange={handleChange}
            placeholder="Nhập tên chủ sở hữu"
          />
          {errors.owner && <p className="text-red-500 text-sm mt-1">{errors.owner}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Trạng thái *</label>
          <select
            name="status"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Không hoạt động</option>
            <option value="MAINTENANCE">Bảo trì</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-6">
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {vehicle ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </div>
  );
}

export default VehicleForm;