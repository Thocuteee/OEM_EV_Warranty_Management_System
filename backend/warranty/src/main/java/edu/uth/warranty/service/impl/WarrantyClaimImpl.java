package edu.uth.warranty.service.impl;

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

import edu.uth.warranty.repository.CustomerRepository;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.repository.StaffRepository;
import edu.uth.warranty.repository.TechnicianRepository;
import edu.uth.warranty.repository.VehicleRepository;
import edu.uth.warranty.repository.WarrantyClaimRepository;

import edu.uth.warranty.service.IWarrantyClaimService;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class WarrantyClaimImpl implements IWarrantyClaimService {

    private final CustomerRepository customerRepository;

    private final WarrantyClaimRepository warrantyClaimRepository;
    
    private final VehicleRepository vehicleRepository;
    private final TechnicianRepository technicianRepository;
    private final StaffRepository staffRepository;
    private final ServiceCenterRepository serviceCenterRepository;
    
    public WarrantyClaimImpl(WarrantyClaimRepository warrantyClaimRepository,
            CustomerRepository customerRepository,
            VehicleRepository vehicleRepository,
            TechnicianRepository technicianRepository,
            StaffRepository staffRepository,
            ServiceCenterRepository serviceCenterRepository)
            {
        this.warrantyClaimRepository = warrantyClaimRepository;
        this.customerRepository = customerRepository;
        this.vehicleRepository = vehicleRepository;
        this.technicianRepository = technicianRepository;
        this.staffRepository = staffRepository;
        this.serviceCenterRepository = serviceCenterRepository;
    
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
    public WarrantyClaim saveWarrantyClaim(WarrantyClaim warrantyClaim){
        
        // 1. KIỂM TRA STAFF ID (KHẮC PHỤC LỖI 500 CƠ BẢN NHẤT)
        // Staff ID là BẮT BUỘC và phải tồn tại trong bảng Staff
        if(warrantyClaim.getStaff() == null || warrantyClaim.getStaff().getStaffId() == null || staffRepository.findById(warrantyClaim.getStaff().getStaffId()).isEmpty()) {
            throw new IllegalArgumentException("Nhân viên (Staff ID) tạo yêu cầu không tồn tại trong hệ thống.");
        }
        
        // 2. KIỂM TRA VEHICLE ID
        if(warrantyClaim.getVehicle() == null || warrantyClaim.getVehicle().getVehicleId() == null || vehicleRepository.findById(warrantyClaim.getVehicle().getVehicleId()).isEmpty()) {
            // Sửa thông báo lỗi để rõ ràng hơn
            throw new IllegalArgumentException("Xe (Vehicle ID) không tồn tại."); 
        }
        
        // 3. KIỂM TRA CUSTOMER ID
        if(warrantyClaim.getCustomer() == null || warrantyClaim.getCustomer().getCustomerId() == null || customerRepository.findById(warrantyClaim.getCustomer().getCustomerId()).isEmpty()) {
            throw new IllegalArgumentException("Khách hàng không tồn tại.");
        }
        
        // 4. KIỂM TRA SERVICE CENTER ID
        if(warrantyClaim.getCenter() == null || warrantyClaim.getCenter().getCenterId() == null || serviceCenterRepository.findById(warrantyClaim.getCenter().getCenterId()).isEmpty()) {
            throw new IllegalArgumentException("Trung tâm dịch vụ không tồn tại.");
        }
        
        // 5. KIỂM TRA TECHNICIAN ID (Nếu được cung cấp)
        if (warrantyClaim.getTechnician() != null && warrantyClaim.getTechnician().getTechnicianId() != null) {
            if (technicianRepository.findById(warrantyClaim.getTechnician().getTechnicianId()).isEmpty()) {
                throw new IllegalArgumentException("Kỹ thuật viên không tồn tại.");
            }
        }
        
        // Logic Khởi tạo Claim mới (DRAFT)
        if(warrantyClaim.getClaimId() == null) {
            warrantyClaim.setCreatedAt(LocalDateTime.now());
            warrantyClaim.setStatus("DRAFT"); 
            warrantyClaim.setApprovalStatus("PENDING");
        }
        
        warrantyClaim.setUpdatedAt(LocalDateTime.now());
        return warrantyClaimRepository.save(warrantyClaim);
    }

    @Override
    public void deleteWarrantyClaim(Long id) {
    Optional<WarrantyClaim> claimOpt = warrantyClaimRepository.findById(id);
        if(!claimOpt.isPresent()) {
            throw new IllegalArgumentException("Claim không tồn tại.");
        }
        if(!claimOpt.get().getStatus().equals("DRAFT")) {
            throw new IllegalArgumentException("Chỉ có thể xóa các yêu cầu bảo hành ở trạng thái DRAFT.");
        }
        warrantyClaimRepository.deleteById(id);
    }
    @Override
    public List<WarrantyClaim> getWarrantyClaimsByStatus(String status) {
        return warrantyClaimRepository.findByStatus(status);
    }
    @Override
    public List<WarrantyClaim> getWarrantyClaimsByApprovalStatus(String approvalStatus) {
        return warrantyClaimRepository.findByApprovalStatus(approvalStatus);
    }
    @Override
    public WarrantyClaim updateWarrantyClaimsStatus(Long claimId, String newApprovalStatus) {
        WarrantyClaim claim = warrantyClaimRepository.findById(claimId).orElseThrow(() -> new IllegalArgumentException("Claim không tồn tại."));

        if(claim.getStatus().equals("SENT")) {
            claim.setApprovalStatus(newApprovalStatus);
            claim.setUpdatedAt(LocalDateTime.now());
            
            if(newApprovalStatus.equals("APPROVED")) {
                claim.setStatus("IN_PROGRESS");
            } else if(newApprovalStatus.equals("REJECTED")) {
                claim.setStatus("REJECTED");
            }
            return warrantyClaimRepository.save(claim);
        } else {
            throw new IllegalArgumentException("Khong thể phê duyệt ở trạng thái SENT.");
        }
    }

    @Override
    public List<WarrantyClaim> getWarrantyClaimsByVehicle(Vehicle vehicle) {
        return warrantyClaimRepository.findByVehicle(vehicle);
    }
    @Override
    public List<WarrantyClaim> getWarrantyClaimsByCustomer(Customer customer) {
        return warrantyClaimRepository.findByCustomer(customer);
    }
    @Override
    public List<WarrantyClaim> getWarrantyClaimsByCenter(ServiceCenter center) {
        return warrantyClaimRepository.findByCenter(center);
    }
    @Override
    public List<WarrantyClaim> getWarrantyClaimsByTechnician(Technician technician) {
        return warrantyClaimRepository.findByTechnician(technician);
    }
    @Override
    public List<WarrantyClaim> getWarrantyClaimsByStaff(Staff staff) {
        return warrantyClaimRepository.findByStaff(staff);
    }
    @Override
    public List<WarrantyClaim> getWarrantyClaimsCreatedBetween(LocalDateTime start, LocalDateTime end) {
        return warrantyClaimRepository.findByCreatedAtBetween(start, end);
    }
    @Override
    public List<WarrantyClaim> getWarrantyClaimsByMinTotalCost(BigDecimal totalCost) {
        return warrantyClaimRepository.findByTotalCostGreaterThanEqual(totalCost);
    }

    @Override
    public WarrantyClaim updateClaimPrimaryStatus(Long claimId, String newStatus) {
        WarrantyClaim claim = warrantyClaimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim không tồn tại."));

        if (newStatus.equalsIgnoreCase("SENT")) {
            if (!claim.getStatus().equalsIgnoreCase("DRAFT")) {
                throw new IllegalArgumentException("Chỉ có thể gửi Claim ở trạng thái DRAFT.");
            }
            claim.setStatus("SENT");
            claim.setUpdatedAt(LocalDateTime.now());
        } else {
            throw new IllegalArgumentException("Trạng thái chuyển đổi không hợp lệ.");
        }
        return warrantyClaimRepository.save(claim);
    }

    @Override
    public WarrantyClaim updateClaimTechnician(Long claimId, Long technicianId) {
        WarrantyClaim claim = warrantyClaimRepository.findById(claimId).orElseThrow(() -> new IllegalArgumentException("Claim không tồn tại."));

        // 1. Kiểm tra Technician có tồn tại không
        Technician technician = technicianRepository.findById(technicianId).orElseThrow(() -> new IllegalArgumentException("Kỹ thuật viên không tồn tại."));

        // 2. Chỉ cho phép gán nếu Claim chưa hoàn thành hoặc bị từ chối
        if (claim.getStatus().equalsIgnoreCase("COMPLETED") || claim.getStatus().equalsIgnoreCase("REJECTED")) {
            throw new IllegalArgumentException("Không thể gán Kỹ thuật viên khi Claim ở trạng thái " + claim.getStatus() + ".");
        }

        // 3. Cập nhật trường Technician và thời gian
        claim.setTechnician(technician);
        claim.setUpdatedAt(LocalDateTime.now());
        
        return warrantyClaimRepository.save(claim);
    }
}