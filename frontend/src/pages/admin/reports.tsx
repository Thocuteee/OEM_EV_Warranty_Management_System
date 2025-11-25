// frontend/src/pages/admin/reports.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Trang này chỉ dùng để redirect đến trang Reports chung
export default function AdminReportsPage() {
    const router = useRouter();
    useEffect(() => {
        if (router.pathname.startsWith('/admin/reports')) {
            router.replace('/reports'); 
        }
    }, [router]);
    
    return (
        <div className="py-20 text-center">
            <p>Đang chuyển hướng đến trang Báo cáo Công việc...</p>
        </div>
    );
}