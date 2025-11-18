// frontend/src/components/layout/MainLayout.tsx

import React from "react";
import Layout from "./Layout";  // NOTE: Mới thêm - Import Layout component đúng (thay vì Sidebar từ "./Layout")

export default function MainLayout({ children }: { children: React.ReactNode }) {  // NOTE: Mới thêm - Nhận props children để wrap nội dung pages
  return <Layout>{children}</Layout>;  // NOTE: Mới thêm - Wrap children bằng Layout component để sử dụng sidebar/navbar chung
}