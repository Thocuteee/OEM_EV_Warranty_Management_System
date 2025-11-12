// src/pages/PartListTable.tsx

import React, { useState, useEffect } from 'react';
// Chỉ import hàm, KHÔNG import interface
import { getParts } from '../services/warrantyApi';

const PartListTable: React.FC = () => {
    // Đã bỏ <Part[]>
    const [parts, setParts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchParts = async () => {
            try {
                setLoading(true);
                const data = await getParts(); 
                setParts(data);
                setError(null);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchParts();
    }, []);

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div>
            <h2>Bảng Linh Kiện (Parts)</h2>
            <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Linh Kiện</th>
                        <th>Mã Linh Kiện (Part Number)</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {parts.length > 0 ? (
                        // "part" ở đây sẽ có kiểu "any"
                        parts.map((part: any) => ( 
                            <tr key={part.partId}>
                                <td>{part.partId}</td>
                                <td>{part.name}</td>
                                <td>{part.partNumber}</td>
                                <td>{part.price}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PartListTable;