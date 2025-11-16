"use client";

import React, { useState, useEffect } from "react";

import { useAuth } from "../../context/AuthContext";
import Layout from "../components/layout/Layout";
import {
  Part, InventoryItem, SerialPart, ReportStats, TopPart, ReportResponse
} from "../types/warranty";
import {
  getParts, getInventory, getSerialParts, createPart,
  getReportStats, getTopParts, getDetailedReports
} from "../services/warrantyApi";

import { Settings, Package, Database, Tag, BarChart3, FileText, DollarSign, Users, Clock, TrendingUp, Plus } from 'lucide-react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockParts: Part[] = [
  { id: 1, partName: "Battery Pack", description: "Pin chính", price: 5000, quantity: 10 },
  { id: 2, partName: "Motor Controller", description: "Bộ điều khiển động cơ", price: 1200, quantity: 5 },
];

const mockInventory: InventoryItem[] = [
  { id: 1, partId: 1, partName: "Battery Pack", stockQuantity: 8, location: "Kho A", lastUpdated: "2025-11-15" },
];

const mockSerialParts: SerialPart[] = [
  { id: 1, serialNumber: "SN001", partName: "Battery Pack", assignedTo: "VIN123", status: "Assigned" as const },
];

const mockReportStats: ReportStats = { totalClaims: 50, completedClaims: 30, inReview: 20, totalCost: 250000 };

const mockTopParts: TopPart[] = [
  { partName: "Battery Pack", usageCount: 15, cost: 75000 },
  { partName: "Motor Controller", usageCount: 10, cost: 12000 },
];

const mockDetailedReports: ReportResponse[] = [
  { id: 1, claimId: 101, status: "COMPLETED" as const, reportDate: "2025-11-10", technicianName: "Tech A", partCost: 5000, actualCost: 2000, totalCalculatedCost: 7000, actionToken: "TOKEN123" },
];

