// src/pages/InventoryListTable.tsx

import React, { useState, useEffect } from 'react';
// Chỉ import hàm, KHÔNG import interface
import { getInventory } from '../services/warrantyApi';

const InventoryListTable: React.FC = () => {
    // Đã bỏ <Inventory[]>
    const [inventory, setInventory] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                const data = await getInventory(); 
                setInventory(data);
                setError(null);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

    return (
        <div>
            <h2>Bảng Tồn Kho (Inventory)</h2>
            <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID Tồn Kho</th>
                        <th>ID Linh Kiện</th>
                        <th>ID Trung Tâm</th>
                        <th>Số lượng</th>
                        <th>Ngày nhập</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.length > 0 ? (
                        // "item" ở đây sẽ có kiểu "any"
                        inventory.map((item: any) => ( 
                            <tr key={item.inventoryId}>
                                <td>{item.inventoryId}</td>
                                <td>{item.partId}</td>
                                <td>{item.centerId}</td>
                                <td>{item.amount}</td>
                                <td>{new Date(item.invoiceDate).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryListTable;