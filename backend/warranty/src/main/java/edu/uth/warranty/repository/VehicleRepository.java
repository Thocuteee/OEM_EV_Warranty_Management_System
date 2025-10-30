package edu.uth.warranty.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>{
    Optional<Vehicle> findByVIN(String VIN);

    Optional<Vehicle> findByModel(String model);

    List<Vehicle> findByCustomer(Customer customer);


    List<Vehicle> findByYear(String year);
}
