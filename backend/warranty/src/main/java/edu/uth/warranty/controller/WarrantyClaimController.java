package edu.uth.warranty.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.dto.WarrantyClaimRequest;
import edu.uth.warranty.dto.WarrantyClaimResponse;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.service.IWarrantyClaimService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/warranty-claims")
public class WarrantyClaimController {
    private final IWarrantyClaimService warrantyClaimService;

    public WarrantyClaimController(IWarrantyClaimService warrantyClaimService) {
        this.warrantyClaimService = warrantyClaimService;
    }

    private WarrantyClaimResponse toResponseDTO(WarrantyClaim claim) {
        String customerName = claim.getCustomer() != null ? claim.getCustomer().getName() : null;
        String vehicleVIN = claim.getVehicle() != null ? claim.getVehicle().getVIN() : null;
        String vehicleModel = claim.getVehicle() != null ? claim.getVehicle().getModel() : null;

        return new WarrantyClaimResponse(
            claim.getClaimId(),
            claim.getVehicle() != null ? claim.getVehicle().getVehicleId() : null,
            vehicleVIN,
            vehicleModel,
            claim.getCustomer() != null ? claim.getCustomer().getCustomerId() : null,
            customerName,
            claim.getCenter() != null ? claim.getCenter().getCenterId() : null,
            claim.getTechnician() != null ? claim.getTechnician().getTechnicianId() : null,
            claim.getStatus(),
            claim.getApprovalStatus(),
            claim.getTotalCost(),
            claim.getCreatedAt(),
            claim.getUpdatedAt(),
            claim.getDescription(),
            claim.getCurrentMileage()
        );
    }

    private WarrantyClaim toEntity(WarrantyClaimRequest request) {
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
        claim.setCurrentMileage(request.getCurrentMileage());
        return claim;
    }

    private WarrantyClaim toEntity(Long id, WarrantyClaimRequest request) {
        WarrantyClaim claim = toEntity(request);
        claim.setClaimId(id);
        return claim;
    }

    
   // 1. POST /api/warranty-claims : Tạo mới Claim (CÓ CHECK POLICY)
    @PostMapping
    public ResponseEntity<?> createClaim(@Valid @RequestBody WarrantyClaimRequest request) {
        try {
            WarrantyClaim newClaim = toEntity(request);
            newClaim.setClaimId(null);
            
            // gọi method mới, truyền thêm currentMileage
            WarrantyClaim saveClaim = warrantyClaimService.createClaim(newClaim, request.getCurrentMileage());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saveClaim));

        } catch(IllegalArgumentException e) {
            // Trả về lỗi 400 nếu xe hết hạn bảo hành hoặc sai logic
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
    public ResponseEntity<?> deleteClaim(@PathVariable Long id) {
        if(warrantyClaimService.getWarrantyClaimById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        try{
            warrantyClaimService.deleteWarrantyClaim(id);
            return ResponseEntity.noContent().build();
        } catch(IllegalArgumentException e) {
             // Service sẽ ném lỗi nếu Claim không phải DRAFT
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 6. PUT /api/claims/{id}/status/approve : Cập nhật trạng thái phê duyệt (dành cho EVM Staff)
    @PutMapping("/{id}/status/approve")
    public ResponseEntity<?> updateApprovalStatus(@PathVariable Long id, @RequestParam String approvalStatus) {
        try {
            WarrantyClaim updatedClaim = warrantyClaimService.updateWarrantyClaimsStatus(id, approvalStatus);
            return ResponseEntity.ok(toResponseDTO(updatedClaim));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/send")
    public ResponseEntity<?> sendClaimForApproval(@PathVariable Long id) {
        try {
            WarrantyClaim sentClaim = warrantyClaimService.updateClaimPrimaryStatus(id, "SENT");
            return ResponseEntity.ok(toResponseDTO(sentClaim));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/assign-tech")
    public ResponseEntity<?> assignTechnician(@PathVariable Long id, @RequestParam Long technicianId) {
        try {
            WarrantyClaim updatedClaim = warrantyClaimService.updateClaimTechnician(id, technicianId);
            return ResponseEntity.ok(toResponseDTO(updatedClaim));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/search/statuses")
    public ResponseEntity<List<WarrantyClaimResponse>> getClaimsByStatuses(@RequestParam List<String> statuses) {
        List<WarrantyClaim> claims = warrantyClaimService.getWarrantyClaimsByStatusIn(statuses); 
        List<WarrantyClaimResponse> responses = claims.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
