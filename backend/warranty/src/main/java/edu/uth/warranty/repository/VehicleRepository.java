package edu.uth.warranty.repository;


import java.util.List;
import java.util.Optional;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;




@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByVehicle_Customer(Long vehicle , Customer customer);
    
    Optional<Vehicle> findByVIN(String VIN);

    List<Vehicle> findByModel(String model);

    List<Vehicle> findByYear(String year);
}
