<<<<<<< HEAD
// frontend/src/pages/reports.tsx
// Wrapper để Next.js route đến /reports
export { default } from "@/reports/index";

=======
// src/pages/reports.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";
import axios from "axios";
import MainLayout from "@/components/layout/MainLayout";
import { ReportStats, TopPart, ReportResponse } from "@/types/warranty";
import { useAuth } from "../../context/AuthContext"; // pages router

const fetchJson = async <T,>(url: string): Promise<T> => {
  const res = await axios.get<T>(url);
  return res.data;
};

const API = {
  stats: "http://localhost:8080/api/reports/stats",
  topParts: "http://localhost:8080/api/reports/top-parts",
  detailed: "http://localhost:8080/api/reports",
};

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [topParts, setTopParts] = useState<TopPart[]>([]);
  const [detailed, setDetailed] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t, d] = await Promise.all([
          fetchJson<ReportStats>(API.stats),
          fetchJson<TopPart[]>(API.topParts),
          fetchJson<ReportResponse[]>(API.detailed),
        ]);
        setStats(s);
        setTopParts(t);
        setDetailed(d);
      } catch (e) {
        console.error("Lỗi tải dữ liệu:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completionRate = useMemo(() => {
    if (!stats || stats.totalClaims === 0) return "0";
    return ((stats.completedClaims / stats.totalClaims) * 100).toFixed(1);
  }, [stats]);

  const filtered = useMemo(() => {
    return detailed.filter(
      (r) =>
        r.technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.claimId.toString().includes(searchTerm)
    );
  }, [detailed, searchTerm]);

  const chartData = topParts.map((p, i) => ({
    name: p.partName,
    count: p.usageCount,
    fill: "#3b82f6",
  }));

  const content = loading ? (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border rounded-lg p-6 h-32 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="p-6 space-y-8">
      {/* A. Report Dashboard */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">A. Report Dashboard</h1>

        {/* 4 ô số liệu - màu trắng, viền xám */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Tổng Yêu Cầu", value: stats?.totalClaims ?? 0 },
            { label: "Đã Hoàn Thành", value: stats?.completedClaims ?? 0 },
            { label: "Đang Xử Lý", value: stats?.inReview ?? 0 },
            { label: "Tổng Chi Phí", value: `${(stats?.totalCost ?? 0).toLocaleString()} VND` },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">{item.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Tỷ lệ hoàn thành */}
        <div className="mt-8 bg-white border border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Tỷ lệ hoàn thành</h3>
          <p className="text-6xl font-bold text-blue-600">{completionRate}%</p>
        </div>

        {/* Top 5 linh kiện */}
        <div className="mt-8 bg-white border border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Top 5 linh kiện</h3>
          {topParts.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Chưa có dữ liệu</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* B. Bảng chi tiết */}
      <section>
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">B. Bảng chi tiết báo cáo</h3>
            </div>
            <input
              type="text"
              placeholder="Claim ID / Kỹ thuật viên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg font-medium">Chưa có báo cáo</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {["ID", "Claim ID", "Trạng thái", "Ngày lập", "Kỹ thuật viên", "Tổng chi phí", "Hành động"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 font-medium text-gray-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{r.id}</td>
                      <td className="py-3 px-4">{r.claimId}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            r.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {r.status === "COMPLETED" ? "Hoàn thành" : "Đang xem xét"}
                        </span>
                      </td>
                      <td className="py-3 px-4">{format(new Date(r.reportDate), "dd/MM/yyyy")}</td>
                      <td className="py-3 px-4">{r.technicianName}</td>
                      <td className="py-3 px-4 font-medium">{r.totalCalculatedCost.toLocaleString()} VND</td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-xs">{r.actionToken}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  return <MainLayout>{content}</MainLayout>;
}
>>>>>>> main
