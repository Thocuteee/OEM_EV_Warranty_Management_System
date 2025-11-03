package edu.uth.warranty.controller;

import edu.uth.warranty.dto.CustomerRequest;
import edu.uth.warranty.dto.CustomerResponse;

import edu.uth.warranty.model.Customer;

import edu.uth.warranty.service.ICustomerService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
            customer.getCustomer_id(),
            customer.getName(),
            customer.getPhone(),
            customer.getEmail(),
            customer.getAddress()
        );
    }

    private Customer toEntity(CustomerRequest request) {
        Customer customer = new Customer();
        if (request.getId() != null) {
            customer.setCustomer_id(request.getId());
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
    public ResponseEntity<List<CustomerResponse>> getAllCustomer() {
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
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable Long id, @RequestBody CustomerRequest request) {
        request.setId(id);

        if(customerService.getCustomerById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Customer updateCustomer = customerService.saveCustomer(toEntity(request));
        return ResponseEntity.ok(toResponseDTO(updateCustomer));
    }



    // 5. DELETE /api/customers/{id} : Xóa

    public ResponseEntity<CustomerResponse> getCustomerByPhone(@RequestParam String phone) {
        Optional<Customer> customer = customerService.getCustomersByPhone(phone);
        if(customer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(customer.get()));
    }




}
