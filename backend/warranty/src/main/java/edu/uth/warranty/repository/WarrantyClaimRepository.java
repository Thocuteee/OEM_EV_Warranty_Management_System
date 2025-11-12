package edu.uth.warranty.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.WarrantyClaim;

@Repository
public interface WarrantyClaimRepository extends JpaRepository<WarrantyClaim, Long> {

    // Tìm claim theo trạng thái xử lý
    List<WarrantyClaim> findByStatus(String status);

    // Tìm claim theo mã xe (VIN)
    List<WarrantyClaim> findByVehicle_Vin(String vin);

    // Tìm claim trong khoảng thời gian gửi
    List<WarrantyClaim> findByCreatedDateBetween(LocalDate startDate, LocalDate endDate);

    // Lấy danh sách claim của một kỹ thuật viên
    List<WarrantyClaim> findByTechnician_TechnicianId(Long technicianId);

    // Lấy danh sách claim theo khách hàng
    List<WarrantyClaim> findByCustomer_CustomerId(Long customerId);
}
