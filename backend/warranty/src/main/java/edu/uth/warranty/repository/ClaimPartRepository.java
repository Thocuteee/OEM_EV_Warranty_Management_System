package edu.uth.warranty.repository;

<<<<<<< HEAD
=======
import edu.uth.warranty.model.ClaimPart;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Part;

import java.math.BigDecimal;
>>>>>>> main
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
import edu.uth.warranty.model.ClaimPart;

@Repository
public interface ClaimPartRepository extends JpaRepository<ClaimPart, Long> {

    // Lấy tất cả phụ tùng thuộc 1 claim cụ thể
    List<ClaimPart> findByClaim_ClaimId(Long claimId);

    // Lấy phụ tùng theo mã phụ tùng
    List<ClaimPart> findByPart_PartId(Long partId);
=======
@Repository
public interface ClaimPartRepository extends JpaRepository<ClaimPart, Long>{
    List<ClaimPart> findByClaim(WarrantyClaim claim);

    List<ClaimPart> findByPart(Part part);

    List<ClaimPart> findByQuantityGreaterThan(Integer quantity);

    List<ClaimPart> findByUnitPriceGreaterThanEqual(BigDecimal unitPrice);

    List<ClaimPart> findByTotalPriceGreaterThanEqual(BigDecimal totalPrice);
>>>>>>> main
}
