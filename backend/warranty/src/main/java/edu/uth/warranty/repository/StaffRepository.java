package edu.uth.warranty.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.common.Role;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Staff;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long>{
    Optional<Staff> findByUsername(String username);

    Optional<Staff> findByEmail(String email);

    Optional<Staff> findByPhone(String phone);

    List<Staff> findByRole(Role role);

    List<Staff> findByCenter(ServiceCenter center);
    List<Staff> findByRoleAndCenter(Role role, ServiceCenter centerId);


}
