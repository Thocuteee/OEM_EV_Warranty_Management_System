package edu.uth.warranty.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.repository.VehicleRepository;
import edu.uth.warranty.service.IVehicleService;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class VehicleServiceImpl implements IVehicleService {
    private final VehicleRepository vehicleRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    @Override
    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }
    @Override
    public Vehicle getVehicleByVIN(String VIN) {
        Optional<Vehicle> vehicle = vehicleRepository.findByVIN(VIN);
        return vehicle.orElse(null);
    }
    @Override
    public Vehicle getVehicleByModel(String model) {
        Optional<Vehicle> vehicle = vehicleRepository.findByModel(model);
        return vehicle.orElse(null);
    }
    @Override
    public List<Vehicle> getVehiclesByCustomer(Customer customer) {
        return vehicleRepository.findByCustomer(customer);
    }
    @Override
    public List<Vehicle> getVehiclesByYear(String year) {
        return vehicleRepository.findByYear(year);
    }
}
