package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.repository.VehicleRepository;
import edu.uth.warranty.repository.CustomerRepository;
import edu.uth.warranty.service.IVehicleService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VehicleServiceImpl implements IVehicleService{
    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository ,CustomerRepository customerRepository) {
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public List<Vehicle> getAllVehicle() {
        return vehicleRepository.findAll();
    }

    @Override
    public Optional<Vehicle> getAllById(Long id) {
        return vehicleRepository.findById(id);
    }

    @Override
    public Vehicle saveVehicle(Vehicle vehicle) {
        // Đảm bảo Customer đã tồn tại trước khi đăng ký/cập nhật xe
        if(vehicle.getCustomer() == null || vehicle.getCustomer().getCustomerId() == null) {
            throw new IllegalArgumentException("Vehicle phải liên kết với một Customer hợp lệ.");
        }

        Optional<Customer> existingCustomer = customerRepository.findById(vehicle.getCustomer().getCustomerId());
        if(existingCustomer.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy Customer trong hệ thống.");
        }
        //Kiểm tra tính duy nhất của VIN
        Optional<Vehicle> exitstingVehicle = vehicleRepository.findByVIN(vehicle.getVIN());
        // Nếu là xe mới (chưa có ID) HOẶC là xe cũ nhưng cố tình thay đổi VIN
        if(exitstingVehicle.isPresent()) {
            if (vehicle.getVehicle_id() == null || !vehicle.getVehicle_id().equals(exitstingVehicle.get().getVehicle_id())) {
                throw new IllegalArgumentException("Số VIN đã tồn tại trong hệ thống.");
            }
        }
        return vehicleRepository.save(vehicle);
    }

    @Override
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    @Override
    public Optional<Vehicle> getVehicleByVIN(String VIN) {
        return vehicleRepository.findByVIN(VIN);
    }

    @Override
    public boolean isVINUnique(String VIN) {
        return vehicleRepository.findByVIN(VIN).isEmpty();
    }

    @Override
    public List<Vehicle> getVehiclesByCustomer(Customer customer) {
        return vehicleRepository.findByCustomer(customer);
    }

    @Override
    public Optional<Vehicle> getVehicleByModel(String model) {
        return vehicleRepository.findByModel(model);
    }

    @Override
    public List<Vehicle> getVehiclesByYear(String year) {
        return vehicleRepository.findByYear(year);
    }
}
