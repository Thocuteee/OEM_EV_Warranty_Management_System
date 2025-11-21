// frontend/src/pages/admin/parts.tsx (PHIÊN BẢN CÓ STYLE)
"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

// Import types cần thiết
import { PartRequest, PartResponse } from "@/types/part"; 
import { PartSerialRequest, PartSerialResponse } from "@/types/partSerial"; 

// Import Service functions
import { getAllParts, createPart, updatePart, deletePart } from "@/services/modules/partService";
import { getAllPartSerials, createPartSerial, updatePartSerial, deletePartSerial } from "@/services/modules/partSerialService";

// Import Form Components
import PartForm from "@/parts/PartForm"; 
import PartSerialForm from "@/parts/PartSerialForm"; 


// Dùng types đã được import (loại bỏ Interface nội bộ)
type PartRequestPayload = PartRequest;
type PartResponseInterface = PartResponse;
type PartSerialRequestPayload = PartSerialRequest;
type PartSerialResponseInterface = PartSerialResponse;


// ---------------------------------------
// Component: PartTable (Styled)
// ---------------------------------------
const PartTable: React.FC<{parts: PartResponseInterface[], onEdit: (p: PartResponseInterface) => void, onDelete: (id: number) => void}> = ({ parts, onEdit, onDelete }) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Tên Linh kiện</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Part Number</th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-blue-800">Giá (VND)</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Thao tác</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {parts.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{p.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{p.name}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">{p.partNumber}</td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-green-700">{p.price.toLocaleString('vi-VN')}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <button onClick={() => onEdit(p)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold mr-2 p-1">Sửa</button>
                            <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold p-1">Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ---------------------------------------
// Component: PartSerialTable (Styled)
// ---------------------------------------
const PartSerialTable: React.FC<{serials: PartSerialResponseInterface[], onEdit: (p: PartSerialResponseInterface) => void, onDelete: (id: number) => void}> = ({ serials, onEdit, onDelete }) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">Serial Number</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">Linh kiện Gốc (Part No)</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">Ngày Nhận</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">Thao tác</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {serials.map((s) => (
                    <tr key={s.id} className="hover:bg-green-50/50 transition-colors">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{s.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-mono">{s.serialNumber}</td>
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{s.partName} <span className="text-gray-500">({s.partNumber})</span></td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.dateReceived}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <button onClick={() => onEdit(s)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold mr-2 p-1">Sửa</button>
                            <button onClick={() => onDelete(s.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold p-1">Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export default function AdminPartsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [parts, setParts] = useState<PartResponseInterface[]>([]);
    const [serials, setSerials] = useState<PartSerialResponseInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    
    const [isPartModalOpen, setIsPartModalOpen] = useState(false);
    const [editingPart, setEditingPart] = useState<PartResponseInterface | null>(null);
    const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
    const [editingSerial, setEditingSerial] = useState<PartSerialResponseInterface | null>(null);

    const [activeTab, setActiveTab] = useState<'parts' | 'serials'>('parts');

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && user.role !== "Admin" && user.role !== "EVM_Staff") { router.push("/"); return; }
        
        loadData();
    }, [isAuthenticated, user, router]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [partsData, serialsData] = await Promise.all([
                getAllParts(),
                getAllPartSerials(),
            ]);
            setParts(partsData);
            setSerials(serialsData);
        } catch(err) {
            console.error("Lỗi tải dữ liệu:", err);
            setToast("Không thể tải danh sách Linh kiện/Serial.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Handlers (Logic không đổi) ---
    const handleSavePart = async (payload: PartRequestPayload) => {
        try {
            // Logic lưu đã được kiểm tra là OK
            if (payload.id) {
                await updatePart(payload.id, payload);
                setToast("Cập nhật Linh kiện thành công!");
            } else {
                await createPart(payload);
                setToast("Thêm Linh kiện thành công!");
            }
            await loadData(); 
            setIsPartModalOpen(false);
            setEditingPart(null);
        } catch(err: unknown) {
             const errorMessage = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Lỗi khi lưu Linh kiện.";
             throw new Error(errorMessage);
        }
    };
    
    const handleDeletePart = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa Linh kiện này? (Chỉ xóa nếu không có Serial hoặc Claim liên quan)")) return;
        try {
            await deletePart(id);
            setToast("Đã xóa Linh kiện thành công.");
            await loadData();
        } catch {
            setToast("Lỗi khi xóa Linh kiện. Đảm bảo không có liên kết FK.");
        }
    };
    
    const handleSaveSerial = async (payload: PartSerialRequestPayload) => {
        try {
            // Logic lưu đã được kiểm tra là OK
            if (payload.id) {
                await updatePartSerial(payload.id, payload);
                setToast("Cập nhật Serial thành công!");
            } else {
                await createPartSerial(payload);
                setToast("Thêm Serial mới thành công!");
            }
            await loadData(); 
            setIsSerialModalOpen(false);
            setEditingSerial(null);
        } catch(err: unknown) {
             const errorMessage = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Lỗi khi lưu Serial.";
             throw new Error(errorMessage);
        }
    };
    
    const handleDeleteSerial = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa Serial này?")) return;
        try {
            await deletePartSerial(id);
            setToast("Đã xóa Serial thành công.");
            await loadData();
        } catch {
            setToast("Lỗi khi xóa Serial. Đảm bảo không có liên kết FK.");
        }
    };
    // --- End Handlers ---

    const filteredParts = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();
        return parts.filter(p => 
            p.name.toLowerCase().includes(keyword) || 
            p.partNumber.toLowerCase().includes(keyword)
        );
    }, [parts, searchKeyword]);

    const filteredSerials = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();
        return serials.filter(s => 
            s.serialNumber.toLowerCase().includes(keyword) || 
            s.partName.toLowerCase().includes(keyword)
        );
    }, [serials, searchKeyword]);
    
    
    if (isLoading || !user) return <AdminLayout><p>Đang tải dữ liệu...</p></AdminLayout>;

    return (
        <AdminLayout>
            {/* Header section with enhanced style */}
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Linh kiện & Serial</h1>
                <p className="text-gray-600 mt-1">Quản lý danh mục linh kiện gốc (Part) và theo dõi từng số Serial (Part Serial) nhập kho.</p>
            </div>
            
            {/* Tab Selector */}
            <div className="flex border-b mb-6 space-x-6">
                <button 
                    onClick={() => setActiveTab('parts')}
                    className={`pb-2 font-semibold text-lg transition-colors ${activeTab === 'parts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                >
                    Danh mục Linh kiện ({parts.length})
                </button>
                <button 
                    onClick={() => setActiveTab('serials')}
                    className={`pb-2 font-semibold text-lg transition-colors ${activeTab === 'serials' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
                >
                    Serial Linh kiện ({serials.length})
                </button>
            </div>

            {/* Search + Button */}
            <div className="flex justify-between items-center mb-6">
                <input 
                    placeholder={activeTab === 'parts' ? "Tìm theo Tên, Part Number..." : "Tìm theo Serial Number..."}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                {/* Nút thêm mới theo Tab */}
                {activeTab === 'parts' ? (
                    <button
                        onClick={() => { setEditingPart(null); setIsPartModalOpen(true); }}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
                    >
                        + Thêm Linh kiện
                    </button>
                ) : (
                    <button
                        onClick={() => { 
                            if (parts.length === 0) {
                                setToast("Vui lòng thêm Linh kiện gốc trước.");
                            } else {
                                setEditingSerial(null); 
                                setIsSerialModalOpen(true); 
                            }
                        }}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        disabled={parts.length === 0}
                    >
                        + Thêm Serial
                    </button>
                )}
            </div>

            {/* Bảng dữ liệu */}
            {activeTab === 'parts' ? (
                <PartTable
                    parts={filteredParts}
                    onEdit={(p) => { setEditingPart(p); setIsPartModalOpen(true); }}
                    onDelete={handleDeletePart}
                />
            ) : (
                <PartSerialTable
                    serials={filteredSerials}
                    onEdit={(s) => { 
                        setEditingSerial(s); 
                        setIsSerialModalOpen(true); 
                    }}
                    onDelete={handleDeleteSerial}
                />
            )}
            
            {/* Modal tạo/cập nhật Linh kiện */}
            {isPartModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                        <PartForm
                            initialData={editingPart}
                            onSubmit={handleSavePart}
                            onClose={() => { setIsPartModalOpen(false); setEditingPart(null); }}
                        />
                    </div>
                </div>
            )}

            {/* Modal tạo/cập nhật Part Serial */}
            {isSerialModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                        <PartSerialForm
                            availableParts={parts.map(p => ({ id: p.id, name: p.name, partNumber: p.partNumber }))} 
                            initialData={editingSerial}
                            onSubmit={handleSaveSerial}
                            onClose={() => { setIsSerialModalOpen(false); setEditingSerial(null); }}
                        />
                    </div>
                </div>
            )}


            {/* Toast thông báo */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg transition-opacity duration-300">
                    {toast}
                </div>
            )}
        </AdminLayout>
    );
}