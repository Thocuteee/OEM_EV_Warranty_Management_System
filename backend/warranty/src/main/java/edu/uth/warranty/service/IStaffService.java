package edu.uth.warranty.service;

import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.common.Role;
import edu.uth.warranty.dto.StaffRequest;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IStaffService {
    List<Staff> getAllStaffs();
    Optional<Staff> getStaffById(Long id);

    Staff saveStaff(StaffRequest request);
    
    void deleteStaff(Long id);

    Optional<Staff> getStaffByUsername(String username);

    Optional<Staff> getStaffByEmail(String email);

    Optional<Staff> getStaffByPhone(String phone);

    List<Staff> getStaffsByRole(Role role);

    List<Staff> getStaffsByCenter(ServiceCenter center);

    List<Staff> getStaffsByRoleAndCenter(Role role, ServiceCenter center);
}
