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
    public Staff saveStaff(StaffRequest request) { // SỬA: Nhận StaffRequest DTO
        // 1. Kiểm tra Service Center có tồn tại không
        if (request.getCenterId() == null) {
            throw new IllegalArgumentException("Nhân viên phải được gán cho một Trung tâm Dịch vụ hợp lệ.");
        }
        ServiceCenter center = serviceCenterRepository.findById(request.getCenterId())
            .orElseThrow(() -> new IllegalArgumentException("Trung tâm dịch vụ không tồn tại."));

        Staff staff;
        
        // 2. Logic Ánh xạ và Kiểm tra
        if (request.getId() != null) { // Logic Cập nhật (Sẽ phức tạp hơn, ta tập trung vào Tạo mới)
            staff = staffRepository.findById(request.getId())
                .orElseThrow(() -> new IllegalArgumentException("Hồ sơ Staff không tồn tại."));
            
            // Kiểm tra tính duy nhất khi cập nhật
            Optional<Staff> existingByUsername = staffRepository.findByUsername(request.getUsername());
            if (existingByUsername.isPresent() && !staff.getStaffId().equals(existingByUsername.get().getStaffId())) {
                throw new IllegalArgumentException("Tên đăng nhập đã tồn tại.");
            }
            Optional<Staff> existingByEmail = staffRepository.findByEmail(request.getEmail());
            if (existingByEmail.isPresent() && !staff.getStaffId().equals(existingByEmail.get().getStaffId())) {
                throw new IllegalArgumentException("Email đã tồn tại.");
            }

        } else {
            // Logic Tạo mới (Chủ yếu từ UserService)
            staff = new Staff();
            // Kiểm tra Username và Email đã tồn tại (Chỉ kiểm tra nếu tạo mới)
            if (staffRepository.findByUsername(request.getUsername()).isPresent() || staffRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Username hoặc Email đã tồn tại.");
            }
        }
        
        // 3. Ánh xạ dữ liệu từ Request DTO sang Entity Staff
        staff.setStaffId(request.getId()); // ID này là PK/FK từ bảng User
        staff.setCenter(center); 
        staff.setName(request.getName());
        staff.setRole(request.getRole());
        staff.setEmail(request.getEmail()); 
        staff.setPhone(request.getPhone());
        staff.setAddress(request.getAddress()); 
        staff.setUsername(request.getUsername());
        
        // Mã hóa mật khẩu nếu được cung cấp (Logic này chỉ áp dụng nếu Staff tự tạo, 
        // nhưng ta giữ để hệ thống hoạt động)
        if (request.getPassword() != null && !request.getPassword().isEmpty() && !request.getPassword().startsWith("$2a$")) {
            String hashedPassword = passwordEncoder.encode(request.getPassword());
            staff.setPassword(hashedPassword);
        } else if (request.getPassword() != null && request.getPassword().startsWith("$2a$")) {
            staff.setPassword(request.getPassword()); // Nếu đã mã hóa (từ UserService)
        }

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