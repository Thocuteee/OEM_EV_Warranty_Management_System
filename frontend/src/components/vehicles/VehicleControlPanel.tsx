import React, { useState } from "react";
import { useRouter } from "next/router";
import { Search, Plus, Filter } from "lucide-react";

const VehicleControlPanel = ({ onSearch }) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => onSearch(searchText);

  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm VIN / Mẫu xe / Chủ sở hữu..."
          className="border rounded px-4 py-2 w-64"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          onClick={() => console.log("Filter options open...")}
        >
          <Filter size={16} /> Lọc
        </button>
      </div>
      <button
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => router.push("/vehicles/add")}
      >
        <Plus size={20} /> Thêm mới
      </button>
    </div>
  );
};

export default VehicleControlPanel;