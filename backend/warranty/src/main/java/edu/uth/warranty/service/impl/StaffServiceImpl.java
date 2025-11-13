package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.common.Role;
import edu.uth.warranty.repository.StaffRepository;
import edu.uth.warranty.repository.ServiceCenterRepository; 
import edu.uth.warranty.service.IStaffService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    public Staff saveStaff(Staff staff) {
        //Kiểm tra Service Center có tồn tại không
        if (staff.getCenter() == null || staff.getCenter().getCenterId() == null) {
            throw new IllegalArgumentException("Nhân viên phải được gán cho một Trung tâm Dịch vụ hợp lệ.");
        }
        if (serviceCenterRepository.findById(staff.getCenter().getCenterId()).isEmpty()) {
            throw new IllegalArgumentException("Trung tâm dịch vụ không tồn tại.");
        }

        //Kiểm tra tính duy nhất của Username, Email, Phone
        
        // Kiểm tra Username
        Optional<Staff> existingStaffByUsername = staffRepository.findByUsername(staff.getUsername());
        if (existingStaffByUsername.isPresent() && (staff.getStaffId() == null || !staff.getStaffId().equals(existingStaffByUsername.get().getStaffId()))) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại.");
        }

        // Kiểm tra Email
        Optional<Staff> existingStaffByEmail = staffRepository.findByEmail(staff.getEmail());
        if (existingStaffByEmail.isPresent() && (staff.getStaffId() == null || !staff.getStaffId().equals(existingStaffByEmail.get().getStaffId()))) {
            throw new IllegalArgumentException("Email đã tồn tại.");
        }

        if (staff.getPassword() != null && !staff.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(staff.getPassword());
            staff.setPassword(hashedPassword); 
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
