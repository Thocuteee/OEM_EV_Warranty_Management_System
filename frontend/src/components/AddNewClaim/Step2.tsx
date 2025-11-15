import React, { useState } from 'react';

const Step2 = ({ setFormData, formData }: { setFormData: Function, formData: any }) => {
  const [cost, setCost] = useState(formData.cost || '');
  const [createdAt, setCreatedAt] = useState(formData.createdAt || '');

  const handleNext = () => {
    setFormData({ ...formData, cost, createdAt });
  };

  return (
    <div>
      <h2>Bước 2: Chi tiết Yêu cầu</h2>
      <div>
        <label>
          Chi phí:
          <input type="number" value={cost} onChange={e => setCost(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Ngày tạo:
          <input type="date" value={createdAt} onChange={e => setCreatedAt(e.target.value)} />
        </label>
      </div>
      <button onClick={handleNext}>Tiếp theo</button>
    </div>
  );
};

export default Step2;