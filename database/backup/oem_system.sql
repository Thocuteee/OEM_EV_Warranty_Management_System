-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 27, 2025 lúc 05:20 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `oem_system`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `campaign_vehicle`
--

CREATE TABLE `campaign_vehicle` (
  `status` varchar(255) NOT NULL,
  `campaign_id` bigint(20) NOT NULL,
  `vehicle_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `campaign_vehicle`
--

INSERT INTO `campaign_vehicle` (`status`, `campaign_id`, `vehicle_id`) VALUES
('PENDING', 1, 1),
('PENDING', 2, 3),
('PENDING', 3, 4),
('PENDING', 3, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `claim_attachment`
--

CREATE TABLE `claim_attachment` (
  `attachment_id` bigint(20) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `claim_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `claim_attachment`
--

INSERT INTO `claim_attachment` (`attachment_id`, `file_url`, `type`, `claim_id`) VALUES
(1, 'https://static1.cafeland.vn/cafeautoData/upload/tintuc/thitruong/2021/08/tuan-02/tuchoibaohanh-1628885884.jpg', 'IMAGE', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `claim_part`
--

CREATE TABLE `claim_part` (
  `quantity` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `claim_id` bigint(20) NOT NULL,
  `part_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `claim_part`
--

INSERT INTO `claim_part` (`quantity`, `total_price`, `unit_price`, `claim_id`, `part_id`) VALUES
(1, 950000.00, 950000.00, 1, 1),
(1, 150000.00, 150000.00, 1, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer`
--

CREATE TABLE `customer` (
  `customer_id` bigint(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `customer`
--

INSERT INTO `customer` (`customer_id`, `address`, `email`, `name`, `phone`) VALUES
(1, 'China', 'chungtabanguoi@gmail.com', 'Liễu Như Yên', '0902846206'),
(2, 'China', 'vfqqbt8182@chedoden.com', 'Lý Tông Bình', '0234567899'),
(3, 'Nguyễn Văn Dung, Quận Gò Vấp, Thành Phố Hồ Chí Minh', 'chenhhungtho01@gmail.com', 'Chềnh Hưng Thọ', '0902846205'),
(4, 'Tô Ngọc Vân, Quận 12, Thành Phố Hồ Chí Minh', 'danganhduy111222@gmail.com', 'Đặng Anh Duy', '0123456789'),
(5, 'Thành Phố Hồ Chí Minh', 'Voquangg140805@gmail.com', 'Võ Quang Vinh Quang', '0234567890');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` bigint(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `invoice_date` date NOT NULL,
  `center_id` bigint(20) NOT NULL,
  `part_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `amount`, `invoice_date`, `center_id`, `part_id`) VALUES
(1, 2.00, '2025-11-26', 1, 1),
(2, 3.00, '2025-11-26', 1, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoice`
--

CREATE TABLE `invoice` (
  `invoice_id` bigint(20) NOT NULL,
  `location_type` varchar(255) NOT NULL,
  `min_stock_level` int(11) NOT NULL,
  `payments_status` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `center_id` bigint(20) NOT NULL,
  `claim_id` bigint(20) NOT NULL,
  `part_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `invoice`
--

INSERT INTO `invoice` (`invoice_id`, `location_type`, `min_stock_level`, `payments_status`, `quantity`, `center_id`, `claim_id`, `part_id`) VALUES
(1, 'SERVICE_CENTER', 10, 'REIMBURSED', 1, 1, 2, 1),
(2, 'SERVICE_CENTER', 10, 'REIMBURSED', 1, 1, 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `part`
--

CREATE TABLE `part` (
  `part_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `part_number` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `part`
--

INSERT INTO `part` (`part_id`, `name`, `part_number`, `price`) VALUES
(1, 'Bảng Meca tem xe máy - kiểu dáng xe nhập khẩu', 'SPK-7', 950000.00),
(2, 'Bảng Meca tem xe máy - kiểu dáng xe nhập khẩu', 'SPK 61717', 150000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `part_serial`
--

CREATE TABLE `part_serial` (
  `part_serial_id` bigint(20) NOT NULL,
  `date_received` date NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `part_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `part_serial`
--

INSERT INTO `part_serial` (`part_serial_id`, `date_received`, `serial_number`, `part_id`) VALUES
(1, '2025-11-25', '98069-56741', 1),
(2, '2025-11-26', '98069-56742', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `recall_campaign`
--

CREATE TABLE `recall_campaign` (
  `campaign_id` bigint(20) NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `recall_campaign`
--

INSERT INTO `recall_campaign` (`campaign_id`, `end_date`, `start_date`, `title`) VALUES
(1, '2025-11-30', '2025-11-26', 'thay thế ev-a'),
(2, '2025-11-28', '2025-11-27', 'Thay thế bugi, đèn pha '),
(3, '2025-11-30', '2025-11-27', 'Thay thế Bugi, đèn pha led');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `report`
--

CREATE TABLE `report` (
  `report_id` bigint(20) NOT NULL,
  `action_taken` text DEFAULT NULL,
  `labor_cost` decimal(10,2) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `finished_at` datetime(6) DEFAULT NULL,
  `part_cost` decimal(10,2) DEFAULT NULL,
  `part_used` text DEFAULT NULL,
  `replaced_part` text DEFAULT NULL,
  `report_date` date NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `recall_campaign_id` bigint(20) DEFAULT NULL,
  `service_center_id` bigint(20) NOT NULL,
  `claim_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `technician_id` bigint(20) NOT NULL,
  `vehicle_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `report`
--

INSERT INTO `report` (`report_id`, `action_taken`, `labor_cost`, `created_by`, `created_date`, `description`, `finished_at`, `part_cost`, `part_used`, `replaced_part`, `report_date`, `started_at`, `status`, `updated_at`, `updated_by`, `recall_campaign_id`, `service_center_id`, `claim_id`, `user_id`, `technician_id`, `vehicle_id`) VALUES
(1, 'dsds', 0.11, 'admin', '2025-11-25 16:03:20.000000', 'dsd', NULL, 0.07, '', '', '2025-11-25', NULL, 'IN_PROCESS', NULL, NULL, NULL, 1, 2, 1, 3, 1),
(2, 'dsdsdsds', 0.11, 'admin', '2025-11-25 16:03:41.000000', 'dsdsd', NULL, 0.09, '', '', '2025-11-25', NULL, 'COMPLETED', NULL, NULL, NULL, 1, 3, 1, 3, 2),
(3, 'd', 0.12, 'admin', '2025-11-27 03:46:29.000000', 'd', NULL, 0.10, 'd', 'd', '2025-11-27', NULL, 'COMPLETED', NULL, NULL, NULL, 1, 6, 1, 3, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `service_center`
--

CREATE TABLE `service_center` (
  `center_id` bigint(20) NOT NULL,
  `location` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `service_center`
--

INSERT INTO `service_center` (`center_id`, `location`, `name`) VALUES
(1, 'Quận 1,Thành Phố Hồ Chí Minh', 'Trung Tâm Bảo Dưỡng Đào Lửa');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `staff`
--

CREATE TABLE `staff` (
  `staff_id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` enum('Admin','EVM_Staff','SC_Staff','SC_Technician') NOT NULL,
  `username` varchar(255) NOT NULL,
  `center_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `staff`
--

INSERT INTO `staff` (`staff_id`, `address`, `email`, `name`, `password`, `phone`, `role`, `username`, `center_id`) VALUES
(1, 'Địa chỉ mặc định', 'admin@gmail.com', 'admin', '$2a$10$xi2LzOdN1xylt4UgPpLt3uBPuxJsgXrB4g06IgqKHrvFkKP5wa3SW', '0900000001', 'Admin', 'admin', 1),
(2, 'Địa chỉ mặc định', 'dat@gmail.com', 'staff_01', '$2a$10$kD0Jl.Cv0j6t2uJ2YtU9q.4SoTRSsjcwn3jTqQMCZQEUdu93d2y7y', '0900000002', 'SC_Staff', 'staff_01', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `technician`
--

CREATE TABLE `technician` (
  `technician_id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `specialization` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `center_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `technician`
--

INSERT INTO `technician` (`technician_id`, `email`, `name`, `password`, `phone`, `specialization`, `username`, `center_id`) VALUES
(3, 'duy@gmail.com', 'tech_01', '$2a$10$MMvcAcIBe9fwaVDfRh3oyuOHkze5IPtw5Pn3wkLQlB8pgbypyf50G', '0123456789', 'EV General', 'tech_01', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `role` enum('Admin','EVM_Staff','SC_Staff','SC_Technician') NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `email`, `user_password`, `role`, `username`) VALUES
(1, 'admin@gmail.com', '$2a$10$xi2LzOdN1xylt4UgPpLt3uBPuxJsgXrB4g06IgqKHrvFkKP5wa3SW', 'Admin', 'admin'),
(2, 'dat@gmail.com', '$2a$10$kD0Jl.Cv0j6t2uJ2YtU9q.4SoTRSsjcwn3jTqQMCZQEUdu93d2y7y', 'SC_Staff', 'staff_01'),
(3, 'duy@gmail.com', '$2a$10$/6gn6Gt/MLue5jlqxjSNtOx9p/r74KAt9v8/F/tUbR2Gzbx3XEMg6', 'SC_Technician', 'tech_01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicle`
--

CREATE TABLE `vehicle` (
  `vehicle_id` bigint(20) NOT NULL,
  `vin` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `registration_status` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `registered_by_user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vehicle`
--

INSERT INTO `vehicle` (`vehicle_id`, `vin`, `model`, `registration_status`, `year`, `customer_id`, `registered_by_user_id`) VALUES
(1, 'VIN11223344556677', 'Ferrari', 'APPROVED', '2023', 1, 1),
(2, 'ABC1234567890DEFZ', 'EV-Model-Z', 'APPROVED', '2022', 2, 1),
(3, 'VIN12123456783453', 'Exciter 135', 'APPROVED', '2014', 3, 1),
(4, 'VIN13121415171621', 'EV-B', 'APPROVED', '2021', 4, 1),
(5, 'VIN12123456783454', 'EA-V', 'APPROVED', '2025', 5, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicle_part`
--

CREATE TABLE `vehicle_part` (
  `history_id` bigint(20) NOT NULL,
  `date_installed` date DEFAULT NULL,
  `claim_id` bigint(20) NOT NULL,
  `part_serial_id` bigint(20) NOT NULL,
  `vehicle_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vehicle_part`
--

INSERT INTO `vehicle_part` (`history_id`, `date_installed`, `claim_id`, `part_serial_id`, `vehicle_id`) VALUES
(1, '2025-11-26', 1, 1, 1),
(2, '2025-11-26', 1, 1, 1),
(3, '2025-11-26', 3, 2, 2),
(4, '2025-11-27', 6, 1, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `warranty_claim`
--

CREATE TABLE `warranty_claim` (
  `claim_id` bigint(20) NOT NULL,
  `approval_status` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `center_id` bigint(20) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `staff_id` bigint(20) NOT NULL,
  `technician_id` bigint(20) DEFAULT NULL,
  `vehicle_id` bigint(20) NOT NULL,
  `current_mileage` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `warranty_claim`
--

INSERT INTO `warranty_claim` (`claim_id`, `approval_status`, `created_at`, `description`, `status`, `total_cost`, `updated_at`, `center_id`, `customer_id`, `staff_id`, `technician_id`, `vehicle_id`, `current_mileage`) VALUES
(1, 'APPROVED', '2025-11-25 14:46:37.000000', 'dd', 'IN_PROGRESS', 1000.00, '2025-11-25 15:09:36.000000', 1, 1, 2, 3, 1, NULL),
(2, 'APPROVED', '2025-11-25 15:16:13.000000', 'cc', 'IN_PROGRESS', 123450.00, '2025-11-25 16:02:57.000000', 1, 1, 2, 3, 1, NULL),
(3, 'APPROVED', '2025-11-25 15:18:31.000000', 'cc', 'IN_PROGRESS', 123450.00, '2025-11-25 15:19:03.000000', 1, 2, 2, 3, 2, NULL),
(4, 'APPROVED', '2025-11-26 16:58:34.000000', 'ds', 'IN_PROCESS', 112230.00, '2025-11-26 17:23:05.000000', 1, 1, 1, 3, 1, NULL),
(5, 'REJECTED', '2025-11-26 17:22:44.000000', 'dddssdsd', 'REJECTED', 1111110.00, '2025-11-26 17:23:32.000000', 1, 2, 2, 3, 2, NULL),
(6, 'APPROVED', '2025-11-27 03:44:49.000000', 'bugi', 'IN_PROCESS', 1000000.00, '2025-11-27 03:50:24.000000', 1, 3, 2, 3, 3, 800000),
(7, 'APPROVED', '2025-11-27 03:54:50.000000', 'dsdd', 'IN_PROCESS', 0.08, '2025-11-27 04:04:47.000000', 1, 3, 1, 3, 3, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `warranty_policy`
--

CREATE TABLE `warranty_policy` (
  `policy_id` bigint(20) NOT NULL,
  `coverage_description` text DEFAULT NULL,
  `duration_months` int(11) NOT NULL,
  `mileage_limit` int(11) NOT NULL,
  `policy_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `warranty_policy`
--

INSERT INTO `warranty_policy` (`policy_id`, `coverage_description`, `duration_months`, `mileage_limit`, `policy_name`) VALUES
(1, 'Mua xe 1 tặng 4 chỗ ngồi', 1, 10, 'Mua 1 tặng 4');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `work_log`
--

CREATE TABLE `work_log` (
  `log_id` bigint(20) NOT NULL,
  `duration` decimal(5,2) DEFAULT NULL,
  `end_time` date NOT NULL,
  `log_date` date DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `start_time` date NOT NULL,
  `claim_id` bigint(20) NOT NULL,
  `technician_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `work_log`
--

INSERT INTO `work_log` (`log_id`, `duration`, `end_time`, `log_date`, `notes`, `start_time`, `claim_id`, `technician_id`) VALUES
(2, 1.00, '2025-11-27', '2025-11-26', NULL, '2025-11-26', 3, 3),
(4, 1.00, '2025-11-27', '2025-11-27', NULL, '2025-11-27', 1, 3);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `campaign_vehicle`
--
ALTER TABLE `campaign_vehicle`
  ADD PRIMARY KEY (`campaign_id`,`vehicle_id`),
  ADD KEY `FKeo8hdtulpxoip3i1j0hc6os8g` (`vehicle_id`);

--
-- Chỉ mục cho bảng `claim_attachment`
--
ALTER TABLE `claim_attachment`
  ADD PRIMARY KEY (`attachment_id`),
  ADD KEY `FKfyxql2p4ip4vw1cqsn8ex4vjc` (`claim_id`);

--
-- Chỉ mục cho bảng `claim_part`
--
ALTER TABLE `claim_part`
  ADD PRIMARY KEY (`claim_id`,`part_id`),
  ADD KEY `FK9r3rufgy58tt3gfc3w8kkck1d` (`part_id`);

--
-- Chỉ mục cho bảng `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `UKdwk6cx0afu8bs9o4t536v1j5v` (`email`),
  ADD UNIQUE KEY `UKo3uty20c6csmx5y4uk2tc5r4m` (`phone`);

--
-- Chỉ mục cho bảng `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD KEY `FKf2oddkels92pqk6bbpbi2gmxa` (`center_id`),
  ADD KEY `FKnuo4gk6ce1meib4kne2rp1p9k` (`part_id`);

--
-- Chỉ mục cho bảng `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `FK8mod15um46njkenh73dug6wk3` (`center_id`),
  ADD KEY `FKa809pc97m9qxc2vl7pa1tamal` (`claim_id`),
  ADD KEY `FK8abhw5iko7yr6p21lp8wifck1` (`part_id`);

--
-- Chỉ mục cho bảng `part`
--
ALTER TABLE `part`
  ADD PRIMARY KEY (`part_id`),
  ADD UNIQUE KEY `UK2tjpyelhdjx8q1smwh9s3cq75` (`part_number`);

--
-- Chỉ mục cho bảng `part_serial`
--
ALTER TABLE `part_serial`
  ADD PRIMARY KEY (`part_serial_id`),
  ADD UNIQUE KEY `UKouh3wfdf1bribdisbl0w6qej3` (`serial_number`),
  ADD KEY `FKktc0t0yqkl9ixd3numjnrb2k` (`part_id`);

--
-- Chỉ mục cho bảng `recall_campaign`
--
ALTER TABLE `recall_campaign`
  ADD PRIMARY KEY (`campaign_id`),
  ADD UNIQUE KEY `UKsslsxijq8ym26mpc3qpvuv6af` (`title`);

--
-- Chỉ mục cho bảng `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `FK3kcjqsuxcjkcr00bda9sks397` (`service_center_id`),
  ADD KEY `FKlb3uii39ild7d66kmgql13992` (`claim_id`),
  ADD KEY `FKj62onw73yx1qnmd57tcaa9q3a` (`user_id`),
  ADD KEY `FKn9krnhmsnlqxvtdomtwaeka1b` (`technician_id`),
  ADD KEY `FKbhx4915b5kpmovy0hvx2o1xv` (`vehicle_id`),
  ADD KEY `FK6mydedygyn8pimdp3sx2aykvj` (`recall_campaign_id`);

--
-- Chỉ mục cho bảng `service_center`
--
ALTER TABLE `service_center`
  ADD PRIMARY KEY (`center_id`),
  ADD UNIQUE KEY `UK9cbkevgfkfumrdjlp88kx7tg7` (`name`);

--
-- Chỉ mục cho bảng `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `UKpvctx4dbua9qh4p4s3gm3scrh` (`email`),
  ADD UNIQUE KEY `UKoqg5g7ejg0vk2ew0thf2asi4` (`phone`),
  ADD KEY `FKfb80vbffl0dlwm9id43b80bs1` (`center_id`);

--
-- Chỉ mục cho bảng `technician`
--
ALTER TABLE `technician`
  ADD PRIMARY KEY (`technician_id`),
  ADD UNIQUE KEY `UKcrs6ef6e2yblrw13n1fe4ma53` (`email`),
  ADD UNIQUE KEY `UKfrrlrgt7ovsyt2789is9j1mse` (`phone`),
  ADD UNIQUE KEY `UKjsidk542aq2smw9e3i79g7d4y` (`username`),
  ADD KEY `FKrqg70wwt1tsit90xe35pkuhn2` (`center_id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`),
  ADD UNIQUE KEY `UKsb8bbouer5wak8vyiiy4pf2bx` (`username`);

--
-- Chỉ mục cho bảng `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD UNIQUE KEY `UK3vyjrop7rn1kcnfdhvlfthoc3` (`vin`),
  ADD KEY `FKlwqsusjj6iodeb0df1b554vxq` (`customer_id`),
  ADD KEY `FKhotoxij8kj2te4xwhpfeobu2k` (`registered_by_user_id`);

--
-- Chỉ mục cho bảng `vehicle_part`
--
ALTER TABLE `vehicle_part`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `FK660ni33ay9k4y5m2kkq66oaak` (`claim_id`),
  ADD KEY `FK8jkvat808eg08qfrexd42ip91` (`part_serial_id`),
  ADD KEY `FKdpiy465p9lbh2ljqmeaxpv019` (`vehicle_id`);

--
-- Chỉ mục cho bảng `warranty_claim`
--
ALTER TABLE `warranty_claim`
  ADD PRIMARY KEY (`claim_id`),
  ADD KEY `FKmp8rt59eu2o4d5hm2lvv99xd5` (`center_id`),
  ADD KEY `FKtn0g00x4enlti8ys40y4ys1vg` (`customer_id`),
  ADD KEY `FKqn10242mvrj4nglg08udwyp1y` (`staff_id`),
  ADD KEY `FKe1gategbs3qj60fq2fps5oa86` (`technician_id`),
  ADD KEY `FK2xw0u6hsdn46h3hihfldmjyvc` (`vehicle_id`);

--
-- Chỉ mục cho bảng `warranty_policy`
--
ALTER TABLE `warranty_policy`
  ADD PRIMARY KEY (`policy_id`),
  ADD UNIQUE KEY `UK3enjvusfixeekyhvhcyustklo` (`policy_name`);

--
-- Chỉ mục cho bảng `work_log`
--
ALTER TABLE `work_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `FKmue6iafko533achubyp2gja75` (`claim_id`),
  ADD KEY `FKf11dk22b6le0cly5byru5c0bq` (`technician_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `claim_attachment`
--
ALTER TABLE `claim_attachment`
  MODIFY `attachment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `part`
--
ALTER TABLE `part`
  MODIFY `part_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `part_serial`
--
ALTER TABLE `part_serial`
  MODIFY `part_serial_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `recall_campaign`
--
ALTER TABLE `recall_campaign`
  MODIFY `campaign_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `report`
--
ALTER TABLE `report`
  MODIFY `report_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `service_center`
--
ALTER TABLE `service_center`
  MODIFY `center_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `technician`
--
ALTER TABLE `technician`
  MODIFY `technician_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `vehicle_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `vehicle_part`
--
ALTER TABLE `vehicle_part`
  MODIFY `history_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `warranty_claim`
--
ALTER TABLE `warranty_claim`
  MODIFY `claim_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `warranty_policy`
--
ALTER TABLE `warranty_policy`
  MODIFY `policy_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `work_log`
--
ALTER TABLE `work_log`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `campaign_vehicle`
--
ALTER TABLE `campaign_vehicle`
  ADD CONSTRAINT `FK5t4t68qe3dy53br8rwlc56o9k` FOREIGN KEY (`campaign_id`) REFERENCES `recall_campaign` (`campaign_id`),
  ADD CONSTRAINT `FKeo8hdtulpxoip3i1j0hc6os8g` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`);

--
-- Các ràng buộc cho bảng `claim_attachment`
--
ALTER TABLE `claim_attachment`
  ADD CONSTRAINT `FKfyxql2p4ip4vw1cqsn8ex4vjc` FOREIGN KEY (`claim_id`) REFERENCES `warranty_claim` (`claim_id`);

--
-- Các ràng buộc cho bảng `claim_part`
--
ALTER TABLE `claim_part`
  ADD CONSTRAINT `FK9r3rufgy58tt3gfc3w8kkck1d` FOREIGN KEY (`part_id`) REFERENCES `part` (`part_id`),
  ADD CONSTRAINT `FKhncid2fly10tv37e1bi9d4sm0` FOREIGN KEY (`claim_id`) REFERENCES `warranty_claim` (`claim_id`);

--
-- Các ràng buộc cho bảng `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `FKf2oddkels92pqk6bbpbi2gmxa` FOREIGN KEY (`center_id`) REFERENCES `service_center` (`center_id`),
  ADD CONSTRAINT `FKnuo4gk6ce1meib4kne2rp1p9k` FOREIGN KEY (`part_id`) REFERENCES `part` (`part_id`);

--
-- Các ràng buộc cho bảng `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `FK8abhw5iko7yr6p21lp8wifck1` FOREIGN KEY (`part_id`) REFERENCES `part` (`part_id`),
  ADD CONSTRAINT `FK8mod15um46njkenh73dug6wk3` FOREIGN KEY (`center_id`) REFERENCES `service_center` (`center_id`),
  ADD CONSTRAINT `FKa809pc97m9qxc2vl7pa1tamal` FOREIGN KEY (`claim_id`) REFERENCES `warranty_claim` (`claim_id`);

--
-- Các ràng buộc cho bảng `part_serial`
--
ALTER TABLE `part_serial`
  ADD CONSTRAINT `FKktc0t0yqkl9ixd3numjnrb2k` FOREIGN KEY (`part_id`) REFERENCES `part` (`part_id`);

--
-- Các ràng buộc cho bảng `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `FK3kcjqsuxcjkcr00bda9sks397` FOREIGN KEY (`service_center_id`) REFERENCES `service_center` (`center_id`),
  ADD CONSTRAINT `FK6mydedygyn8pimdp3sx2aykvj` FOREIGN KEY (`recall_campaign_id`) REFERENCES `recall_campaign` (`campaign_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FKbhx4915b5kpmovy0hvx2o1xv` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`),
  ADD CONSTRAINT `FKj62onw73yx1qnmd57tcaa9q3a` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKlb3uii39ild7d66kmgql13992` FOREIGN KEY (`claim_id`) REFERENCES `warranty_claim` (`claim_id`),
  ADD CONSTRAINT `FKn9krnhmsnlqxvtdomtwaeka1b` FOREIGN KEY (`technician_id`) REFERENCES `technician` (`technician_id`);

--
-- Các ràng buộc cho bảng `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `FKfb80vbffl0dlwm9id43b80bs1` FOREIGN KEY (`center_id`) REFERENCES `service_center` (`center_id`);

--
-- Các ràng buộc cho bảng `technician`
--
ALTER TABLE `technician`
  ADD CONSTRAINT `FKrqg70wwt1tsit90xe35pkuhn2` FOREIGN KEY (`center_id`) REFERENCES `service_center` (`center_id`);

--
-- Các ràng buộc cho bảng `vehicle`
--
ALTER TABLE `vehicle`
  ADD CONSTRAINT `FKhotoxij8kj2te4xwhpfeobu2k` FOREIGN KEY (`registered_by_user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKlwqsusjj6iodeb0df1b554vxq` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`);

--
-- Các ràng buộc cho bảng `vehicle_part`
--
ALTER TABLE `vehicle_part`
  ADD CONSTRAINT `FK660ni33ay9k4y5m2kkq66oaak` FOREIGN KEY (`claim_id`) REFERENCES `warranty_claim` (`claim_id`),
  ADD CONSTRAINT `FK8jkvat808eg08qfrexd42ip91` FOREIGN KEY (`part_serial_id`) REFERENCES `part_serial` (`part_serial_id`),
  ADD CONSTRAINT `FKdpiy465p9lbh2ljqmeaxpv019` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`);

--
-- Các ràng buộc cho bảng `warranty_claim`
--
ALTER TABLE `warranty_claim`
  ADD CONSTRAINT `FK2xw0u6hsdn46h3hihfldmjyvc` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`),
  ADD CONSTRAINT `FKe1gategbs3qj60fq2fps5oa86` FOREIGN KEY (`technician_id`) REFERENCES `technician` (`technician_id`),
  ADD CONSTRAINT `FKmp8rt59eu2o4d5hm2lvv99xd5` FOREIGN KEY (`center_id`) REFERENCES `service_center` (`center_id`),
  ADD CONSTRAINT `FKqn10242mvrj4nglg08udwyp1y` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`),
  ADD CONSTRAINT `FKtn0g00x4enlti8ys40y4ys1vg` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`);

--
-- Các ràng buộc cho bảng `work_log`
--
ALTER TABLE `work_log`
  ADD CONSTRAINT `FKf11dk22b6le0cly5byru5c0bq` FOREIGN KEY (`technician_id`) REFERENCES `technician` (`technician_id`),
  ADD CONSTRAINT `FKmue6iafko533achubyp2gja75` FOREIGN KEY (`claim_id`) REFERENCES `warranty_claim` (`claim_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
