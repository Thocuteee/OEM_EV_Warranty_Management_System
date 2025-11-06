package edu.uth.warranty.controller;

import edu.uth.warranty.dto.WarrantyClaimRequest;
import edu.uth.warranty.dto.WarrantyClaimResponse;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.Staff;

import edu.uth.warranty.service.IWarrantyClaimService;
import edu.uth.warranty.service.ICustomerService;
import edu.uth.warranty.service.IServiceCenterService;
import edu.uth.warranty.service.IStaffService;
import edu.uth.warranty.service.ITechnicianService;
import edu.uth.warranty.service.IVehicleService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/claims")
public class WarrantyClaimController {
    private final IWarrantyClaimService warrantyClaimService;
    private final ICustomerService customerService;
    private final IVehicleService vehicleService;
    private final IServiceCenterService serviceCenterService;
    private final IStaffService staffService;
    private final ITechnicianService technicianService;

    public WarrantyClaimController(IWarrantyClaimService warrantyClaimService, ICustomerService customerService, IVehicleService vehicleService,IServiceCenterService serviceCenterService,IStaffService staffService,ITechnicianService technicianService) {
        this.warrantyClaimService = warrantyClaimService;
        this.customerService = customerService;
        this.vehicleService = vehicleService;
        this.serviceCenterService = serviceCenterService;
        this.staffService = staffService;
        this.technicianService = technicianService;
    }

    private WarrantyClaimResponse toResponseDTO(WarrantyClaim claim) {
        // Lấy tên hiển thị từ các Service (Giả định rằng các Entity ID đã được chuẩn hóa)
        String customerName = claim.getCustomer() != null 
            ? customerService.getCustomerById(claim.getCustomer().getCustomerId()).map(Customer::getName).orElse(null) 
            : null;
        
        String vehicleVIN = claim.getVehicle() != null 
            ? vehicleService.getAllById(claim.getVehicle().getVehicleId()).map(Vehicle::getVIN).orElse(null) 
            : null;
        
        return new WarrantyClaimResponse(
            claim.getWarrantyClaimId(), // Giả định getter là getClaim_id()
            claim.getVehicle().getVehicleId(),
            vehicleVIN,
            claim.getCustomer().getCustomerId(),
            customerName,
            claim.getCenter().getCenterId(),
            claim.getStatus(),
            claim.getApprovalStatus(),
            claim.getTotalCost(),
            claim.getCreatedAt(),
            claim.getUpdatedAt(),
            claim.getDescription(),
            claim.getTechnician() != null ? claim.getTechnician().getTechnicianId() : null
        );
    }

    


    // 1. POST /api/claims : Tạo mới Claim (SC Staff)



    // 2. GET /api/claims : Lấy tất cả Claims


    // 3. GET /api/claims/{id} : Lấy chi tiết Claim



    // 4. PUT /api/claims/{id} : Cập nhật Claim 



    // 5. DELETE /api/claims/{id} : Xóa Claim (Chỉ khi ở trạng thái DRAFT)



    // 6. PUT /api/claims/{id}/approval : Phê duyệt/Từ chối Claim (EVM Staff)



    // 7. GET /api/claims/status/{status} : Lọc Claim theo trạng thái
}
