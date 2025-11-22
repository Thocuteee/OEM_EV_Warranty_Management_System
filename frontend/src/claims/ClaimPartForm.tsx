// frontend/src/claims/ClaimPartForm.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ClaimPartRequest, ClaimPartResponse } from '@/types/claimPart'; 
import { PartResponse } from '@/types/part';
import { getAllParts } from '@/services/modules/partService';
import axios from 'axios';

interface ClaimPartFormProps {
    claimId: number;
    initialData?: ClaimPartResponse | null; 
    onSubmit: (payload: ClaimPartRequest) => Promise<void>;
    onClose: () => void;
}

const ClaimPartForm: React.FC<ClaimPartFormProps> = ({ 
    claimId, 
    initialData = null, 
    onSubmit, 
    onClose 
}) => {
    // Chỉ là edit nếu có initialData VÀ claimId khớp (vì là khóa kép)
    const isEditing = initialData && initialData.claimId === claimId;
    const [loading, setLoading] = useState(false);
    const [loadingParts, setLoadingParts] = useState(true);
    const [error, setError] = useState('');
    const [availableParts, setAvailableParts] = useState<PartResponse[]>([]);
    
    // State riêng để theo dõi giá (Lấy từ Part Master)
    const [currentUnitPrice, setCurrentUnitPrice] = useState<number>(initialData?.unitPrice || 0);

    const [formState, setFormState] = useState<ClaimPartRequest>({
        claimId: claimId,
        partId: initialData?.partId || 0,
        quantity: initialData?.quantity || 1,
        unitPrice: initialData?.unitPrice || 0,
        totalPrice: initialData?.totalPrice,
    });
    
    // Tính TotalPrice
    const calculatedTotalPrice = useMemo(() => {
        return formState.quantity * currentUnitPrice;
    }, [formState.quantity, currentUnitPrice]);

    // Load Parts và tính Unit Price
    useEffect(() => {
        const loadParts = async () => {
            try {
                const data = await getAllParts();
                setAvailableParts(data);
                
                if (data.length > 0) {
                    const selectedPart = isEditing 
                        ? data.find(p => p.id === initialData.partId) 
                        : data[0];

                    if (selectedPart) {
                        const price = selectedPart.price;
                        setCurrentUnitPrice(price);
                        
                        if (!isEditing && formState.partId === 0) {
                            setFormState(prev => ({ 
                                ...prev, 
                                partId: selectedPart.id,
                                unitPrice: price,
                            }));
                        } else if (isEditing) {
                            // Khi edit, unitPrice trong FormState phải là giá ban đầu của ClaimPart
                            setFormState(prev => ({ ...prev, unitPrice: initialData.unitPrice }));
                        }
                    }
                }

            } catch (err) {
                console.error("Failed to load parts:", err);
                setError("Không thể tải danh sách Linh kiện.");
            } finally {
                setLoadingParts(false);
            }
        };
        loadParts();
    }, [isEditing, claimId]);
    
    // Cập nhật UnitPrice khi Part ID thay đổi (chỉ cho mode CREATE)
    useEffect(() => {
        if (isEditing) return; // Không thay đổi giá khi EDIT (chỉ update quantity)
        
        const selectedPart = availableParts.find(p => p.id === formState.partId);
        if (selectedPart) {
            setCurrentUnitPrice(selectedPart.price);
        }
    }, [formState.partId, availableParts, isEditing]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newValue: number = 0;

        if (name === 'quantity') {
            newValue = value ? parseInt(value) : 1;
            if (newValue < 1) newValue = 1;
            setFormState(prev => ({ ...prev, quantity: newValue }));
        } else if (name === 'partId') {
            newValue = value ? parseInt(value) : 0;
            setFormState(prev => ({ ...prev, partId: newValue }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        if (!formState.partId || formState.partId === 0) {
            setError("Vui lòng chọn Linh kiện.");
            setLoading(false);
            return;
        }
        
        const payloadToSend: ClaimPartRequest = {
            claimId: claimId,
            partId: formState.partId,
            quantity: formState.quantity,
            // Quan trọng: Luôn gửi UnitPrice ĐƯỢC CHỌN (hoặc giá cũ khi edit)
            unitPrice: isEditing ? initialData.unitPrice : currentUnitPrice, 
            totalPrice: calculatedTotalPrice, 
        };

        try {
            await onSubmit(payloadToSend);
            onClose(); // Đóng modal sau khi thành công
        } catch (err: unknown) {
            let errorMessage = isEditing ? "Lỗi cập nhật Phụ tùng Claim." : "Lỗi thêm Phụ tùng Claim.";
            if (axios.isAxiosError(err) && err.response) {
                const apiError = err.response.data as { message: string, error?: string };
                errorMessage = apiError.message || apiError.error || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const displayUnitPrice = isEditing ? formState.unitPrice : currentUnitPrice;
    const readOnlyInputClass = "w-full border rounded-lg px-4 py-2 text-sm bg-gray-100 font-medium cursor-not-allowed";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                {isEditing ? `Cập nhật Phụ tùng Claim #${claimId}` : `Thêm Phụ tùng cho Claim #${claimId}`}
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            
            {/* Part Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Linh kiện *</label>
                <select
                    name="partId"
                    value={formState.partId || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                    required
                    disabled={isEditing || loadingParts} // Không cho phép đổi Part khi EDIT
                >
                    <option value={0} disabled>-- Chọn Linh kiện --</option>
                    {availableParts.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name} ({p.partNumber})
                        </option>
                    ))}
                </select>
                {loadingParts && <p className="text-xs text-gray-500 mt-1">Đang tải danh sách linh kiện...</p>}
            </div>

            {/* Số lượng & Đơn giá */}
            <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượng *</label>
                    <input 
                        type="number"
                        name="quantity" 
                        value={formState.quantity} 
                        onChange={handleChange} 
                        min="1"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Đơn giá (VND)</label>
                    <input 
                        type="text"
                        value={displayUnitPrice.toLocaleString('vi-VN')} 
                        className={readOnlyInputClass} 
                        disabled 
                    />
                </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tổng cộng (VND)</label>
                    <input 
                        type="text"
                        value={calculatedTotalPrice.toLocaleString('vi-VN')} 
                        className={readOnlyInputClass.replace('bg-gray-100', 'bg-blue-50')}
                        disabled 
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật Phụ tùng' : 'Thêm Phụ tùng')}
                </button>
            </div>
        </form>
    );
};

export default ClaimPartForm;