// frontend/src/pages/admin/parts.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Trang này chỉ dùng để redirect đến trang Parts chung
export default function AdminPartsPage() {
    const router = useRouter();
    useEffect(() => {
        if (router.pathname.startsWith('/admin/parts')) {
            router.replace('/parts'); 
        }
    }, [router]);
    
    return (
        <div className="py-20 text-center">
            <p>Đang chuyển hướng đến trang Quản lý Linh kiện & Tồn kho...</p>
        </div>
    );
}