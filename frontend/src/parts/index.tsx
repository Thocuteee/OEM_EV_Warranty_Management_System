// frontend/src/parts/index.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import axios from "axios"; 
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

// Import types cần thiết
import { PartRequest, PartResponse } from "@/types/part"; 
import { PartSerialRequest, PartSerialResponse } from "@/types/partSerial"; 
// [MỚI] Import Inventory Types
import { InventoryRequest, InventoryResponse } from "@/types/inventory";

// Import Service functions
import { getAllParts, createPart, updatePart, deletePart } from "@/services/modules/partService";
import { getAllPartSerials, createPartSerial, updatePartSerial, deletePartSerial } from "@/services/modules/partSerialService";
// [MỚI] Import Inventory Service
import { getAllInventory, createOrUpdateInventory, updateInventory, deleteInventory } from "@/services/modules/inventoryService";


// Import Form Components
import PartForm from "@/parts/PartForm"; 
import PartSerialForm from "@/parts/PartSerialForm"; 
// [MỚI] Import Inventory Components
import InventoryTable from "./InventoryTable"; 
import InventoryForm from "./InventoryForm"; 


// Dùng types đã được import
type PartRequestPayload = PartRequest;
type PartResponseInterface = PartResponse;
type PartSerialRequestPayload = PartSerialRequest;
type PartSerialResponseInterface = PartSerialResponse;


