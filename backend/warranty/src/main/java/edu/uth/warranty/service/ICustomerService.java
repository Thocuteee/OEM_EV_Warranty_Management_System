package edu.uth.warranty.service;

import edu.uth.warranty.model.Customer;

import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;


@Service
public interface ICustomerService {
    List<Customer> getAllCustomers();
    Optional<Customer> getCustomerById(Long id);

    //?Tạo mới hoặc Cập nhật thông tin Khách hàng.
    Customer saveCustomer(Customer customer);

    void deleteCustomer(Long id);

    //Tìm kiếm Khách hàng bằng Email
    Optional<Customer> getCustomersByEmail(String email);

    Optional<Customer> getCustomersByPhone(String phone);

    List<Customer> getCustomersByName(String name);

    List<Customer> getCustomersByAddress(String address);

    Boolean isEmailUnique(String email); 
    Boolean isPhoneUnique(String phone);
}   
