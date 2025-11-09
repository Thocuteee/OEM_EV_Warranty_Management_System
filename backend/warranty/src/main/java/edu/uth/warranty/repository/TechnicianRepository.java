package edu.uth.warranty.repository;

import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.ServiceCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long>{
    Optional<Technician> findByName(String name);

    Optional<Technician> findByPhone(String phone);

    Optional<Technician> findByEmail(String email);

    List<Technician> findByCenter(ServiceCenter center);

    //? có nối 1:n center, kiểu chứa Entity sang Reponsitory 
    List<Technician> findBySpecializationAndCenter(String specialization, ServiceCenter center);

    Optional<Technician> findByUsername(String username);
}
