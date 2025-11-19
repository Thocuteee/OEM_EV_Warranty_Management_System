package edu.uth.warranty.repository;

import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>{
    Optional<Vehicle> findByVin(String Vin);

    Optional<Vehicle> findByModel(String model);

    List<Vehicle> findByCustomer(Customer customer);

    List<Vehicle> findByYear(String year);
}
