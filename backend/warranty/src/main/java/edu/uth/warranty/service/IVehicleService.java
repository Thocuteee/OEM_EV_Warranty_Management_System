package edu.uth.warranty.service;

import java.util.List;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;
@Service
public interface IVehicleService {

    Vehicle saveVehicle(Vehicle vehicle);

    Vehicle getVehicleByVIN(String VIN);

    Vehicle getVehicleByModel(String model);

    List<Vehicle> getVehiclesByCustomer(Customer customer);
    List<Vehicle> getVehiclesByYear(String year);
    
}
