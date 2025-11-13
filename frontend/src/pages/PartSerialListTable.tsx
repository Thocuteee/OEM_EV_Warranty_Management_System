// src/pages/PartSerialListTable.tsx

import React, { useState, useEffect } from 'react';
import { getPartSerials } from '../services/warrantyApi';

// 1. Định nghĩa kiểu dữ liệu (dựa trên PartSerialResponse DTO)
interface PartSerial {
    partSerialId: number; 
    partId: number;       
    serialNumber: string; 
    dateReceived: string; 
}

const PartSerialListTable: React.FC = () => {
    // 2. State
    const [partSerials, setPartSerials] = useState<PartSerial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 3. Gọi API
    useEffect(() => {
        const fetchPartSerials = async () => {
            try {
                setLoading(true);
                // Gọi GET /api/part-serials
                const data = await getPartSerials();
                setPartSerials(data);
                setError(null);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchPartSerials();
    }, []);

    // 4. Render
    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div>
            <h2>Phụ Tùng Theo Serial</h2>
            <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID Serial</th>
                        <th>ID Linh Kiện (Part)</th>
                        <th>Số Serial</th>
                        <th>Ngày nhận</th>
                    </tr>
                </thead>
                <tbody>
                    {partSerials.length > 0 ? (
                        partSerials.map(serial => (
                            <tr key={serial.partSerialId}>
                                <td>{serial.partSerialId}</td>
                                <td>{serial.partId}</td>
                                <td>{serial.serialNumber}</td>
                                <td>{new Date(serial.dateReceived).toLocaleDateString()}</td>
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

export default PartSerialListTable;