package edu.uth.warranty.repository;

import edu.uth.warranty.model.ClaimPart;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Part;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClaimPartRepository extends JpaRepository<ClaimPart, ClaimPart.IdClass>{
    // Sử dụng EntityGraph để fetch eager các entity liên quan
    @EntityGraph(attributePaths = {"claimEntity", "partEntity"})
    @Query("SELECT cp FROM ClaimPart cp WHERE cp.claim = :claimId")
    List<ClaimPart> findByClaimId(@Param("claimId") Long claimId);
    
    // Hoặc sử dụng JOIN FETCH để đảm bảo load các entity liên quan
    @Query("SELECT DISTINCT cp FROM ClaimPart cp LEFT JOIN FETCH cp.claimEntity LEFT JOIN FETCH cp.partEntity WHERE cp.claim = :claimId")
    List<ClaimPart> findByClaimIdWithFetch(@Param("claimId") Long claimId);
    
    // Giữ lại method cũ để tương thích
    @EntityGraph(attributePaths = {"claimEntity", "partEntity"})
    List<ClaimPart> findByClaim(WarrantyClaim claim);

    @EntityGraph(attributePaths = {"claimEntity", "partEntity"})
    List<ClaimPart> findByPart(Part part);

    List<ClaimPart> findByQuantityGreaterThan(Integer quantity);

    List<ClaimPart> findByUnitPriceGreaterThanEqual(BigDecimal unitPrice);

    List<ClaimPart> findByTotalPriceGreaterThanEqual(BigDecimal totalPrice);
}
