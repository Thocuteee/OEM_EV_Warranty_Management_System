package edu.uth.warranty.controller;

import edu.uth.warranty.dto.WarrantyClaimRequest;
import edu.uth.warranty.dto.WarrantyClaimResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.*;
import edu.uth.warranty.service.*;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/warranty-claims")
public class WarrantyClaimController {
    private final IWarrantyClaimService warrantyClaimService;

    public WarrantyClaimController(IWarrantyClaimService warrantyClaimService) {
        this.warrantyClaimService = warrantyClaimService;
    }

    public WarrantyClaimResponse toResponseDTO(WarrantyClaim claim) {
        String customerName = claim.getCustomer() != null ? claim.getCustomer().getName() : null;
        String vehicleVIN = claim.getVehicle() != null ? claim.getVehicle().getVIN() : null;

        return new WarrantyClaimResponse(
            claim.getClaimId(),
            claim.getVehicle() != null ? claim.getVehicle().getVehicleId() : null,
            vehicleVIN,
            claim.getCustomer() != null ? claim.getCustomer().getCustomerId() : null,
            customerName,
            claim.getCenter() != null ? claim.getCenter().getCenterId() : null,
            claim.getTechnician() != null ? claim.getTechnician().getTechnicianId() : null,
            claim.getStatus(),
            claim.getApprovalStatus(),
            claim.getTotalCost(),
            claim.getCreatedAt(),
            claim.getUpdatedAt(),
            claim.getDescription()
        );
    }

    public WarrantyClaim toEntity(WarrantyClaimRequest request) {
        WarrantyClaim claim = new WarrantyClaim();

        if(request.getStaffId() != null) {
            claim.setStaff(new Staff(request.getStaffId()));
        }
        if(request.getVehicleId() != null) {
            claim.setVehicle(new Vehicle(request.getVehicleId()));
        }
        if (request.getCustomerId() != null) {
            claim.setCustomer(new Customer(request.getCustomerId()));
        }
        if (request.getTechnicianId() != null) {
            claim.setTechnician(new Technician(request.getTechnicianId()));
        }
        if (request.getCenterId() != null) {
            claim.setCenter(new ServiceCenter(request.getCenterId()));
        }

        claim.setDescription(request.getDescription());
        claim.setTotalCost(request.getTotalCost());
        return claim;
    }

    private WarrantyClaim toEntity(Long id, WarrantyClaimRequest request) {
        WarrantyClaim claim = toEntity(request);
        claim.setClaimId(id);
        return claim;
    }

    // 1. POST /api/claims : Tạo mới Claim (luôn khởi tạo DRAFT/PENDING)
    @PostMapping
    public ResponseEntity<?> createClaim(@Valid @RequestBody WarrantyClaimRequest request) {
        try{
            WarrantyClaim newClaim = toEntity(request);
            newClaim.setClaimId(null);
            WarrantyClaim saveClaim = warrantyClaimService.saveWarrantyClaim(newClaim);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saveClaim));

        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 2. GET /api/claims : Lấy tất cả Claims
    @GetMapping
    public ResponseEntity<List<WarrantyClaimResponse>> getAllClaims() {
        List<WarrantyClaim> claims = warrantyClaimService.getAllWarrantyClaims();
        List<WarrantyClaimResponse> responses = claims.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 3. GET /api/claims/{id} : Lấy chi tiết Claim
    @GetMapping("/{id}")
    public ResponseEntity<WarrantyClaimResponse> getClaimById(@PathVariable Long id) {
        Optional<WarrantyClaim> claimOpt = warrantyClaimService.getWarrantyClaimById(id);

        if(claimOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(claimOpt.get()));
    }

    // 4. PUT /api/claims/{id} : Cập nhật Claim (Chỉ nên cho phép cập nhật DRAFT)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClaim(@PathVariable Long id, @Valid @RequestBody WarrantyClaimRequest request) {
        if(warrantyClaimService.getWarrantyClaimById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        } try {
            WarrantyClaim updatedClaim = warrantyClaimService.saveWarrantyClaim(toEntity(id, request));
            return ResponseEntity.ok(toResponseDTO(updatedClaim));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 5. DELETE /api/claims/{id} : Xóa Claim (Chỉ cho phép xóa DRAFT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable Long id) {
        try{
            warrantyClaimService.deleteWarrantyClaim(id);
            return ResponseEntity.noContent().build();
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch(Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. PUT /api/claims/{id}/status/approve : Cập nhật trạng thái phê duyệt (dành cho EVM Staff)
    // Endpoint này giả định EVM Staff sẽ gọi API này để APPROVED/REJECTED Claim đã được gửi (SENT)
    @PutMapping("/{id}/status/approve")
    public ResponseEntity<?> updateApprovalStatus(@PathVariable Long id, @RequestParam String approvalStatus) {
        try {
            WarrantyClaim updatedClaim = warrantyClaimService.updateWarrantyClaimsStatus(id, approvalStatus);
            return ResponseEntity.ok(toResponseDTO(updatedClaim));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    
}