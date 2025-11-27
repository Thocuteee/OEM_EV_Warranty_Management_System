package edu.uth.warranty.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.WarrantyPolicy;

@Service
public interface IWarrantyPolicyService {
    List<WarrantyPolicy> getAllPolicies();
    Optional<WarrantyPolicy> getPolicyById(Long id);
    WarrantyPolicy savePolicy(WarrantyPolicy policy);
    void deletePolicy(Long id);
    void checkWarrantyValidity(Vehicle vehicle);
}

