import React from "react";

interface FilterProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  filterApproval: string;
  setFilterApproval: React.Dispatch<React.SetStateAction<string>>;
  filterTechnician: string;
  setFilterTechnician: React.Dispatch<React.SetStateAction<string>>;
  dateRange: { from: string; to: string };
  setDateRange: React.Dispatch<React.SetStateAction<{ from: string; to: string }>>;
  availableTechnicians: string[];
}

const ClaimStatusMap: Record<string, string> = {
  DRAFT: "Bản nháp",
  SENT: "Đã gửi lên Hãng",
  WAITING_APPROVAL: "Đang chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  IN_PROCESS: "Đang xử lý",
  COMPLETED: "Đã hoàn thành",
  VERIFICATION: "Đang xác minh",
};

export default function Filters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterApproval,
  setFilterApproval,
  filterTechnician,
  setFilterTechnician,
  dateRange,
  setDateRange,
  availableTechnicians,
}: FilterProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md space-y-4">
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm theo Mã, VIN, Khách hàng..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          className="border p-2 rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="Tất cả">Trạng thái Claim (Tất cả)</option>
          {Object.keys(ClaimStatusMap).map((st) => (
            <option key={st} value={st}>
              {ClaimStatusMap[st]}
            </option>
          ))}
        </select>

        {/* Approval Status Filter */}
        <select
          className="border p-2 rounded-lg"
          value={filterApproval}
          onChange={(e) => setFilterApproval(e.target.value)}
        >
          <option value="Tất cả">Phê duyệt (Tất cả)</option>
          <option value="PENDING">Đang đợi</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </select>

        {/* Technician Filter */}
        <select
          className="border p-2 rounded-lg"
          value={filterTechnician}
          onChange={(e) => setFilterTechnician(e.target.value)}
        >
          <option value="Tất cả">Kỹ thuật viên (Tất cả)</option>
          {availableTechnicians.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex space-x-4">
        <input
          type="date"
          className="border p-2 rounded-lg"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded-lg"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        />
      </div>
    </div>
  );
}