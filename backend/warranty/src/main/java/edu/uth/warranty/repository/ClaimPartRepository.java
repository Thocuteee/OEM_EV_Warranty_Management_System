package edu.uth.warranty.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.ClaimPart;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.WarrantyClaim;

@Repository
public interface ClaimPartRepository extends JpaRepository<ClaimPart, Long>{
    List<ClaimPart> findByClaim(WarrantyClaim claim);

    List<ClaimPart> findByPart(Part part);

    List<ClaimPart> findByQuantityGreaterThan(Integer quantity);

    List<ClaimPart> findByUnitPriceGreaterThanEqual(BigDecimal unitPrice);

    List<ClaimPart> findByTotalPriceGreaterThanEqual(BigDecimal totalPrice);
}
