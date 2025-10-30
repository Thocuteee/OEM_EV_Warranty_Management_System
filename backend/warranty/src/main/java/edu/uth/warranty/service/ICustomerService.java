package edu.uth.warranty.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.Customer;


@Service
public interface ICustomerService {
    List<Customer> getAllCustomer();
    Optional<Customer> getCustomerById(Long id);

    //?Tạo mới hoặc Cập nhật thông tin Khách hàng.
    Customer saveCustomer(Customer customer);

    void deleteCustomer(Long id);

    //Tìm kiếm Khách hàng bằng Email
    Optional<Customer> getCustomerByEmail(String email);

    Optional<Customer> getCustomerByPhone(String phone);

    List<Customer> getCustomerByName(String name);

    List<Customer> getCustomerByAddress(String address);
}   
