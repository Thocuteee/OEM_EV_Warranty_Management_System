package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.common.Role;
import edu.uth.warranty.dto.StaffRequest;
import edu.uth.warranty.repository.StaffRepository;
import edu.uth.warranty.repository.ServiceCenterRepository; 
import edu.uth.warranty.service.IStaffService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.Hibernate; 
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StaffServiceImpl implements IStaffService{
    private final StaffRepository staffRepository;
    private final ServiceCenterRepository serviceCenterRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffServiceImpl(StaffRepository staffRepository, ServiceCenterRepository serviceCenterRepository, PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.serviceCenterRepository = serviceCenterRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Staff> getAllStaffs() {
        return staffRepository.findAll();
    }

    @Override
    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    @Override
public Staff saveStaff(StaffRequest request) { 
    // 1. Kiểm tra Center (FK)
    ServiceCenter center = serviceCenterRepository.findById(request.getCenterId())
        .orElseThrow(() -> new IllegalArgumentException("Trung tâm dịch vụ không tồn tại."));

    Staff staff;
    
    // BƯỚC SỬA 1: Xử lý TẠO MỚI PROFILE cho User ID đã tồn tại
    if (request.getId() != null) {
        Optional<Staff> existingStaffOpt = staffRepository.findById(request.getId());

        if (existingStaffOpt.isPresent()) {
            // Trường hợp A: CẬP NHẬT hồ sơ đã có 
            staff = existingStaffOpt.get();
        } else {
            // Trường hợp B: TẠO MỚI PROFILE cho User ID đã có (KHÔNG có Staff cũ)
            // Khởi tạo entity MỚI và GÁN ID TỪ REQUEST
            staff = new Staff();
            staff.setStaffId(request.getId()); 
            
            // Do Staff entity mới được tạo bằng ID, nó sẽ thực hiện INSERT
            // Dòng code này khắc phục lỗi "Hồ sơ Staff không tồn tại"
        }
    } else {
        // Trường hợp C: Tạo mới hoàn toàn (ID là null, sẽ được auto-increment)
        staff = new Staff();
        // Áp dụng kiểm tra duy nhất cho tạo mới (nếu gọi API Staff riêng)
        if (staffRepository.findByUsername(request.getUsername()).isPresent() || staffRepository.findByEmail(request.getEmail()).isPresent()) {
             throw new IllegalArgumentException("Username hoặc Email đã tồn tại.");
        }
    }
    
    // 2. Ánh xạ dữ liệu chung
    staff.setCenter(center); 
    staff.setName(request.getName());
    staff.setRole(request.getRole());
    staff.setPhone(request.getPhone());
    staff.setAddress(request.getAddress());
    staff.setEmail(request.getEmail());
    staff.setUsername(request.getUsername());

    // 3. Xử lý Mật khẩu
    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
        if (!request.getPassword().startsWith("$2a$")) {
            staff.setPassword(passwordEncoder.encode(request.getPassword()));
        } else {
            staff.setPassword(request.getPassword());
        }
    }
    
    // BƯỚC SỬA 2: Đảm bảo không có xung đột transaction.
    // Nếu bạn đã thực hiện các sửa đổi tương tự như trong phản hồi trước, 
    // việc saveStaff() sẽ hoạt động sau khi logic được phân tách rõ ràng.
    return staffRepository.save(staff);
}

    @Override
    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }

    @Override
    public Optional<Staff> getStaffByUsername(String username) {
        return staffRepository.findByUsername(username);
    }

    @Override
    public Optional<Staff> getStaffByEmail(String email) {
        return staffRepository.findByEmail(email);
    }

    @Override
    public Optional<Staff> getStaffByPhone(String phone) {
        return staffRepository.findByPhone(phone);
    }

    @Override
    public List<Staff> getStaffsByRole(Role role) {
        return staffRepository.findByRole(role);
    }

    @Override
    public List<Staff> getStaffsByCenter(ServiceCenter center) {
        return staffRepository.findByCenter(center);
    }

    @Override
    public List<Staff> getStaffsByRoleAndCenter(Role role, ServiceCenter center) {
        return staffRepository.findByRoleAndCenter(role, center);
    }
}