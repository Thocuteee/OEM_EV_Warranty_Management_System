// src/pages/reports.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";
import axios from "axios";
import MainLayout from "@/components/layout/MainLayout";   // ← ĐÚNG alias
import { ReportStats, TopPart, ReportResponse } from "@/types/warranty";
import { useAuth } from "../../context/AuthContext";        // ← ĐÚNG cho pages/

const API = {
  stats: "http://localhost:8080/api/reports/stats",
  topParts: "http://localhost:8080/api/reports/top-parts",
  detailed: "http://localhost:8080/api/reports",
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await axios.get<T>(url);
  return res.data;
};

export default function ReportsPage() {
  const { user } = useAuth();               // dùng để hiển thị role nếu muốn
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
        setStats(s); setTopParts(t); setDetailed(d);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const completionRate = useMemo(() => {
    if (!stats || stats.totalClaims === 0) return "0";
    return ((stats.completedClaims / stats.totalClaims) * 100).toFixed(1);
  }, [stats]);

  const filtered = useMemo(() => detailed.filter(r =>
    r.technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.claimId.toString().includes(searchTerm)
  ), [detailed, searchTerm]);

  const chartData = topParts.map((p, i) => ({
    name: p.partName,
    count: p.usageCount,
    fill: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#10b981",
  }));

  // ------------------- UI -------------------
  const content = loading ? (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  ) : (
    <div className="space-y-8">
      {/* ==== A. DASHBOARD ==== */}
      <section>
        <h1 className="text-2xl font-bold mb-4">A. Report Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Tổng Yêu Cầu", value: stats?.totalClaims ?? 0, icon: "Package" },
            { label: "Đã Hoàn Thành", value: stats?.completedClaims ?? 0, icon: "CheckCircle", color: "text-green-600" },
            { label: "Đang Xử Lý", value: stats?.inReview ?? 0, icon: "Clock", color: "text-yellow-600" },
            { label: "Tổng Chi Phí", value: `${(stats?.totalCost ?? 0).toLocaleString()} VND`, icon: "TrendingUp", color: "text-purple-600" },
          ].map((c, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">{c.label}</p>
              <p className={`text-2xl font-bold mt-1 ${c.color ?? ""}`}>{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Tỷ lệ hoàn thành</h3>
          <div className="text-center">
            <span className="text-5xl font-bold text-blue-600">{completionRate}%</span>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top 5 linh kiện</h3>
          {topParts.length === 0 ? (
            <p className="text-gray-500 text-center">Chưa có dữ liệu</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((e, i) => (<Cell key={i} fill={e.fill} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* ==== B. BẢNG CHI TIẾT ==== */}
      <section>
        <h1 className="text-2xl font-bold mb-4">B. Bảng chi tiết báo cáo</h1>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <p className="text-sm text-gray-600">Tìm kiếm</p>
            <input
              type="text"
              placeholder="Claim ID / Kỹ thuật viên"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-3 py-1 border rounded w-64"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-12 text-gray-500">Chưa có báo cáo</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Claim ID", "Trạng thái", "Ngày lập", "Kỹ thuật viên", "Tổng chi phí", "Hành động"].map(h => (
                    <th key={h} className="text-left py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{r.id}</td>
                    <td className="py-3 px-4">{r.claimId}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
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
      </section>
    </div>
  );

  // ------------------- BỌC LAYOUT -------------------
  return <MainLayout>{content}</MainLayout>;
}