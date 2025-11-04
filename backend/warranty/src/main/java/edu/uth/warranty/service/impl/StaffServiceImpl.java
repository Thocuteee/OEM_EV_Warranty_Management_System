package edu.uth.warranty.service.impl;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.uth.warranty.common.Role;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Staff;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.repository.StaffRepository;
import edu.uth.warranty.service.IStaffService;

@Service
@Transactional
public class StaffServiceImpl implements IStaffService {
    private final StaffRepository staffRepository;
    private final ServiceCenterRepository serviceCenterRepository;

    public StaffServiceImpl(StaffRepository staffRepository, ServiceCenterRepository serviceCenterRepository) {
        this.staffRepository = staffRepository;
        this.serviceCenterRepository = serviceCenterRepository;
    }

    @Override
    public List<Staff> getStaff() {
        return staffRepository.findAll();
    }

    @Override
    public Optional<Staff> getStaffById(Long Id) {
        return staffRepository.findById(Id);
    }

    @Override
    public Staff saveStaff(Staff staff) {
        if(staff.getCenter() != null && staff.getCenter().getCenter_id() != null) {
            throw new IllegalArgumentException("Không thể gán trung tâm chỉ bằng ID. Vui lòng cung cấp đối tượng ServiceCenter hợp lệ.");
        }
        if(serviceCenterRepository.findById(staff.getCenter().getCenter_id()).isEmpty()) {
            throw new IllegalArgumentException("Trung tâm dịch vụ với ID " + staff.getCenter().getCenter_id() + " không tồn tại.");
        }
        
        Optional<Staff> existingStaff = staffRepository.findByEmail(staff.getEmail());
        if(existingStaff.isPresent() && (staff.getStaff_id() == null || !existingStaff.get().getStaff_id().equals(staff.getStaff_id()))) {
            throw new IllegalArgumentException("Email đã tồn tại");
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
    public List<Staff> getStaffByRole(String role) {
        return staffRepository.findByRole(Role.valueOf(role));
    }

    @Override
    public List<Staff> getStaffByServiceCenter(ServiceCenter center) {
        return staffRepository.findByCenter(center);
    }

    @Override
    public List<Staff> getStaffByRoleAndCenter(Role role, ServiceCenter center) {
        return staffRepository.findByRoleAndCenter(role, center);
    }

}

