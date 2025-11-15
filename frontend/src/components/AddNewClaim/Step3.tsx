import React, { useState } from 'react';

const Step3 = ({ formData, handleSubmit }: { formData: any, handleSubmit: Function }) => {
  const [approvalStatus, setApprovalStatus] = useState(formData.approvalStatus || 'PENDING');

  const handleComplete = () => {
    const finalData = { ...formData, approvalStatus };
    handleSubmit(finalData);
  };

  return (
    <div>
      <h2>Bước 3: Xác nhận & Gửi</h2>
      <div>
        <label>
          Trạng thái Phê duyệt:
          <select value={approvalStatus} onChange={e => setApprovalStatus(e.target.value)}>
            <option value="PENDING">Đang chờ xử lý</option>
            <option value="APPROVED">Đã phê duyệt</option>
            <option value="REJECTED">Bị từ chối</option>
          </select>
        </label>
      </div>
      <button onClick={handleComplete}>Hoàn tất và Gửi</button>
    </div>
  );
};

export default Step3;