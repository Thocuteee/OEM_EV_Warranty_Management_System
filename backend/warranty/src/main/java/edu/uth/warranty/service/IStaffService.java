package edu.uth.warranty.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.common.Role;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Staff;

@Service
public interface IStaffService {
    List<Staff> getStaff();

    Optional<Staff> getStaffById(Long id);
    Staff saveStaff(Staff staff);

    void deleteStaff(Long id);
    Optional<Staff> getStaffByUsername(String username);
    Optional<Staff> getStaffByEmail(String email);

    Optional<Staff> getStaffByPhone(String phone);

    List<Staff> getStaffByRole(String role);

    List<Staff> getStaffByServiceCenter(ServiceCenter center);

    List<Staff> getStaffByRoleAndCenter(Role role, ServiceCenter center);
}
