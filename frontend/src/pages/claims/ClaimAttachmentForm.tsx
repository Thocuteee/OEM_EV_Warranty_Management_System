// frontend/src/claims/ClaimAttachmentForm.tsx
"use client";

import React, { useState } from 'react';
import { ClaimAttachmentRequest } from '@/types/attachment';
import axios from 'axios';

interface ClaimAttachmentFormProps {
    claimId: number;
    onSubmit: (payload: ClaimAttachmentRequest) => Promise<void>;
    onClose: () => void;
}

const typeOptions = ['IMAGE', 'DOCUMENT', 'VIDEO', 'DIAGNOSTIC_REPORT'];

const ClaimAttachmentForm: React.FC<ClaimAttachmentFormProps> = ({ claimId, onSubmit, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formState, setFormState] = useState<ClaimAttachmentRequest>({
        claimId: claimId,
        fileUrl: '',
        type: 'IMAGE',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value,
        } as ClaimAttachmentRequest));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Trim và validate
        const trimmedFileUrl = formState.fileUrl?.trim() || '';
        const trimmedType = formState.type?.trim() || '';

        if (!trimmedFileUrl) {
            setError("Vui lòng nhập URL file.");
            setLoading(false);
            return;
        }

        if (trimmedFileUrl.length > 255) {
            setError("URL file không được vượt quá 255 ký tự.");
            setLoading(false);
            return;
        }

        if (!trimmedFileUrl.startsWith('http://') && !trimmedFileUrl.startsWith('https://')) {
            setError("URL file không hợp lệ. Vui lòng nhập URL bắt đầu bằng http:// hoặc https://");
            setLoading(false);
            return;
        }

        if (!trimmedType || trimmedType === '') {
            setError("Vui lòng chọn loại file.");
            setLoading(false);
            return;
        }

        // Đảm bảo claimId là number
        if (!claimId || isNaN(Number(claimId))) {
            setError("Claim ID không hợp lệ.");
            setLoading(false);
            return;
        }

        try {
            // Tạo payload với dữ liệu đã được trim và validate
            const cleanPayload: ClaimAttachmentRequest = {
                claimId: Number(claimId),
                fileUrl: trimmedFileUrl,
                type: trimmedType,
            };

            await onSubmit(cleanPayload);
            // Nếu thành công, form sẽ được đóng bởi parent component
        } catch (err: unknown) {
            let errorMessage = "Lỗi khi thêm file đính kèm.";
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // Xử lý lỗi validation từ backend
                    if (err.response.status === 400) {
                        const responseData = err.response.data;
                        
                        // Backend trả về Map<String, String> cho validation errors
                        if (typeof responseData === 'object' && responseData !== null) {
                            // Kiểm tra nếu là ErrorResponse (có message field)
                            if ('message' in responseData) {
                                errorMessage = (responseData as { message?: string }).message || 'Dữ liệu không hợp lệ.';
                            } 
                            // Kiểm tra nếu là validation errors Map (field -> message)
                            else {
                                const errorMessages: string[] = [];
                                Object.keys(responseData).forEach(field => {
                                    const msg = (responseData as Record<string, string>)[field];
                                    if (msg) {
                                        errorMessages.push(`${field}: ${msg}`);
                                    }
                                });
                                errorMessage = errorMessages.length > 0 
                                    ? errorMessages.join(', ') 
                                    : 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường.';
                            }
                        } else {
                            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
                        }
                    } else {
                        const apiError = err.response.data as { message?: string, error?: string };
                        errorMessage = apiError.message || apiError.error || errorMessage;
                    }
                } else if (err.request) {
                    errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
                } else {
                    errorMessage = err.message || errorMessage;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            // Không throw lại error để form không bị đóng
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                Thêm File Đính kèm cho Claim #{claimId}
            </h2>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

            {/* File URL */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL File *</label>
                <input
                    name="fileUrl"
                    value={formState.fileUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border rounded-lg px-4 py-2 text-sm focus:border-blue-500"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">Lưu ý: Chỉ chấp nhận URL trực tiếp đến file (chưa hỗ trợ upload file)</p>
            </div>

            {/* Loại File */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Loại File *</label>
                <select
                    name="type"
                    value={formState.type || 'IMAGE'}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 text-sm focus:border-blue-500"
                    required
                >
                    {typeOptions.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Đang thêm...' : 'Thêm File'}
                </button>
            </div>
        </form>
    );
};

export default ClaimAttachmentForm;