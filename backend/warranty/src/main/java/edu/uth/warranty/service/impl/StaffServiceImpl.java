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
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StaffServiceImpl implements IStaffService{
    private final StaffRepository staffRepository;
    private final ServiceCenterRepository serviceCenterRepository;
    private final PasswordEncoder passwordEncoder;
    
    @PersistenceContext
    private EntityManager entityManager;

    public StaffServiceImpl(StaffRepository staffRepository, ServiceCenterRepository serviceCenterRepository, PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.serviceCenterRepository = serviceCenterRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Staff> getAllStaffs() {
        return staffRepository.findAllWithCenter();
    }

    @Override
    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findByIdWithCenter(id);
    }

    @Override
public Staff saveStaff(StaffRequest request) { 
    // 1. Kiểm tra Center (FK)
    ServiceCenter center = serviceCenterRepository.findById(request.getCenterId())
        .orElseThrow(() -> new IllegalArgumentException("Trung tâm dịch vụ không tồn tại."));

    Staff staff;
    boolean isNewProfileWithId = false;
    
    if (request.getId() != null) {
        Optional<Staff> existingStaffOpt = staffRepository.findById(request.getId());

        if (existingStaffOpt.isPresent()) {
            
            staff = existingStaffOpt.get();
        } else {
            staff = new Staff();
            staff.setStaffId(request.getId()); 
            isNewProfileWithId = true; 
        }
    } else {
        staff = new Staff();
        if (staffRepository.findByUsername(request.getUsername()).isPresent() || staffRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Username hoặc Email đã tồn tại.");
        }
    }
    
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
    } else if (request.getId() != null && !isNewProfileWithId) {
        Staff existingUser = staffRepository.findById(request.getId()).orElse(null);
        if (existingUser != null && existingUser.getPassword() != null) {
            staff.setPassword(existingUser.getPassword());
        }
    }
    
    if (isNewProfileWithId) {
        // Sử dụng native query để insert với ID đã set
        String sql = "INSERT INTO Staff (staff_id, center_id, name, role, phone, address, email, username, password) " + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        entityManager.createNativeQuery(sql)
            .setParameter(1, staff.getStaffId())
            .setParameter(2, staff.getCenter().getCenterId())
            .setParameter(3, staff.getName())
            .setParameter(4, staff.getRole().name())
            .setParameter(5, staff.getPhone())
            .setParameter(6, staff.getAddress())
            .setParameter(7, staff.getEmail())
            .setParameter(8, staff.getUsername())
            .setParameter(9, staff.getPassword())
            .executeUpdate();
        
        entityManager.flush();
        return staffRepository.findByIdWithCenter(staff.getStaffId())
            .orElseThrow(() -> new IllegalStateException("Không thể tìm thấy Staff sau khi tạo mới"));
    } else {
        return staffRepository.save(staff);
    }
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
        return staffRepository.findByRoleWithCenter(role);
    }

    @Override
    public List<Staff> getStaffsByCenter(ServiceCenter center) {
        return staffRepository.findByCenterWithCenter(center);
    }

    @Override
    public List<Staff> getStaffsByRoleAndCenter(Role role, ServiceCenter center) {
        return staffRepository.findByRoleAndCenterWithCenter(role, center);
    }
}