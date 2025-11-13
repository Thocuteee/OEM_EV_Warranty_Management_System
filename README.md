# ⚡ OEM EV Warranty Management System ⚡

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?logo=spring)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_15-000000?logo=next.js)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL%20|%20PostgreSQL-4169E1?logo=mysql)](https://www.mysql.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=githubactions)]()

---

## 💡 Giới thiệu Dự án

**OEM EV Warranty Management System** là một hệ thống quản lý bảo hành toàn diện, được thiết kế để số hóa và tối ưu hóa quy trình tiếp nhận, xử lý, phê duyệt, và báo cáo các yêu cầu bảo hành (Warranty Claims) cho các phương tiện xe điện (EV) của nhà sản xuất gốc (OEM).

Hệ thống tập trung vào việc đảm bảo tính minh bạch, chính xác trong việc quản lý chi phí linh kiện, theo dõi lịch sử sửa chữa xe, và quản lý chiến dịch triệu hồi (Recall Campaigns).

## ✨ Tính năng Nổi bật

Dự án được xây dựng dựa trên kiến trúc Microservices/Monolith tinh gọn, cung cấp các module nghiệp vụ chuyên sâu:

* **Quản lý Yêu cầu Bảo hành (Claim Management):**
    * Tạo và chỉnh sửa Claim ở trạng thái **DRAFT** (Bản nháp).
    * Quy trình phê duyệt nhiều bước (PENDING -> SENT -> APPROVED/REJECTED).
* **Quản lý Dữ liệu Xe & Khách hàng:** Đăng ký VIN và liên kết chủ sở hữu.
* **Lịch sử & Tồn kho Linh kiện:**
    * Theo dõi tồn kho phụ tùng tại từng trung tâm dịch vụ (`Inventory`).
    * Ghi nhận lịch sử lắp đặt linh kiện theo Serial Number (`VehiclePartHistory`).
* **Quản lý Công việc (WorkLog):** Kỹ thuật viên ghi lại thời gian thực hiện công việc và ghi chú.
* **Báo cáo & Phân tích:** Phân tích chi phí sửa chữa, số lượng linh kiện hỏng và hiệu suất của kỹ thuật viên.

---

## ⚙️ Công nghệ và Kiến trúc

| Thành phần | Công nghệ | Kiến trúc | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Backend (API)** | **Java 17+/Spring Boot 3**, Spring Security, Spring Data JPA, Lombok | RESTful API (Monolith/Microservices Layered) | Sử dụng BCrypt cho mã hóa mật khẩu. |
| **Database** | MySQL  | JPA (Hibernate 6) | Sơ đồ quan hệ phức tạp (ERD) với Khóa phức hợp. |
| **Frontend (UI)** | **Next.js 15**, TypeScript, React, Tailwind CSS | Giao diện quản trị viên (Admin Dashboard). | Hỗ trợ phân quyền dựa trên Role (SC Staff, EVM Staff, Admin). |

---

## 🚀 Cài đặt và Khởi chạy

### 1. Backend (Spring Boot)

1.  **Cấu hình DB:** Sửa file `backend/warranty/src/main/resources/application.properties` để khớp với thông tin kết nối MySQL/PostgreSQL của bạn.
    > **LƯU Ý:** Đảm bảo `spring.datasource.username` và `password` là chính xác để tránh lỗi `FATAL: password authentication failed` (đã ghi nhận trong errorlog).

2.  **Chạy ứng dụng:**
    ```bash
    cd backend/warranty
    ./mvnw spring-boot:run
    ```
    API sẽ chạy trên cổng `http://localhost:8080`.

### 2. Frontend (Next.js)

1.  **Cài đặt Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

2.  **Khởi chạy Server:**
    ```bash
    npm run dev
    ```
    Ứng dụng sẽ khả dụng tại `http://localhost:3000`.

---

## 👤 Vai trò Người dùng (Actors)

Hệ thống phân quyền nghiêm ngặt dựa trên vai trò:

* `Admin`: Quản lý hệ thống, quản trị người dùng.
* `EVM_Staff`: Phê duyệt Claim, quản lý chiến dịch triệu hồi, phân tích báo cáo.
* `SC_Staff`: Tạo Claim, quản lý thông tin khách hàng/xe.
* `SC_Technician`: Ghi Log công việc (`WorkLog`), thực hiện sửa chữa.
