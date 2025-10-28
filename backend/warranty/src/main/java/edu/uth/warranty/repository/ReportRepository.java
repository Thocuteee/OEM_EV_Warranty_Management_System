package edu.uth.warranty.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // Lấy báo cáo theo claim
    List<Report> findByClaim_ClaimId(Long claimId);

    // Lấy báo cáo theo kỹ thuật viên
    List<Report> findByTechnician_TechnicianId(Long technicianId);

    // Lấy báo cáo theo xe
    List<Report> findByVehicle_VehicleId(Long vehicleId);

    // Lấy báo cáo theo khoảng thời gian tạo
    List<Report> findByCreatedDateBetween(LocalDate startDate, LocalDate endDate);

    // Lấy báo cáo theo trạng thái
    List<Report> findByStatus(String status);
}
