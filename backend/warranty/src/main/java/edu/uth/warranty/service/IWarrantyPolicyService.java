package edu.uth.warranty.service;

import edu.uth.warranty.model.WarrantyPolicy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IWarrantyPolicyService {
    List<WarrantyPolicy> getAllPolicies();
    Optional<WarrantyPolicy> getPolicyById(Long id);
    WarrantyPolicy savePolicy(WarrantyPolicy policy);
    void deletePolicy(Long id);
}