export default function PartsPage() {
  
  let user = null;
  let isAdminOrEVM = false;
  try {
    const authContext = useAuth();
    user = authContext.user;
    isAdminOrEVM = user?.role === 'Admin' || user?.role === 'EVM Staff';
  } catch (error) {
    console.warn('useAuth error:', error);
  }

  const [parts, setParts] = useState<Part[]>(mockParts);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [serialParts, setSerialParts] = useState<SerialPart[]>(mockSerialParts);
  const [reportStats, setReportStats] = useState<ReportStats>(mockReportStats);
  const [topParts, setTopParts] = useState<TopPart[]>(mockTopParts);
  const [detailedReports, setDetailedReports] = useState<ReportResponse[]>(mockDetailedReports);
  const [loading, setLoading] = useState(true);

  // States cho 3 modal mới
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [showAddSerialModal, setShowAddSerialModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);

  // Form states cho các modal
  const [newPart, setNewPart] = useState<Omit<Part, 'id'>>({ partName: '', description: '', price: 0, quantity: 0 });
  const [newSerial, setNewSerial] = useState({ partId: 0, serialNumber: '', dateReceived: '' });
  const [newInventory, setNewInventory] = useState({ partId: 0, centerId: '', amount: 0, invoiceDate: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setParts(await getParts());
        setInventory(await getInventory());
        setSerialParts(await getSerialParts());
        if (isAdminOrEVM) {
          setReportStats(await getReportStats());
          setTopParts(await getTopParts());
          setDetailedReports(await getDetailedReports());
        }
      } catch (error) {
        console.error('Lỗi tải data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdminOrEVM]);

  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createPart(newPart);
      setParts([...parts, created]);
      setShowAddPartModal(false);
      setNewPart({ partName: '', description: '', price: 0, quantity: 0 });
    } catch (error) {
      console.error('Tạo part thất bại:', error);
      alert('Tạo part thất bại!');
    }
  };

  // Hàm xử lý tạo Serial (mock, cần implement API thực tế)
  const handleCreateSerial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Gọi API POST /api/part-serials
      console.log('Tạo serial mới:', newSerial);
      // Giả sử thành công, thêm vào state (cần update mock hoặc API)
      const newSerialItem: SerialPart = {
        id: serialParts.length + 1,
        serialNumber: newSerial.serialNumber,
        partName: parts.find(p => p.id === newSerial.partId)?.partName || '',
        assignedTo: '',
        status: 'Available' as const
      };
      setSerialParts([...serialParts, newSerialItem]);
      setShowAddSerialModal(false);
      setNewSerial({ partId: 0, serialNumber: '', dateReceived: '' });
    } catch (error) {
      console.error('Tạo serial thất bại:', error);
      alert('Tạo serial thất bại!');
    }
  };

  // Hàm xử lý tạo Inventory (mock, cần implement API thực tế)
  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Gọi API POST /api/inventory
      console.log('Nhập tồn kho mới:', newInventory);
      // Giả sử thành công, thêm vào state (cần update mock hoặc API)
      const newInventoryItem: InventoryItem = {
        id: inventory.length + 1,
        partId: newInventory.partId,
        partName: parts.find(p => p.id === newInventory.partId)?.partName || '',
        stockQuantity: newInventory.amount,
        location: newInventory.centerId,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setInventory([...inventory, newInventoryItem]);
      setShowAddInventoryModal(false);
      setNewInventory({ partId: 0, centerId: '', amount: 0, invoiceDate: '' });
    } catch (error) {
      console.error('Nhập tồn kho thất bại:', error);
      alert('Nhập tồn kho thất bại!');
    }
  };

  const getStatusClass = (status: SerialPart['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex justify-center items-center h-64">
          <div className="text-center">
            <Clock className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Linh Kiện & Phụ Tùng</h1>
          </div>
          {/* 3 Nút mới thay thế nút tạo part cũ */}
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddPartModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Part</span>
            </button>
            <button
              onClick={() => setShowAddSerialModal(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nhập Serial</span>
            </button>
            <button
              onClick={() => setShowAddInventoryModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nhập Tồn Kho</span>
            </button>
          </div>
        </div>

        {/* Modal Thêm Part */}
        {showAddPartModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Thêm Part</h2>
                <button onClick={() => setShowAddPartModal(false)} className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Đóng</span>
                  ×
                </button>
              </div>
              <form onSubmit={handleCreatePart} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên linh kiện</label>
                  <input
                    type="text"
                    placeholder="Nhập tên part"
                    value={newPart.partName}
                    onChange={(e) => setNewPart({ ...newPart, partName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <input
                    type="text"
                    placeholder="Mô tả ngắn gọn"
                    value={newPart.description}
                    onChange={(e) => setNewPart({ ...newPart, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá bán (VND)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newPart.price}
                    onChange={(e) => setNewPart({ ...newPart, price: Number(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newPart.quantity}
                    onChange={(e) => setNewPart({ ...newPart, quantity: Number(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPartModal(false)}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Thêm Part
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Nhập Serial */}
        {showAddSerialModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nhập Serial</h2>
                <button onClick={() => setShowAddSerialModal(false)} className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Đóng</span>
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateSerial} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Part ID (Chọn danh mục)</label>
                  <select
                    value={newSerial.partId}
                    onChange={(e) => setNewSerial({ ...newSerial, partId: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value={0}>Chọn Part</option>
                    {parts.map(p => (
                      <option key={p.id} value={p.id}>{p.partName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                  <input
                    type="text"
                    placeholder="Nhập serial number"
                    value={newSerial.serialNumber}
                    onChange={(e) => setNewSerial({ ...newSerial, serialNumber: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày nhận (DateReceived)</label>
                  <input
                    type="date"
                    value={newSerial.dateReceived}
                    onChange={(e) => setNewSerial({ ...newSerial, dateReceived: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddSerialModal(false)}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Nhập Serial
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Nhập Tồn Kho */}
        {showAddInventoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nhập Tồn Kho</h2>
                <button onClick={() => setShowAddInventoryModal(false)} className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Đóng</span>
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateInventory} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Part ID</label>
                  <select
                    value={newInventory.partId}
                    onChange={(e) => setNewInventory({ ...newInventory, partId: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value={0}>Chọn Part</option>
                    {parts.map(p => (
                      <option key={p.id} value={p.id}>{p.partName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Center ID</label>
                  <input
                    type="text"
                    placeholder="Nhập Center ID"
                    value={newInventory.centerId}
                    onChange={(e) => setNewInventory({ ...newInventory, centerId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng (Amount)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newInventory.amount}
                    onChange={(e) => setNewInventory({ ...newInventory, amount: Number(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hóa đơn (InvoiceDate)</label>
                  <input
                    type="date"
                    value={newInventory.invoiceDate}
                    onChange={(e) => setNewInventory({ ...newInventory, invoiceDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddInventoryModal(false)}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Nhập Tồn Kho
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Các Bảng */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bảng Parts */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Danh Sách Linh Kiện</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SL</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p, i) => (
                    <tr key={p.id} className={`${i % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-blue-50 transition-colors`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.partName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.price.toLocaleString()}đ</td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng Inventory */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Tồn Kho</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Part</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tồn</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vị Trí</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, index) => (
                    <tr key={item.id} className={`${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-green-50 transition-colors`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.partName}</td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-600">{item.stockQuantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng Serial Parts */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <Tag className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Phụ Tùng Serial</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Serial</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Part</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {serialParts.map((s, i) => (
                    <tr key={s.id} className={`${i % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-purple-50 transition-colors`}>
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">{s.serialNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.partName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Report Dashboard - Chỉ Admin/EVM */}
        {isAdminOrEVM && (
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">Báo Cáo Dashboard</h2>
            </div>

            {/* Cards Thống Kê */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Tổng Claims</p>
                    <p className="text-3xl font-bold text-blue-900">{reportStats.totalClaims}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Hoàn Thành</p>
                    <p className="text-3xl font-bold text-green-900">{reportStats.completedClaims}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Đang Review</p>
                    <p className="text-3xl font-bold text-yellow-900">{reportStats.inReview}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Tổng Chi Phí</p>
                    <p className="text-3xl font-bold text-red-900">{reportStats.totalCost.toLocaleString()}đ</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Biểu Đồ */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-800">Biểu Đồ Trạng Thái Claims</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Hoàn Thành', value: reportStats.completedClaims, fill: '#10B981' },
                  { name: 'Review', value: reportStats.inReview, fill: '#F59E0B' }
                ]}>
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip formatter={(value) => [`${value} claims`, 'Số lượng']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top 5 Linh Kiện */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-800">Top 5 Linh Kiện Hỏng</h3>
              </div>
              <div className="space-y-3">
                {topParts.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</span>
                        <h4 className="font-medium text-gray-900">{t.partName}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{t.usageCount} lần sử dụng</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{t.cost.toLocaleString()}đ</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(t.usageCount / 20) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bảng Chi Tiết Reports */}
        {isAdminOrEVM && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="flex items-center space-x-3 p-6 border-b border-gray-200 bg-gray-50">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-800">Bảng Chi Tiết Báo Cáo (Admin/EVM)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Claim ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Trạng Thái</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Ngày Lập</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Kỹ Thuật Viên</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Chi Phí Linh Kiện</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Chi Phí Thực Tế</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Tổng Chi Phí</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Action Token</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedReports.map((r, i) => (
                    <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors border-b border-gray-100`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{r.claimId}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          r.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.reportDate}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.technicianName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.partCost.toLocaleString()}đ</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.actualCost.toLocaleString()}đ</td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600">{r.totalCalculatedCost.toLocaleString()}đ</td>
                      <td className="px-6 py-4 text-sm font-mono text-xs bg-gray-100 px-2 py-1 rounded">{r.actionToken}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CSS animation cho modal */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </Layout>
  );
}