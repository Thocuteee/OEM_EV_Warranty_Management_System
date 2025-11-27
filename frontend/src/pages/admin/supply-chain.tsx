"use client";

import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { InventoryRequest, InventoryResponse } from "@/types/inventory";
import { PartResponse } from "@/types/part";
import { ServiceCenterResponse } from "@/types/center";
import { getAllInventory, createOrUpdateInventory, updateInventory, deleteInventory } from "@/services/modules/inventoryService";
import { getAllParts } from "@/services/modules/partService";
import { getAllServiceCenters } from "@/services/modules/centerService";
import InventoryForm from "@/parts/InventoryForm";

// Component hiển thị bảng tồn kho
interface InventoryTableProps {
    inventories: InventoryResponse[];
    onEdit: (inv: InventoryResponse) => void;
    onDelete: (id: number) => void;
    lowStockThreshold?: number;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventories, onEdit, onDelete, lowStockThreshold = 10 }) => {
    const getStockStatus = (amount: number) => {
        if (amount <= 0) return { label: "Hết hàng", color: "bg-red-100 text-red-800" };
        if (amount <= lowStockThreshold) return { label: "Sắp hết", color: "bg-orange-100 text-orange-800" };
        return { label: "Đủ", color: "bg-green-100 text-green-800" };
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Linh kiện</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Trung tâm</th>
                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-blue-800">Số lượng</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Ngày nhập</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-blue-800">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {inventories.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                                Không có bản ghi tồn kho nào.
                            </td>
                        </tr>
                    ) : (
                        inventories.map((inv) => {
                            const status = getStockStatus(inv.amount);
                            return (
                                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{inv.id}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="font-medium text-gray-900">{inv.partName}</div>
                                        <div className="text-gray-500 text-xs">#{inv.partNumber}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{inv.centerName}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900">{inv.amount.toLocaleString('vi-VN')}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{inv.invoiceDate}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center space-x-2">
                                        <button
                                            onClick={() => onEdit(inv)}
                                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold p-1 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => onDelete(inv.id)}
                                            className="text-red-600 hover:text-red-800 text-xs font-semibold p-1 hover:bg-red-50 rounded transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default function SupplyChainPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [inventories, setInventories] = useState<InventoryResponse[]>([]);
    const [parts, setParts] = useState<PartResponse[]>([]);
    const [centers, setCenters] = useState<ServiceCenterResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState<InventoryResponse | null>(null);
    
    // Filters
    const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null);
    const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
    const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);

    const allowedRoles = ["Admin", "EVM_Staff"];

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedRoles.includes(user.role)) { router.push("/"); return; }
        
        loadData();
    }, [isAuthenticated, user, router]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [inventoryData, partsData, centersData] = await Promise.all([
                getAllInventory(),
                getAllParts(),
                getAllServiceCenters(),
            ]);
            setInventories(inventoryData);
            setParts(partsData);
            setCenters(centersData);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            setToast("Không thể tải dữ liệu tồn kho.");
        } finally {
            setIsLoading(false);
        }
    };

    // Lọc dữ liệu
    const filteredInventories = useMemo(() => {
        let filtered = inventories;

        // Lọc theo trung tâm
        if (selectedCenterId) {
            filtered = filtered.filter(inv => inv.centerId === selectedCenterId);
        }

        // Lọc theo linh kiện
        if (selectedPartId) {
            filtered = filtered.filter(inv => inv.partId === selectedPartId);
        }

        // Lọc theo cảnh báo thiếu hụt
        if (showLowStockOnly) {
            filtered = filtered.filter(inv => inv.amount <= lowStockThreshold);
        }

        return filtered;
    }, [inventories, selectedCenterId, selectedPartId, showLowStockOnly, lowStockThreshold]);

    // Lấy danh sách cảnh báo thiếu hụt
    const lowStockAlerts = useMemo(() => {
        return inventories.filter(inv => inv.amount <= lowStockThreshold);
    }, [inventories, lowStockThreshold]);

    const handleSave = async (payload: InventoryRequest) => {
        try {
            if (payload.id) {
                await updateInventory(payload.id, payload);
                setToast("Cập nhật tồn kho thành công!");
            } else {
                await createOrUpdateInventory(payload);
                setToast("Phân bổ phụ tùng thành công!");
            }
            await loadData();
            setIsModalOpen(false);
            setEditingInventory(null);
        } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.message 
                ? err.response.data.message 
                : "Lỗi khi lưu tồn kho.";
            throw new Error(errorMessage);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa bản ghi tồn kho này?")) return;
        try {
            await deleteInventory(id);
            setToast("Đã xóa bản ghi tồn kho thành công.");
            await loadData();
        } catch {
            setToast("Lỗi khi xóa bản ghi tồn kho.");
        }
    };

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    if (isLoading || !user) return <Layout><p>Đang tải dữ liệu...</p></Layout>;

    return (
        <Layout>
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Chuỗi Cung ứng Phụ tùng Bảo hành</h1>
                <p className="text-gray-600 mt-1">Quản lý tồn kho phụ tùng, phân bổ cho trung tâm dịch vụ và cảnh báo thiếu hụt</p>
            </div>

            {/* Cảnh báo thiếu hụt */}
            {lowStockAlerts.length > 0 && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-semibold text-orange-800">
                                Cảnh báo: {lowStockAlerts.length} linh kiện sắp hết hàng (≤ {lowStockThreshold})
                            </h3>
                            <div className="mt-2 text-sm text-orange-700">
                                {lowStockAlerts.slice(0, 5).map(alert => (
                                    <div key={alert.id} className="mt-1">
                                        • {alert.partName} tại {alert.centerName}: {alert.amount.toLocaleString('vi-VN')} (còn lại)
                                    </div>
                                ))}
                                {lowStockAlerts.length > 5 && (
                                    <div className="mt-1 font-semibold">... và {lowStockAlerts.length - 5} linh kiện khác</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bộ lọc và nút thêm */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Lọc theo Trung tâm</label>
                        <select
                            value={selectedCenterId || ''}
                            onChange={(e) => setSelectedCenterId(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500"
                        >
                            <option value="">Tất cả Trung tâm</option>
                            {centers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Lọc theo Linh kiện</label>
                        <select
                            value={selectedPartId || ''}
                            onChange={(e) => setSelectedPartId(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500"
                        >
                            <option value="">Tất cả Linh kiện</option>
                            {parts.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (#{p.partNumber})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ngưỡng cảnh báo</label>
                        <input
                            type="number"
                            min="0"
                            value={lowStockThreshold}
                            onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showLowStockOnly}
                                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">Chỉ hiển thị sắp hết</span>
                        </label>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Hiển thị <strong>{filteredInventories.length}</strong> / {inventories.length} bản ghi
                    </div>
                    <button
                        onClick={() => { setEditingInventory(null); setIsModalOpen(true); }}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
                    >
                        + Phân bổ Phụ tùng
                    </button>
                </div>
            </div>

            {/* Bảng tồn kho */}
            <InventoryTable
                inventories={filteredInventories}
                onEdit={(inv) => { setEditingInventory(inv); setIsModalOpen(true); }}
                onDelete={handleDelete}
                lowStockThreshold={lowStockThreshold}
            />

            {/* Modal tạo/cập nhật */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                        <InventoryForm
                            initialData={editingInventory}
                            onSubmit={handleSave}
                            onClose={() => { setIsModalOpen(false); setEditingInventory(null); }}
                        />
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 z-50 cursor-pointer hover:bg-green-700 flex items-center gap-3"
                    onClick={() => setToast(null)}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{toast}</span>
                </div>
            )}
        </Layout>
    );
}

