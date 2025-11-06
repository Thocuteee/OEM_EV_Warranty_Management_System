package edu.uth.warranty.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;

@Service
public interface IVehicleService {
    List<Vehicle> getAllVehicle();

    Optional<Vehicle> getAllById(Long id);

    Vehicle saveVehicle(Vehicle vehicle);

    void deleteVehicle(Long id);

    Optional<Vehicle> getVehicleByVIN(String VIN);

    boolean isVINUnique(String VIN);

    Optional<Vehicle> getVehicleById(Long id);

    List<Vehicle> getVehiclesByCustomer(Customer customer);

    Optional<Vehicle> getVehicleByModel(String model);

    List<Vehicle> getVehicleByYear(Integer year);
}
