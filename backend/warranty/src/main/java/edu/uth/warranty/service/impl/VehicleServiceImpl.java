package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.User;
import edu.uth.warranty.repository.VehicleRepository;
import edu.uth.warranty.repository.CustomerRepository;
import edu.uth.warranty.repository.UserRepository;
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
    private final UserRepository userRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository ,CustomerRepository customerRepository,UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
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
            if (vehicle.getVehicleId() == null || !vehicle.getVehicleId().equals(exitstingVehicle.get().getVehicleId())) {
                throw new IllegalArgumentException("Số VIN đã tồn tại trong hệ thống.");
            }
        }

        if(vehicle.getVehicleId() != null) {
            vehicle.setRegistrationStatus("PENDING");
            if(vehicle.getRegisteredBy() == null || vehicle.getRegisteredBy().getId() == null) {
                 // Đây là check an toàn, Frontend lẽ ra phải bắt buộc gửi ID
                throw new IllegalArgumentException("Không xác định được ID người đăng ký.");
            }

            User user = userRepository.findById(vehicle.getRegisteredBy().getId())
                .orElseThrow(() -> new IllegalArgumentException("Người đăng ký (User ID: " + vehicle.getRegisteredBy().getId() + ") không tồn tại."));
            
            vehicle.setRegisteredBy(user);

        } else {
            Optional<Vehicle> existing = vehicleRepository.findById(vehicle.getVehicleId());
            if (existing.isEmpty()) {
                throw new IllegalArgumentException("Không thể cập nhật: Xe không tồn tại.");
            }

            vehicle.setRegistrationStatus(existing.get().getRegistrationStatus());
            vehicle.setRegisteredBy(existing.get().getRegisteredBy());

            // (LƯU Ý: Nếu request update cần thay đổi Customer ID, bạn phải gán lại Customer entity tại đây)
            if (vehicle.getCustomer().getCustomerId() == null) {
                 // Nếu DTO không gửi customer object đầy đủ, gán lại customer cũ
                vehicle.setCustomer(existing.get().getCustomer());
            }
        }

        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle updateRegistrationStatus(Long vehicleId, String newStatus, Long approverUserId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new IllegalArgumentException("Xe không tồn tại."));
        String status = newStatus.toUpperCase();

        if (!List.of("APPROVED", "REJECTED").contains(status)) {
            throw new IllegalArgumentException("Trạng thái phê duyệt không hợp lệ.");
        }

        if (!vehicle.getRegistrationStatus().equals("PENDING")) {
            throw new IllegalArgumentException("Chỉ có thể thay đổi trạng thái xe ở trạng thái PENDING.");
        }

        vehicle.setRegistrationStatus(status);
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
