package edu.uth.warranty.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.WarrantyClaim;

@Repository
public interface WarrantyClaimRepository extends JpaRepository<WarrantyClaim, Long> {
}
