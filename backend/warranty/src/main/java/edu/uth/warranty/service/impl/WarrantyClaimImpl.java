package edu.uth.warranty.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.repository.WarrantyClaimRepository;
import edu.uth.warranty.service.IWarrantyClaimService;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class WarrantyClaimImpl   implements IWarrantyClaimService {

    private final WarrantyClaimRepository warrantyClaimRepository;
    // Inject thêm các repository khác nếu cần cho logic phức tạp hơn (ví dụ: ClaimPartRepository để tính tổng tiền)

    public WarrantyClaimImpl(WarrantyClaimRepository warrantyClaimRepository) {
        this.warrantyClaimRepository = warrantyClaimRepository;

    }
    @Override
    public List<WarrantyClaim> getAllWarrantyClaims() {
        return warrantyClaimRepository.findAll();
    }

    @Override
    public Optional<WarrantyClaim> getWarrantyClaimById(Long id) {
        return warrantyClaimRepository.findById(id);
    }
    @Override
    public WarrantyClaim createWarrantyClaim(WarrantyClaim warrantyClaim) {
        return warrantyClaimRepository.save(warrantyClaim);
    }
    @Override
    public WarrantyClaim updateWarrantyClaim(Long id, WarrantyClaim warrantyClaimDetails) {
        return warrantyClaimRepository.findById(id)
                .map(existingClaim -> {
                    // Update all fields from warrantyClaimDetails to existingClaim
                    existingClaim.setStatus(warrantyClaimDetails.getStatus());
                    existingClaim.setApprovalStatus(warrantyClaimDetails.getApprovalStatus());
                    existingClaim.setTotalCost(warrantyClaimDetails.getTotalCost());
                    // Add other fields as needed
                    return warrantyClaimRepository.save(existingClaim);
                })
                .orElseThrow(() -> new RuntimeException("WarrantyClaim not found with id: " + id));
    }
    @Override
    public WarrantyClaim saveWarrantyClaim(WarrantyClaim warrantyClaim) {
        return warrantyClaimRepository.save(warrantyClaim);
        }

    @Override
    public void deleteWarrantyClaim(Long id) {
        warrantyClaimRepository.deleteById(id);
    }

    @Override
    public WarrantyClaim updateWarrantyClaimStatus(Long id, String status) {
        return warrantyClaimRepository.findById(id)
                .map(existingClaim -> {
                    existingClaim.setStatus(status);
                    return warrantyClaimRepository.save(existingClaim);
                })
                .orElseThrow(() -> new RuntimeException("WarrantyClaim not found with id: " + id));
    }

    @Override
    public List<WarrantyClaim> findByStatusIn(String statuses) {
        return warrantyClaimRepository.findByStatus(statuses);
    }
    @Override
    public WarrantyClaim updateApprovalStatus(Long id, String approvalStatus) {
        return warrantyClaimRepository.findById(id)
                .map(claim -> {
                    claim.setApprovalStatus(approvalStatus); // Assuming you have setApprovalStatus method
                    return warrantyClaimRepository.save(claim);
                })
                .orElseThrow(() -> new RuntimeException("WarrantyClaim not found with id: " + id));
    }
    @Override
    public List<WarrantyClaim> findClaimsByApprovalStatus(String approvalStatus) {
        return warrantyClaimRepository.findByApprovalStatus(approvalStatus);
    }
    @Override
    public List<WarrantyClaim> findClaimsByVehicle(Vehicle vehicle) {
        return warrantyClaimRepository.findByVehicle(vehicle);
    }
    @Override
    public List<WarrantyClaim> findClaimsByCustomer(Customer customer) {
        return warrantyClaimRepository.findByCustomer(customer);
    }
    @Override
    public List<WarrantyClaim> findClaimsByTechnician(Technician technician) {
        return warrantyClaimRepository.findByTechnician(technician);
    }
    @Override
    public List<WarrantyClaim> findClaimsByStaff(Staff staff) {
        return warrantyClaimRepository.findByStaff(staff);
    }
    @Override
    public List<WarrantyClaim> findClaimsByServiceCenter(ServiceCenter center) {
        return warrantyClaimRepository.findByCenter(center);
    }
    @Override
    public List<WarrantyClaim> findClaimsByCreatedBetween(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate) {
        return warrantyClaimRepository.findByCreatedAtBetween(startDate, endDate);
    }
    @Override
    public List<WarrantyClaim> findClaimsByTotalCostGreaterThanEqual(java.math.BigDecimal totalCost) {
        return warrantyClaimRepository.findByTotalCostGreaterThanEqual(totalCost);
    }


}