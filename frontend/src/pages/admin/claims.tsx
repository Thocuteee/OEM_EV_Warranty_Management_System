import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Trang này chỉ dùng để redirect đến trang Claims chung
export default function AdminClaimsPage() {
    const router = useRouter();
    useEffect(() => {
        // Đảm bảo chỉ redirect nếu chưa phải là trang hiện tại
        if (router.pathname.startsWith('/admin/claims')) {
            router.replace('/claims'); 
        }
    }, [router]);
    
    return (
        <div className="py-20 text-center">
            <p>Đang chuyển hướng đến trang Quản lý Yêu cầu Bảo hành...</p>
        </div>
    );
}