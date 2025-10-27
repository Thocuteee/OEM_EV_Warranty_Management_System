package edu.uth.warranty.repository;

import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.ServiceCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long>{
    Optional<Technician> findByName(String name);

    Optional<Technician> findByPhone(String phone);

    Optional<Technician> findByEmail(String email);

    Optional<Technician> findBySpecialization(String specialization, ServiceCenter center);

}
