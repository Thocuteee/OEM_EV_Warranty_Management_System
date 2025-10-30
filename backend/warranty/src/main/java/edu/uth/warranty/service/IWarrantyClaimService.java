package edu.uth.warranty.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    WarrantyClaim saveWarrantyClaim(WarrantyClaim warrantyClaim);

    void deleteWarrantyClaim(Long id);
    List<WarrantyClaim> getWarrantyClaimsByStatus(String status);

    List<WarrantyClaim> getWarrantyClaimsByApprovalStatus(String approvalStatus);

    WarrantyClaim updateWarrantyClaimsStatus(Long id , String status);

    List<WarrantyClaim> getWarrantyClaimsByVehicle(Vehicle vehicle);
    List<WarrantyClaim> getWarrantyClaimsByCustomer(Customer customer);
    List<WarrantyClaim> getWarrantyClaimsByCenter(ServiceCenter center);
    List<WarrantyClaim> getWarrantyClaimsByTechnician(Technician technician);
    List<WarrantyClaim> getWarrantyClaimsByStaff(Staff staff);
    List<WarrantyClaim> getWarrantyClaimsCreatedBetween(LocalDateTime start, LocalDateTime end);
    List<WarrantyClaim> getWarrantyClaimsByMinTotalCost(BigDecimal totalCost);
}
