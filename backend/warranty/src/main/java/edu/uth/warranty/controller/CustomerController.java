package edu.uth.warranty.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.uth.warranty.dto.CustomerRequest;
import edu.uth.warranty.dto.CustomerResponse;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.service.ICustomerService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final ICustomerService customerService;

    public CustomerController(ICustomerService customerService) {
        this.customerService = customerService;
    }

    // Chuyển đổi Entity sang Response DTO
    private CustomerResponse toResponseDTO(Customer customer) {
        return new CustomerResponse(
            customer.getCustomerId(),
            customer.getName(),
            customer.getPhone(),
            customer.getEmail(),
            customer.getAddress()
        );
    }

    private Customer toEntity(CustomerRequest request) {
        Customer customer = new Customer();
        if (request.getId() != null) {
            customer.setCustomerId(request.getId());
        }
        
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        
        return customer;
    }

    // 1. POST /api/customers : Tạo mới Khách hàng
    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRequest request) {
        Customer newCustomer = toEntity(request);
        Customer saveCustomer = customerService.saveCustomer(newCustomer);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saveCustomer));
    }
    // 2. GET /api/customers : Lấy tất cả Khách hàng
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        List<CustomerResponse> customerResponses = customers.stream().map(this::toResponseDTO).collect(Collectors.toList());

        return ResponseEntity.ok(customerResponses);
    }
    // 3. GET /api/customers/{id} : Lấy chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerService.getCustomerById(id);

        if(customer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(customer.get()));
    }


    // 4. PUT /api/customers/{id} : Cập nhật Khách hàng
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerRequest request) { 
        request.setId(id);

        if(customerService.getCustomerById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Customer updateCustomer = customerService.saveCustomer(toEntity(request));
        return ResponseEntity.ok(toResponseDTO(updateCustomer));
    }



    // 5. DELETE /api/customers/{id} : Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if(customerService.getCustomerById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

}
