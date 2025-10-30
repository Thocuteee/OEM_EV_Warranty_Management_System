package edu.uth.warranty.repository;

import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.common.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
@Repository
public interface StaffRepository extends JpaRepository<Staff, Long>{
    Optional<Staff> findByUsername(String username);

    Optional<Staff> findByEmail(String email);

    Optional<Staff> findByPhone(String phone);

    List<Staff> findByRole(Role role);

    List<Staff> findByRoleAndCenter(Role role, ServiceCenter center);
}
