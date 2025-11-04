package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Customer;
import edu.uth.warranty.repository.CustomerRepository;
import edu.uth.warranty.service.ICustomerService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerServiceImpl implements ICustomerService{
    public final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    
    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Customer saveCustomer(Customer customer) {
        // Kiểm tra Email
        Optional<Customer> existingByEmail = customerRepository.findByEmail(customer.getEmail());
        if (existingByEmail.isPresent() && (customer.getCustomer_id() == null || !customer.getCustomer_id().equals(existingByEmail.get().getCustomer_id()))) {
            throw new IllegalArgumentException("Email đã tồn tại.");
        }
        
        // Kiểm tra Phone
        Optional<Customer> existingByPhone = customerRepository.findByPhone(customer.getPhone());
        if (existingByPhone.isPresent() && (customer.getCustomer_id() == null || !customer.getCustomer_id().equals(existingByPhone.get().getCustomer_id()))) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại.");
        }

        return customerRepository.save(customer);
    }

    @Override
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    @Override
    public Optional<Customer> getCustomersByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    @Override
    public Optional<Customer> getCustomersByPhone(String phone) {
        return customerRepository.findByPhone(phone);
    }

    @Override
    public List<Customer> getCustomersByName(String name) {
        return customerRepository.findByName(name);
    }

    @Override
    public List<Customer> getCustomersByAddress(String address) {
        return customerRepository.findByAddress(address);
    }

    @Override
    public Boolean isEmailUnique(String email) {
        return customerRepository.findByEmail(email).isEmpty();
    }

    @Override
    public Boolean isPhoneUnique(String phone) {
        return customerRepository.findByPhone(phone).isEmpty();
    }
}
