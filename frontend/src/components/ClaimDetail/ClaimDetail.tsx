import React, { useEffect, useState } from 'react';
import { sendClaimToEVM, completeClaimRepair } from "../../services/warrantyApi";

export const ClaimDetail = ({ claimId }) => {
  const [claim, setClaim] = useState(null);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        const response = await fetch(`/api/claims/${claimId}`);
        const data = await response.json();
        setClaim(data);
      } catch (error) {
        console.error("Error fetching claim details:", error);
      }
    };
    fetchClaimDetails();
  }, [claimId]);

  const handleSend = async () => {
    try {
      const updated = await sendClaimToEVM(claimId);
      setClaim(updated);
      alert("Đã gửi Claim lên Hãng!");
    } catch (e) {
      alert("Không thể gửi Claim!");
    }
  };

  const handleComplete = async () => {
    try {
      const updated = await completeClaimRepair(claimId);
      setClaim(updated);
      alert("Đã hoàn tất Claim!");
    } catch (e) {
      alert("Không thể hoàn tất Claim!");
    }
  };

  if (!claim) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      {/* Render thông tin Claim */}
      <h2 className="text-xl font-bold">Chi tiết Claim</h2>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p><strong>Claim No:</strong> {claim.claimNo}</p>
        <p><strong>VIN:</strong> {claim.vin}</p>
        <p><strong>Trạng thái:</strong> {claim.status}</p>
      </div>

      {/* Nút chuyển trạng thái */}
      {claim.status === "DRAFT" && (
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Gửi yêu cầu
        </button>
      )}

      {claim.status === "IN_PROCESS" && (
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Hoàn tất sửa chữa
        </button>
      )}
    </div>
  );
};
