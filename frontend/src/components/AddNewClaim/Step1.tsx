import React, { useState } from 'react';

const Step1 = ({ setFormData, formData }: { setFormData: Function, formData: any }) => {
  const [center, setCenter] = useState(formData.center || '');
  const [technician, setTechnician] = useState(formData.technician || '');

  const handleNext = () => {
    setFormData({ ...formData, center, technician });
  };

  return (
    <div>
      <h2>Bước 1: Thông tin Cơ bản</h2>
      <div>
        <label>
          Trung tâm:
          <input type="text" value={center} onChange={e => setCenter(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Kỹ thuật viên:
          <input type="text" value={technician} onChange={e => setTechnician(e.target.value)} />
        </label>
      </div>
      <button onClick={handleNext}>Tiếp theo</button>
    </div>
  );
};

export default Step1;