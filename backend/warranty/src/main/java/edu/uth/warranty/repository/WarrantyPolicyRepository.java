package edu.uth.warranty.repository;

import edu.uth.warranty.model.WarrantyPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarrantyPolicyRepository extends JpaRepository<WarrantyPolicy, Long> {
    Optional<WarrantyPolicy> findByPolicyName(String policyName);
}

