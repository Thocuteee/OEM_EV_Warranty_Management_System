package edu.uth.warranty.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Technician;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long>{
    Optional<Technician> findByName(String name);

    Optional<Technician> findByPhone(String phone);

    Optional<Technician> findByEmail(String email);

    List<Technician> findByCenter(ServiceCenter center);

    //? có nối 1:n center, kiểu chứa Entity sang Reponsitory
    List<Technician> findBySpecializationAndCenter(String specialization, ServiceCenter center);
}
