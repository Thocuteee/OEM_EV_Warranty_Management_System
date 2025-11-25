package edu.uth.warranty.repository;

import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.common.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
@Repository
public interface StaffRepository extends JpaRepository<Staff, Long>{
    Optional<Staff> findByUsername(String username);

    @Query("SELECT s FROM Staff s JOIN FETCH s.center WHERE s.username = :username")
    Optional<Staff> findByUsernameWithCenter(String username);

    Optional<Staff> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<Staff> findByPhone(String phone);

    //! Sua 

    @Query("SELECT s FROM Staff s JOIN FETCH s.center WHERE s.center = :center")
    List<Staff> findByRoleWithCenter(Role role);

    @Query("SELECT s FROM Staff s JOIN FETCH s.center WHERE s.center = :center")
    List<Staff> findByCenterWithCenter(ServiceCenter center);

    @Query("SELECT s FROM Staff s JOIN FETCH s.center WHERE s.role = :role AND s.center = :center")
    List<Staff> findByRoleAndCenterWithCenter(Role role, ServiceCenter center);

    @Query("SELECT s FROM Staff s JOIN FETCH s.center")
    List<Staff> findAllWithCenter();

    @Query("SELECT s FROM Staff s JOIN FETCH s.center WHERE s.staffId = :id")
    Optional<Staff> findByIdWithCenter(Long id);
}
