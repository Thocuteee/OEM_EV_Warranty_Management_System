package edu.uth.warranty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.ClaimPart;

@Repository
public interface ClaimPartRepository extends JpaRepository<ClaimPart, Long> {

    // Lấy tất cả phụ tùng thuộc 1 claim cụ thể
    List<ClaimPart> findByClaim_ClaimId(Long claimId);

    // Lấy phụ tùng theo mã phụ tùng
    List<ClaimPart> findByPart_PartId(Long partId);
}
