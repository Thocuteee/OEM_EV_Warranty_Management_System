package edu.uth.warranty.repository;

import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.Staff;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

    @Query(value = "SELECT FUNCTION('MONTH', c.createdAt), SUM(c.totalCost) " + "FROM WarrantyClaim c WHERE FUNCTION('YEAR', c.createdAt) = :year " +"GROUP BY FUNCTION('MONTH', c.createdAt)")
    List<Object[]> findMonthlyTotalCostByYear(@Param("year") int year);
}
