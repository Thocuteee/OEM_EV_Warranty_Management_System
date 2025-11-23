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
        
        // --- 1. XÁC ĐỊNH NGƯỜI TẠO VÀ GÁN STAFF ENTITY HỢP LỆ ---
    Long creatorId = warrantyClaim.getStaff() != null ? warrantyClaim.getStaff().getStaffId() : null;
    Staff assignedStaff = null;

    if (creatorId == null) {
        throw new IllegalArgumentException("Người tạo (Staff ID) là bắt buộc.");
    }

    // 1a. Tìm kiếm trong bảng Staff (Áp dụng cho Admin, EVM_Staff, SC_Staff)
    Optional<Staff> staffOpt = staffRepository.findById(creatorId);
    
    if (staffOpt.isPresent()) {
        assignedStaff = staffOpt.get(); // Là Staff hợp lệ
    } else {
        // 1b. Nếu không phải Staff, kiểm tra xem có phải Technician (SC_Technician) không
        Optional<Technician> techOpt = technicianRepository.findById(creatorId);
        
        if (techOpt.isPresent()) {
            // Nếu là Technician, gán Staff đại diện (ID 1) cho trường staff (FK bắt buộc)
            // Lưu ý: ID 1 phải tồn tại và là Admin/Staff hợp lệ
            assignedStaff = staffRepository.findById(1L)
                .orElseThrow(() -> new IllegalArgumentException("Hồ sơ Staff đại diện (ID 1) không tồn tại. Vui lòng đăng ký Admin Staff đầu tiên."));
        } else {
            // Không phải Staff, không phải Technician -> Lỗi
            throw new IllegalArgumentException("ID người tạo (" + creatorId + ") không tồn tại là Staff hoặc Technician.");
        }
    }
    
    // Gán lại Staff Entity đã xác thực/đại diện
    warrantyClaim.setStaff(assignedStaff);
    // ----------------------------------------------------


    // --- 2. KIỂM TRA CÁC KHÓA NGOẠI KHÁC (Tối ưu hóa và kiểm tra ID chi tiết) ---
    
    // VEHICLE ID (BẮT BUỘC)
    Long vehicleId = warrantyClaim.getVehicle() != null ? warrantyClaim.getVehicle().getVehicleId() : null;
    Vehicle vehicle = vehicleId != null ? vehicleRepository.findById(vehicleId).orElseThrow(() -> 
        new IllegalArgumentException("Xe (Vehicle ID: " + vehicleId + ") không tồn tại.")
    ) : null;
    warrantyClaim.setVehicle(vehicle);

    
    // CUSTOMER ID (BẮT BUỘC)
    Long customerId = warrantyClaim.getCustomer() != null ? warrantyClaim.getCustomer().getCustomerId() : null;
    Customer customer = customerId != null ? customerRepository.findById(customerId).orElseThrow(() -> 
        new IllegalArgumentException("Khách hàng (Customer ID: " + customerId + ") không tồn tại.")
    ) : null;
    warrantyClaim.setCustomer(customer);
    
    
    // SERVICE CENTER ID (BẮT BUỘC)
    Long centerId = warrantyClaim.getCenter() != null ? warrantyClaim.getCenter().getCenterId() : null;
    ServiceCenter center = centerId != null ? serviceCenterRepository.findById(centerId).orElseThrow(() -> 
        new IllegalArgumentException("Trung tâm dịch vụ (Center ID: " + centerId + ") không tồn tại.")
    ) : null;
    warrantyClaim.setCenter(center);
    
    
    // TECHNICIAN ID (TÙY CHỌN)
    if (warrantyClaim.getTechnician() != null && warrantyClaim.getTechnician().getTechnicianId() != null) {
        Long technicianId = warrantyClaim.getTechnician().getTechnicianId();
        Technician technician = technicianRepository.findById(technicianId).orElseThrow(() -> 
            new IllegalArgumentException("Kỹ thuật viên (Technician ID: " + technicianId + ") không tồn tại.")
        );
        warrantyClaim.setTechnician(technician);
    } else {
        // Gán null nếu không gán Technician
        warrantyClaim.setTechnician(null);
    }
    
    
    // --- LOGIC KHỞI TẠO CLAIM MỚI (DRAFT) ---
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

    @Override
    public List<WarrantyClaim> getWarrantyClaimsByStatusIn(List<String> statuses) {
        return warrantyClaimRepository.findByStatusIn(statuses);
    }
}