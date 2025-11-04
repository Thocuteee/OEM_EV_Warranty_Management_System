package edu.uth.warranty.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.dto.VehicleRequest;
import edu.uth.warranty.dto.VehicleResponse;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.service.ICustomerService;
import edu.uth.warranty.service.IVehicleService;
import jakarta.validation.Valid;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final IVehicleService vehicleService;
    private final ICustomerService customerService;
    
    @Autowired
    public VehicleController(IVehicleService vehicleService, ICustomerService customerService) {
        this.vehicleService = vehicleService;
        this.customerService = customerService; //lấy customer object
    }
    //convert vehicle sang vehicle response
    private VehicleResponse convertToResponse(Vehicle vehicle) {
        VehicleResponse response = new VehicleResponse();
        response.setId(vehicle.getVehicle_id());
        response.setVIN(vehicle.getVIN());
        response.setModel(vehicle.getModel());
        response.setYear(vehicle.getYear());

        // Lấy thông tin Chủ sở hữu từ CustomerService
        if (vehicle.getCustomer() != null) {
            response.setCustomerId(vehicle.getCustomer().getCustomer_id());
            response.setCustomerName(vehicle.getCustomer().getName());
        }

        return response;
    }
    @PostMapping
    private Vehicle convertToEntity(VehicleRequest request, Long vehicleId) throws IllegalArgumentException{

        // Lấy Customer từ CustomerService dựa trên customerId trong VehicleRequest
        Optional<Customer> customerOptional = customerService.getCustomerById(request.getCustomerId());
        if(customerOptional.isEmpty()){
            throw new IllegalArgumentException("Không tìm thấy khách hàng (Customer)với id " + request.getCustomerId() );
        }

        Customer customer = customerOptional.get();
        Vehicle vehicle = new Vehicle();
        if(vehicleId != null){
            vehicle.setVehicle_id(vehicleId);
        }
        vehicle.setCustomer(customer); // Gán Customer cho Vehicle
        vehicle.setVIN(request.getVIN());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        return vehicle;
    }
    //lấy all xe
    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        List<Vehicle> vehiclesList = vehicleService.getAllVehicle();

        //ánh xạ danh sách Vehicle sang VehicleResponse
        List<VehicleResponse> ResponsesList = new ArrayList<>();
        for (Vehicle vehicle : vehiclesList) { 
            ResponsesList.add(convertToResponse(vehicle));
        }
        return ResponseEntity.ok(ResponsesList);
        
    }
    //lấy xe theo id
    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        Optional<Vehicle> vehicleOptional = vehicleService.getAllById(id);

        if (vehicleOptional.isPresent()) {
            return ResponseEntity.ok(convertToResponse(vehicleOptional.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body (new MessageResponse ("Không tìm thấy xe (vehicle) với id " + id));
        }
    }
    // tạo mới xe
    @PostMapping("/create")
    public ResponseEntity<?> createVehicle( @Valid @RequestBody VehicleRequest vehicleRequest) {
        try {
            // ánh xạ dto sang model với id null
            Vehicle newvehicle = convertToEntity(vehicleRequest, null);
            //goi service lưu xe mới (service sẽ kiểm tra VIN có trùng không)
            Vehicle saveVehicle = vehicleService.saveVehicle(newvehicle);
            // ánh xạ model sang dto để trả về
            VehicleResponse response = convertToResponse(saveVehicle);
            //trả về response với mã 201
            return new ResponseEntity<>( response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Đã xảy ra lỗi khi tạo xe mới :" + e.getMessage()));
        }
    }
    

    //cập nhật thông tin xe theo id

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequest vehicleRequest) {
        
            // kiểm tra xe với id có tồn tại không
            Optional<Vehicle> existingVehicle = vehicleService.getAllById(id);
            if (existingVehicle.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Không tìm thấy xe (vehicle) với id " + id));
                    }
            try {
                // ánh xạ dto sang model với id đã cho
            Vehicle VehicleToUpdate = convertToEntity(vehicleRequest, id);
            //gọi service lưu thông tin xe cập nhật (service sẽ kiểm tra VIN có trùng không)
            Vehicle saveVehicle = vehicleService.saveVehicle(VehicleToUpdate);
            // ánh xạ model sang dto để trả về
            VehicleResponse response = convertToResponse(saveVehicle);
            //trả về response với mã 200
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Đã xảy ra lỗi khi cập nhật xe với id " + id + ": " + e.getMessage()));
        }
        
    }
    // xóa 1 xe
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id){
        Optional<Vehicle> existingVehicle = vehicleService.getAllById(id);
        if(existingVehicle.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("Không tìm thấy xe (vehicle) với ID " + id + "để xóa."));
        }
        try {
            vehicleService.deleteVehicle(id);

            return ResponseEntity.ok(new MessageResponse("Đã xóa thành công xe Id :" + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT) //409 CONFLICT
                    .body(new MessageResponse("Không thể xóa xe ID" + id +"xe này có thể đang liên kết với một Yêu cầu Bảo Hành hoặc trong Chiến dịch Thu Hồi."));
        }
    }
    
    
}


