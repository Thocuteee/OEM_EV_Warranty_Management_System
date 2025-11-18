package edu.uth.warranty.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.uth.warranty.dto.VehicleRequest;
import edu.uth.warranty.dto.VehicleResponse;
import edu.uth.warranty.dto.MessageResponse; 
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

    public VehicleController(IVehicleService vehicleService, ICustomerService customerService) {
        this.vehicleService = vehicleService;
        this.customerService = customerService;
    }

    private VehicleResponse toResponseDto(Vehicle vehicle) {
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
            customerName
        );
    }

    private Vehicle toEntity(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        
        if (request.getId() != null) {
            vehicle.setVehicleId(request.getId());
        }
        
        if (request.getCustomerId() != null) {
            Customer customer = new Customer();
            customer.setCustomerId(request.getCustomerId()); 
            vehicle.setCustomer(customer);
        }

        vehicle.setVIN(request.getVIN());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        
        return vehicle;
    }

    // 1. POST /api/vehicles : Đăng ký/Tạo mới Xe
    @PostMapping
    public ResponseEntity<?> createVehicle(@Valid @RequestBody VehicleRequest request) {
        try {
            Vehicle newVehicle = toEntity(request);
            newVehicle.setVehicleId(null); 
            
            Vehicle savedVehicle = vehicleService.saveVehicle(newVehicle);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDto(savedVehicle));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
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
    
    // 3. GET /api/vehicles/{id} : Lấy chi tiết Xe theo ID (ĐÃ THÊM)
    @GetMapping("/{id}") 
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable Long id) {
        Optional<Vehicle> vehicle = vehicleService.getAllById(id);
        
        if (vehicle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(toResponseDto(vehicle.get()));
    }
    
    // 4. GET /api/vehicles/search?vin={vin} : Tìm kiếm theo VIN
    @GetMapping("/search")
    public ResponseEntity<VehicleResponse> getVehicleByVIN(@RequestParam String vin) {
        Optional<Vehicle> vehicle = vehicleService.getVehicleByVIN(vin);
        
        if (vehicle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(toResponseDto(vehicle.get()));
    }
    
    // 5. PUT /api/vehicles/{id} : Cập nhật Xe
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        request.setId(id);
        
        if (vehicleService.getAllById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            Vehicle updatedVehicle = vehicleService.saveVehicle(toEntity(request));
            return ResponseEntity.ok(toResponseDto(updatedVehicle));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 6. DELETE /api/vehicles/{id} : Xóa Xe
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        if (vehicleService.getAllById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
