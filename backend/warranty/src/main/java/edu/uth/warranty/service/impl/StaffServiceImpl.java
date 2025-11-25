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
    boolean isNewProfileWithId = false; // Flag để xác định có phải tạo mới với ID đã set không
    
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
            staff.setStaffId(request.getId()); // <<< Gán ID của User để đồng bộ với bảng User
            isNewProfileWithId = true; // Đánh dấu là tạo mới với ID đã set
        }
    } else {
        // Trường hợp C: Tạo mới hoàn toàn (ID là null, sẽ được auto-increment)
        staff = new Staff();
        // Áp dụng kiểm tra duy nhất cho tạo mới (nếu gọi API Staff riêng)
        if (staffRepository.findByUsername(request.getUsername()).isPresent() || staffRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Username hoặc Email đã tồn tại.");
        }
    }
    
    // ... (Ánh xạ dữ liệu và xử lý mật khẩu)
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
        // Giữ lại mật khẩu cũ nếu là cập nhật (không phải tạo mới)
        Staff existingUser = staffRepository.findById(request.getId()).orElse(null);
        if (existingUser != null && existingUser.getPassword() != null) {
            staff.setPassword(existingUser.getPassword());
        }
    }
    
    // Khi tạo mới với ID đã set, sử dụng native query để insert trực tiếp
    // vì @GeneratedValue sẽ ignore ID đã set khi dùng save() hoặc merge()
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
        // Tìm lại entity từ database sau khi insert
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