"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Thay thế useNavigate với Link của Next.js
import Layout from "../components/layout/Layout";
import Filters from "../components/common/Filters";

interface WarrantyClaim {
  id: number;
  claimNo: string;
  vin: string;
  model: string;
  customer: string;
  centerName: string;
  technicianName: string;
  createdAt: string;
  totalCost: number;
  status: keyof typeof ClaimStatusMap;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
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

const getStatusClasses = (status: string) => {
  switch (status) {
    case "APPROVED":
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "IN_PROCESS":
      return "bg-blue-100 text-blue-700";
    case "WAITING_APPROVAL":
      return "bg-yellow-100 text-yellow-800";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "VERIFICATION":
      return "bg-purple-100 text-purple-700";
    case "SENT":
      return "bg-indigo-100 text-indigo-700";
    case "DRAFT":
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export default function WarrantyClaimsPage() {
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [filterApproval, setFilterApproval] = useState("Tất cả");
  const [filterTechnician, setFilterTechnician] = useState("Tất cả");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await fetch("/api/claims");

        // Check for HTML response
        if (res.headers.get('content-type')?.includes('text/html')) {
          throw new Error('Received HTML instead of JSON');
        }

        const data = await res.json();
        setClaims(data);
      } catch (e) {
        console.error(e.message); // Log the error message
      }
    }
    fetchClaims();
  }, []);

  const technicianList = Array.from(new Set(claims.map((c) => c.technicianName)));

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.claimNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.vin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "Tất cả" || claim.status === filterStatus;

    const matchesApproval =
      filterApproval === "Tất cả" || claim.approvalStatus === filterApproval;

    const matchesTechnician =
      filterTechnician === "Tất cả" || claim.technicianName === filterTechnician;

    const matchesDate = (() => {
      if (!dateRange.from && !dateRange.to) return true;
      const created = new Date(claim.createdAt).getTime();
      const from = dateRange.from ? new Date(dateRange.from).getTime() : 0;
      const to = dateRange.to ? new Date(dateRange.to).getTime() : Infinity;
      return created >= from && created <= to;
    })();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesApproval &&
      matchesTechnician &&
      matchesDate
    );
  });

  return (
    <Layout>
      <div className="space-y-6 md:space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          📋 Danh sách Yêu cầu Bảo hành
        </h1>
        <div className="flex justify-end">
          <Link href="/add-new-claim">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Thêm mới
            </button>
          </Link>
        </div>
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterApproval={filterApproval}
          setFilterApproval={setFilterApproval}
          filterTechnician={filterTechnician}
          setFilterTechnician={setFilterTechnician}
          dateRange={dateRange}
          setDateRange={setDateRange}
          availableTechnicians={technicianList}
        />
        <div className="shadow-xl bg-white rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Claim No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">VIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Trung tâm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Kỹ thuật viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Chi phí</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{claim.claimNo}</td>
                  <td className="px-6 py-4">{claim.vin}</td>
                  <td className="px-6 py-4">{claim.model}</td>
                  <td className="px-6 py-4">{claim.customer}</td>
                  <td className="px-6 py-4">{claim.centerName}</td>
                  <td className="px-6 py-4">{claim.technicianName}</td>
                  <td className="px-6 py-4">{claim.createdAt}</td>
                  <td className="px-6 py-4 font-semibold text-blue-700">{claim.totalCost.toLocaleString()} đ</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(claim.status)}`}
                    >
                      {ClaimStatusMap[claim.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}