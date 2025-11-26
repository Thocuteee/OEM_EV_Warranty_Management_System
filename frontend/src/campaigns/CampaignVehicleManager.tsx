// frontend/src/campaigns/CampaignVehicleManager.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CampaignVehicleResponse, CampaignVehicleRequest } from '@/types/campaignVehicle';
import { VehicleResponse } from '@/types/vehicle';
import { RecallCampaignResponse } from '@/types/campaign';
import { getVehicleByVIN } from '@/services/modules/vehicleService'; 
import { addVehicleToCampaign, getCampaignVehiclesByCampaignId, removeVehicleFromCampaign } from '@/services/modules/campaignVehicleService';
import axios from 'axios';

interface CampaignVehicleManagerProps {
    campaign: RecallCampaignResponse;
    onClose: () => void;
}

const CampaignVehicleManager: React.FC<CampaignVehicleManagerProps> = ({ campaign, onClose }) => {
    const [vehicles, setVehicles] = useState<CampaignVehicleResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    
    // State cho việc thêm xe mới
    const [vinToSearch, setVinToSearch] = useState('');
    const [searchResult, setSearchResult] = useState<VehicleResponse | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const campaignId = campaign.id;

    const loadVehicles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCampaignVehiclesByCampaignId(campaignId);
            setVehicles(data);
        } catch (e) {
            setError("Lỗi tải danh sách xe trong chiến dịch.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [campaignId]);

    useEffect(() => {
        loadVehicles();
    }, [loadVehicles]);
    
    // Hàm tìm kiếm xe theo VIN
    const handleSearchVIN = async () => {
        if (!vinToSearch.trim()) return;
        setSearchLoading(true);
        setSearchResult(null);
        setError(null);
        
        try {
            // API getVehicleByVIN trả về một VehicleResponse (object đơn), không phải mảng
            const vehicle = await getVehicleByVIN(vinToSearch.trim());
            
            if (vehicle && vehicle.id) {
                // Kiểm tra xem xe đã có trong danh sách chưa
                const isAlreadyInCampaign = vehicles.some(v => v.vehicleId === vehicle.id && v.campaignId === campaignId);
                
                if (isAlreadyInCampaign) {
                    setError(`Xe VIN ${vehicle.vin} đã có trong Chiến dịch này.`);
                    setSearchResult(null);
                } else {
                    setSearchResult(vehicle);
                }
            } else {
                setError(`Không tìm thấy xe nào với VIN: ${vinToSearch.trim()}`);
            }
        } catch (e: unknown) {
            let errorMessage = 'Không tìm thấy xe với VIN này.';
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 404) {
                    errorMessage = `Không tìm thấy xe nào với VIN: ${vinToSearch.trim()}`;
                } else {
                    errorMessage = e.response?.data?.message || 'Lỗi tìm kiếm xe.';
                }
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }
            setError(errorMessage);
        } finally {
            setSearchLoading(false);
        }
    };
    
    // Hàm thêm xe vào Campaign
    const handleAddVehicle = async () => {
        if (!searchResult) return;
        
        const payload: CampaignVehicleRequest = {
            campaignId: campaignId,
            vehicleId: searchResult.id,
            status: 'PENDING', // Mặc định status khi thêm xe vào campaign
        };

        setIsLoading(true);
        setError(null);
        setToast(null);
        try {
            await addVehicleToCampaign(payload);
            setToast(`Đã thêm xe VIN ${searchResult.vin} vào Chiến dịch!`);
            setSearchResult(null);
            setVinToSearch('');
            await loadVehicles();
            // Tự động ẩn toast sau 3 giây
            setTimeout(() => setToast(null), 3000);
        } catch (e: unknown) {
            let errorMessage = 'Lỗi thêm xe vào chiến dịch.';
            if (axios.isAxiosError(e)) {
                if (e.response) {
                    const status = e.response.status;
                    const responseData = e.response.data;
                    
                    if (status === 400) {
                        // Xử lý validation errors từ backend
                        if (typeof responseData === 'object' && responseData !== null) {
                            if ('message' in responseData) {
                                errorMessage = (responseData as { message?: string }).message || 'Dữ liệu không hợp lệ.';
                            } else {
                                // Validation errors dạng Map
                                const errorMessages: string[] = [];
                                Object.keys(responseData).forEach(field => {
                                    const msg = (responseData as Record<string, string>)[field];
                                    if (msg) {
                                        errorMessages.push(`${field}: ${msg}`);
                                    }
                                });
                                errorMessage = errorMessages.length > 0 
                                    ? errorMessages.join(', ') 
                                    : 'Dữ liệu không hợp lệ. Xe có thể đã tồn tại trong chiến dịch.';
                            }
                        } else {
                            errorMessage = 'Dữ liệu không hợp lệ. Xe có thể đã tồn tại trong chiến dịch.';
                        }
                    } else if (status >= 500) {
                        // Server errors
                        if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
                            errorMessage = (responseData as { message?: string }).message || 'Lỗi máy chủ. Vui lòng thử lại sau.';
                        } else {
                            errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                        }
                    } else {
                        errorMessage = (responseData as { message?: string })?.message || errorMessage;
                    }
                } else if (e.request) {
                    errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
                } else {
                    errorMessage = e.message || errorMessage;
                }
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Hàm xóa xe khỏi Campaign
    const handleRemoveVehicle = async (campaignId: number, vehicleId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa xe này khỏi Chiến dịch?")) return;
        
        setIsLoading(true);
        setError(null);
        setToast(null);
        try {
            await removeVehicleFromCampaign(campaignId, vehicleId);
            setToast("Đã xóa xe khỏi Chiến dịch thành công!");
            await loadVehicles();
            // Tự động ẩn toast sau 3 giây
            setTimeout(() => setToast(null), 3000);
        } catch (e: unknown) {
            let errorMessage = 'Lỗi xóa xe khỏi chiến dịch.';
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 404) {
                    errorMessage = 'Không tìm thấy xe trong chiến dịch này.';
                } else {
                    errorMessage = e.response?.data?.message || errorMessage;
                }
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
                Quản lý Xe trong Chiến dịch: {campaign.title}
            </h2>
            <p className="text-sm text-gray-600">Ngày hiệu lực: {campaign.startDate} - {campaign.endDate}</p>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            {/* Phần 1: Thêm xe mới */}
            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                <h3 className="font-semibold text-lg text-gray-800">Thêm Xe vào Chiến dịch</h3>
                <div className="flex space-x-3">
                    <input 
                        type="text"
                        placeholder="Nhập VIN của xe cần thêm"
                        className="flex-grow border rounded-lg px-3 py-2 text-sm"
                        value={vinToSearch}
                        onChange={(e) => { setVinToSearch(e.target.value.toUpperCase()); setSearchResult(null); setError(null); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchVIN()}
                        disabled={isLoading || searchLoading}
                    />
                    <button 
                        onClick={handleSearchVIN}
                        disabled={isLoading || searchLoading || !vinToSearch.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {searchLoading ? 'Đang tìm...' : 'Tìm kiếm VIN'}
                    </button>
                </div>
                
                {searchResult && (
                    <div className="p-3 bg-green-100 border border-green-300 rounded-lg flex justify-between items-center text-sm">
                        <span>
                            **Tìm thấy:** <span className="font-semibold">{searchResult.vin}</span> ({searchResult.model}, Chủ sở hữu: {searchResult.customerName})
                        </span>
                        <button 
                            onClick={handleAddVehicle}
                            disabled={isLoading}
                            className="bg-green-600 text-white px-3 py-1 text-xs rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Đang thêm...' : 'Xác nhận Thêm'}
                        </button>
                    </div>
                )}
            </div>
            
            {/* Phần 2: Danh sách xe đã gán */}
            <div className="p-4 border rounded-lg bg-white space-y-3">
                <h3 className="font-semibold text-lg text-gray-800">Danh sách Xe trong Chiến dịch ({vehicles.length})</h3>
                
                {isLoading && !vehicles.length ? (
                    <p className="text-gray-500 text-sm">Đang tải danh sách...</p>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">VIN</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vehicles.map((cv) => {
                                    // Create a unique key from campaignId and vehicleId
                                    const uniqueKey = `${cv.campaignId}-${cv.vehicleId}`;
                                    return (
                                        <tr key={uniqueKey}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{cv.vehicleId}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 font-mono">{cv.vehicleVIN || 'N/A'}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{cv.vehicleModel || 'N/A'}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                <button 
                                                    onClick={() => handleRemoveVehicle(cv.campaignId, cv.vehicleId)}
                                                    disabled={isLoading}
                                                    className="text-red-600 hover:text-red-800 text-xs font-semibold"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {vehicles.length === 0 && <p className="p-4 text-center text-gray-500 text-sm">Chưa có xe nào được thêm vào Chiến dịch này.</p>}
                    </div>
                )}
            </div>
            
            <div className="text-right border-t pt-4">
                 <button onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Đóng</button>
            </div>

            {/* Toast */}
            {toast && (
                <div 
                    className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg transition-opacity duration-300 z-50"
                    onClick={() => setToast(null)}
                >
                    {toast}
                </div>
            )}
        </div>
    );
};

export default CampaignVehicleManager;