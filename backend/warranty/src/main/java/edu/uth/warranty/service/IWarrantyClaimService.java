package edu.uth.warranty.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.WarrantyClaim;

@Service

public interface IWarrantyClaimService {

    List<WarrantyClaim> getAllWarrantyClaims();

    Optional<WarrantyClaim> getWarrantyClaimById(Long id);

    WarrantyClaim createWarrantyClaim(WarrantyClaim warrantyClaim);

    WarrantyClaim updateWarrantyClaim(Long id, WarrantyClaim warrantyClaimDetails);

    WarrantyClaim saveWarrantyClaim(WarrantyClaim warrantyClaim);

    void deleteWarrantyClaim(Long id);
    
    WarrantyClaim updateWarrantyClaimStatus(Long id, String status);

    

    WarrantyClaim updateApprovalStatus(Long id, String approvalStatus);

    List<WarrantyClaim> findByStatusIn(String statuses);

    List<WarrantyClaim> findClaimsByApprovalStatus(String approvalStatus);

    List<WarrantyClaim> findClaimsByVehicle(Vehicle vehicle);

    List<WarrantyClaim> findClaimsByCustomer(Customer customer);

    List<WarrantyClaim> findClaimsByTechnician(Technician technician);

    List<WarrantyClaim> findClaimsByStaff(Staff staff);

    List<WarrantyClaim> findClaimsByServiceCenter(ServiceCenter center);

    List<WarrantyClaim> findClaimsByCreatedBetween(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);

    List<WarrantyClaim> findClaimsByTotalCostGreaterThanEqual(java.math.BigDecimal totalCost);

    
}
