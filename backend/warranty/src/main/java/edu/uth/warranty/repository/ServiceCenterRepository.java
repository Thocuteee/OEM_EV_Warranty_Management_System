package edu.uth.warranty.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.ServiceCenter;

@Repository
public interface ServiceCenterRepository extends JpaRepository<ServiceCenter, Long>{
    Optional<ServiceCenter> findByName(String name);

    List<ServiceCenter> findByLocation(String location);

    boolean existsByName(String name);
}
