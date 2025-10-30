package edu.uth.warranty.repository;

<<<<<<< HEAD
import java.time.LocalDate;
import java.util.List;
=======
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.Staff;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;
>>>>>>> main

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
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
=======
@Repository
public interface WarrantyClaimRepository extends JpaRepository<WarrantyClaim, Long>{
    List<WarrantyClaim> findByStatus(String status);

    List<WarrantyClaim> findByApprovalStatus(String approvalStatus);

    List<WarrantyClaim> findByStatusIn(List<String> statuses);

    List<WarrantyClaim> findByVehicle(Vehicle vehicle);

    List<WarrantyClaim> findByCustomer(Customer customer);

    List<WarrantyClaim> findByCenter(ServiceCenter center);

    List<WarrantyClaim> findByTechnician(Technician technician);

    List<WarrantyClaim> findByStaff(Staff staff);

    List<WarrantyClaim> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<WarrantyClaim> findByTotalCostGreaterThanEqual(BigDecimal totalCost);
>>>>>>> main
}
