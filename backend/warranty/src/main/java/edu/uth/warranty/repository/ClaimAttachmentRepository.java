package edu.uth.warranty.repository;

import edu.uth.warranty.model.ClaimAttachment;
import edu.uth.warranty.model.WarrantyClaim;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ClaimAttachmentRepository extends JpaRepository<ClaimAttachment, Long>{
    List<ClaimAttachment> findByClaim(WarrantyClaim claim);

    List<ClaimAttachment> findByType(String type);

    List<ClaimAttachment> findByTypeAndClaim(String type, WarrantyClaim claim);
}
