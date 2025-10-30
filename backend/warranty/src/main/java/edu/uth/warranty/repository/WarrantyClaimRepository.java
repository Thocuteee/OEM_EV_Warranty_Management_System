package edu.uth.warranty.repository;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.WarrantyClaim;
@Repository
public interface WarrantyClaimRepository extends org.springframework.data.jpa.repository.JpaRepository<WarrantyClaim, Long>{
    List<WarrantyClaim> findByVehicle(Vehicle vehicle);

    List<WarrantyClaim> findByCustomer(Customer customer);

    List<WarrantyClaim> findByCenter(ServiceCenter center);

    List<WarrantyClaim> findByTechnician(Technician technician);

    List<WarrantyClaim> findByStaff(Staff staff);

    List<WarrantyClaim> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<WarrantyClaim> findByTotalCostGreaterThanEqual(BigDecimal totalCost);
}