// ---------------------------------------
// Component: PartTable (Giữ nguyên)
// ---------------------------------------
const PartTable: React.FC<{parts: PartResponseInterface[], onEdit: (p: PartResponseInterface) => void, onDelete: (id: number) => void, canModify: boolean}> = ({ parts, onEdit, onDelete, canModify }) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Tên Linh kiện</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Part Number</th>
                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-blue-800">Giá (VND)</th>
                        {canModify && <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Thao tác</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {parts.length === 0 ? (
                        <tr>
                            <td colSpan={canModify ? 5 : 4} className="px-4 py-10 text-center text-gray-500">
                                Không có linh kiện nào.
                            </td>
                        </tr>
                    ) : (
                        parts.map((p) => (
                            <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{p.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{p.name}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-700">{p.partNumber}</td>
                                <td className="px-4 py-3 text-sm font-medium text-right text-green-700">{p.price.toLocaleString('vi-VN')}</td>
                                {canModify && (
                                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                                        <button 
                                            onClick={() => onEdit(p)} 
                                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold mr-2 p-1 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            onClick={() => onDelete(p.id)} 
                                            className="text-red-600 hover:text-red-800 text-xs font-semibold p-1 hover:bg-red-50 rounded transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// ---------------------------------------
// Component: PartSerialTable (Giữ nguyên)
// ---------------------------------------
const PartSerialTable: React.FC<{serials: PartSerialResponseInterface[], onEdit: (p: PartSerialResponseInterface) => void, onDelete: (id: number) => void, canModify: boolean}> = ({ serials, onEdit, onDelete, canModify }) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">Serial Number</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">Linh kiện Gốc (Part No)</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">Ngày Nhận</th>
                        {canModify && <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-green-800">Thao tác</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {serials.length === 0 ? (
                        <tr>
                            <td colSpan={canModify ? 5 : 4} className="px-4 py-10 text-center text-gray-500">
                                Không có serial nào.
                            </td>
                        </tr>
                    ) : (
                        serials.map((s) => (
                            <tr key={s.id} className="hover:bg-green-50/50 transition-colors">
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">{s.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-700 font-mono">{s.serialNumber}</td>
                                <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                    <span className="truncate block max-w-xs">{s.partName}</span>
                                    <span className="text-gray-500 text-xs">({s.partNumber})</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                    {s.dateReceived ? new Date(s.dateReceived).toLocaleDateString('vi-VN') : 'N/A'}
                                </td>
                                {canModify && (
                                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                                        <button 
                                            onClick={() => onEdit(s)} 
                                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold mr-2 p-1 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            onClick={() => onDelete(s.id)} 
                                            className="text-red-600 hover:text-red-800 text-xs font-semibold p-1 hover:bg-red-50 rounded transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);


export default function PartsPage() { 
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [parts, setParts] = useState<PartResponseInterface[]>([]);
    const [serials, setSerials] = useState<PartSerialResponseInterface[]>([]);
    // [MỚI] State cho Inventory Records
    const [inventory, setInventory] = useState<InventoryResponse[]>([]); 
    
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    
    const [isPartModalOpen, setIsPartModalOpen] = useState(false);
    const [editingPart, setEditingPart] = useState<PartResponseInterface | null>(null);
    const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
    const [editingSerial, setEditingSerial] = useState<PartSerialResponseInterface | null>(null);
    // [MỚI] State cho Inventory Modal
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState<InventoryResponse | null>(null);


    // [MỚI] Thêm tab Inventory
    const [activeTab, setActiveTab] = useState<'parts' | 'serials' | 'inventory'>('parts');

    const allowedViewRoles = ["Admin", "EVM_Staff", "SC_Staff", "SC_Technician"];
    // Chỉ Admin/EVM Staff có thể quản lý Part/Serial/Inventory
    const canModify = user?.role === "Admin" || user?.role === "EVM_Staff";

    useEffect(() => {
        // Bảo vệ route: Tất cả các vai trò nghiệp vụ đều được truy cập
        if (!isAuthenticated) { router.push("/login"); return; }
        if (user && !allowedViewRoles.includes(user.role)) { router.push("/"); return; }
        
        loadData();
    }, [isAuthenticated, user, router]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // [CẬP NHẬT] Thêm getAllInventory()
            const [partsData, serialsData, inventoryData] = await Promise.all([
                getAllParts(),
                getAllPartSerials(),
                getAllInventory(), 
            ]);
            setParts(partsData);
            setSerials(serialsData);
            setInventory(inventoryData); 
        } catch(err) {
            console.error("Lỗi tải dữ liệu:", err);
            setToast("Không thể tải danh sách Linh kiện/Serial/Tồn kho.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Handlers (Part / Serial - Giữ nguyên) ---
    const handleSavePart = async (payload: PartRequestPayload) => {
        try {
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
    
    // --- Handlers (Inventory - MỚI) ---
    const handleSaveInventory = async (payload: InventoryRequest) => {
        try {
            if (payload.id) {
                await updateInventory(payload.id, payload);
                setToast("Cập nhật Tồn kho thành công!");
            } else {
                // Sử dụng API tạo/cập nhật chung (Upsert logic ở backend)
                await createOrUpdateInventory(payload); 
                setToast("Thêm/Cập nhật Tồn kho thành công!");
            }
            await loadData(); 
            setIsInventoryModalOpen(false);
            setEditingInventory(null);
        } catch(err: unknown) {
             const errorMessage = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Lỗi khi lưu Tồn kho. Kiểm tra Part/Center ID.";
             throw new Error(errorMessage);
        }
    };
    
    const handleDeleteInventory = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa Bản ghi tồn kho này?")) return;
        try {
            await deleteInventory(id);
            setToast("Đã xóa Bản ghi tồn kho thành công.");
            await loadData();
        } catch {
            setToast("Lỗi khi xóa Bản ghi tồn kho.");
        }
    };
    // --- End Handlers ---

    const filteredParts = useMemo(() => {
        if (!parts || parts.length === 0) return [];
        const keyword = searchKeyword.toLowerCase();
        return parts.filter(p => {
            if (!p) return false;
            const name = p.name?.toLowerCase() || '';
            const partNumber = p.partNumber?.toLowerCase() || '';
            return name.includes(keyword) || partNumber.includes(keyword);
        });
    }, [parts, searchKeyword]);

    const filteredSerials = useMemo(() => {
        if (!serials || serials.length === 0) return [];
        const keyword = searchKeyword.toLowerCase();
        return serials.filter(s => {
            if (!s) return false;
            const serialNumber = s.serialNumber?.toLowerCase() || '';
            const partName = s.partName?.toLowerCase() || '';
            return serialNumber.includes(keyword) || partName.includes(keyword);
        });
    }, [serials, searchKeyword]);

    // [MỚI] Lọc Inventory
    const filteredInventory = useMemo(() => {
        if (!inventory || inventory.length === 0) return [];
        const keyword = searchKeyword.toLowerCase();
        return inventory.filter(i => {
            if (!i) return false;
            const partName = i.partName?.toLowerCase() || '';
            const centerName = i.centerName?.toLowerCase() || '';
            return partName.includes(keyword) || centerName.includes(keyword);
        });
    }, [inventory, searchKeyword]);
    
    
    if (isLoading || !user) return <Layout><p>Đang tải dữ liệu...</p></Layout>;

    return (
        <Layout>
            {/* Header section with enhanced style */}
            <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Linh kiện & Tồn kho</h1>
                <p className="text-gray-600 mt-1">Quản lý danh mục linh kiện gốc, theo dõi từng số Serial và số lượng tồn kho tại các trung tâm.</p>
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
                 {/* [MỚI] Tab Tồn kho */}
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`pb-2 font-semibold text-lg transition-colors ${activeTab === 'inventory' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500 hover:text-yellow-500'}`}
                >
                    Tồn kho Chi tiết ({inventory.length})
                </button>
            </div>

            {/* Search + Button */}
            <div className="flex justify-between items-center mb-6">
                <input 
                    placeholder={activeTab === 'parts' ? "Tìm theo Tên, Part Number..." : activeTab === 'serials' ? "Tìm theo Serial Number..." : "Tìm theo Part Name, Center..."}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                {/* Nút thêm mới theo Tab */}
                {canModify && activeTab === 'parts' ? (
                    <button
                        onClick={() => { setEditingPart(null); setIsPartModalOpen(true); }}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
                    >
                        + Thêm Linh kiện
                    </button>
                ) : canModify && activeTab === 'serials' ? (
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
                ) : canModify && activeTab === 'inventory' ? ( // [MỚI] Nút Thêm Tồn kho
                    <button
                        onClick={() => { 
                            if (parts.length === 0) {
                                setToast("Vui lòng thêm Linh kiện gốc và Trung tâm dịch vụ trước.");
                            } else {
                                setEditingInventory(null);
                                setIsInventoryModalOpen(true);
                            }
                        }}
                        className="bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                        disabled={parts.length === 0}
                    >
                        + Thêm Tồn kho
                    </button>
                ) : (
                    <div className="w-1/3 text-right">
                        <span className="text-sm text-gray-500">Chỉ Admin/EVM Staff có thể thay đổi.</span>
                    </div>
                )}
            </div>

            {/* Bảng dữ liệu */}
            {activeTab === 'parts' && (
                <PartTable
                    parts={filteredParts}
                    onEdit={(p) => { setEditingPart(p); setIsPartModalOpen(true); }}
                    onDelete={handleDeletePart}
                    canModify={canModify}
                />
            )}
            {activeTab === 'serials' && (
                <PartSerialTable
                    serials={filteredSerials}
                    onEdit={(s) => { 
                        setEditingSerial(s); 
                        setIsSerialModalOpen(true); 
                    }}
                    onDelete={handleDeleteSerial}
                    canModify={canModify}
                />
            )}
            {/* [MỚI] Bảng Inventory */}
            {activeTab === 'inventory' && (
                <InventoryTable
                    inventoryRecords={filteredInventory}
                    onEdit={(r) => { setEditingInventory(r); setIsInventoryModalOpen(true); }}
                    onDelete={handleDeleteInventory}
                    canModify={canModify}
                />
            )}
            
            {/* Modal tạo/cập nhật Linh kiện (Giữ nguyên) */}
            {isPartModalOpen && canModify && (
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

            {/* Modal tạo/cập nhật Part Serial (Giữ nguyên) */}
            {isSerialModalOpen && canModify && (
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
            
            {/* [MỚI] Modal tạo/cập nhật Inventory */}
            {isInventoryModalOpen && canModify && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
                        <InventoryForm
                            initialData={editingInventory}
                            onSubmit={handleSaveInventory}
                            onClose={() => { setIsInventoryModalOpen(false); setEditingInventory(null); }}
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
        </Layout>
    );
}