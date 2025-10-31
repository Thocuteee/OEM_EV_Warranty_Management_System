package edu.uth.warranty.repository;

import edu.uth.warranty.model.ServiceCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ServiceCenterRepository extends JpaRepository<ServiceCenter, Long>{
    Optional<ServiceCenter> findByName(String name);

    List<ServiceCenter> findByLocation(String location);

    Boolean existsByName(String name);
}
