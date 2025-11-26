package edu.uth.warranty.service;

import java.util.List;
import java.util.Optional;

import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.WarrantyPolicy;

public interface IWarrantyPolicyService {
    List<WarrantyPolicy> getAllPolicies();
    Optional<WarrantyPolicy> getPolicyById(Long id);
    WarrantyPolicy savePolicy(WarrantyPolicy policy);
    void deletePolicy(Long id);
    
    // Logic kiểm tra bảo hành
    void checkWarrantyValidity(Vehicle vehicle);
}