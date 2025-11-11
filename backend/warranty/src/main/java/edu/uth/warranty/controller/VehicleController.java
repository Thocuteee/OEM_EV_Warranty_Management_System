package edu.uth.warranty.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus; // Cần import để ánh xạ FK
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.uth.warranty.dto.VehicleRequest;
import edu.uth.warranty.dto.VehicleResponse;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.service.ICustomerService;
import edu.uth.warranty.service.IVehicleService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    
    private final IVehicleService vehicleService;
    private final ICustomerService customerService; 

    // Constructor Injection
    public VehicleController(IVehicleService vehicleService, ICustomerService customerService) {
        this.vehicleService = vehicleService;
        this.customerService = customerService;
    }

    // -----------------------
    // MAPPING HELPERS (Chuyển đổi DTO <-> Entity)
    // -----------------------

    // Chuyển đổi Entity sang Response DTO (Lấy tên khách hàng)
    private VehicleResponse toResponseDto(Vehicle vehicle) {
        // Lấy tên khách hàng từ Service để hiển thị
        String customerName = null;
        Long customerId = null;
        
        if (vehicle.getCustomer() != null && vehicle.getCustomer().getCustomerId() != null) {
             Optional<Customer> customerOpt = customerService.getCustomerById(vehicle.getCustomer().getCustomerId());
             if (customerOpt.isPresent()) {
                customerName = customerOpt.get().getName();
                customerId = customerOpt.get().getCustomerId();
             }
        }
        
        return new VehicleResponse(
            vehicle.getVehicleId(),
            vehicle.getVIN(),
            vehicle.getModel(),
            vehicle.getYear(),
            customerId,
            customerName // Tên khách hàng để hiển thị
        );
    }

    // Chuyển đổi Request DTO sang Entity
    private Vehicle toEntity(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        
        if (request.getId() != null) {
            vehicle.setVehicleId(request.getId());
        }
        
        // Map Khóa Ngoại (Customer FK)
        if (request.getCustomerId() != null) {
            Customer customer = new Customer();
            customer.setCustomerId(request.getCustomerId());
            vehicle.setCustomer(customer);
        }

        // Map các trường dữ liệu còn lại
        vehicle.setVIN(request.getVIN());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        
        return vehicle;
    }


    // -----------------------
    // REST API ENDPOINTS
    // -----------------------

    // 1. POST /api/vehicles : Đăng ký/Tạo mới Xe
    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request) {
        Vehicle newVehicle = toEntity(request);
        
        // Service sẽ kiểm tra tính duy nhất của VIN và FK Customer
        Vehicle savedVehicle = vehicleService.saveVehicle(newVehicle);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDto(savedVehicle));
    }
    
    // 2. GET /api/vehicles : Lấy tất cả Xe
    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicle() {
        List<Vehicle> vehicles = vehicleService.getAllVehicle();
        
        List<VehicleResponse> response = vehicles.stream()
            .map(this::toResponseDto)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(response);
    }
    
    // 3. GET /api/vehicles/search?vin={vin} : Tìm kiếm theo VIN
    @GetMapping("/search")
    public ResponseEntity<VehicleResponse> getVehicleByVIN(@RequestParam String vin) {
        Optional<Vehicle> vehicle = vehicleService.getVehicleByVIN(vin);
        
        if (vehicle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(toResponseDto(vehicle.get()));
    }
    
    // 4. PUT /api/vehicles/{id} : Cập nhật Xe
    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        request.setId(id);
        
        if (vehicleService.getVehicleById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Vehicle updatedVehicle = vehicleService.saveVehicle(toEntity(request));
        return ResponseEntity.ok(toResponseDto(updatedVehicle));
    }

    // 5. DELETE /api/vehicles/{id} : Xóa Xe
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        if (vehicleService.getVehicleById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
//new update 