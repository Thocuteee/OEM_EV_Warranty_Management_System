package edu.uth.warranty.service;

import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.Customer;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IVehicleService {
    List<Vehicle> getAllVehicle();

    Optional<Vehicle> getAllById(Long id);

    Vehicle saveVehicle(Vehicle vehicle);

    void deleteVehicle(Long id);

    Optional<Vehicle> getVehicleByVIN(String VIN);

    boolean isVINUnique(String VIN);

    List<Vehicle> getVehiclesByCustomer(Customer customer);

    Optional<Vehicle> getVehicleByModel(String model);

    List<Vehicle> getVehiclesByYear(String year);
}
