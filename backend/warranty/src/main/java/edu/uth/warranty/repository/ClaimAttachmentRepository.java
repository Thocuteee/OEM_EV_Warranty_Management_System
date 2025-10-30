package edu.uth.warranty.repository;

<<<<<<< HEAD
=======
import edu.uth.warranty.model.ClaimAttachment;
import edu.uth.warranty.model.WarrantyClaim;

>>>>>>> main
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
import edu.uth.warranty.model.ClaimAttachment;

@Repository
public interface ClaimAttachmentRepository extends JpaRepository<ClaimAttachment, Long> {

    // Lấy danh sách file đính kèm của 1 claim
    List<ClaimAttachment> findByClaim_ClaimId(Long claimId);

    // Lấy danh sách file theo loại file (hình ảnh, tài liệu, biên bản, ...)
    List<ClaimAttachment> findByFileType(String fileType);
=======

@Repository
public interface ClaimAttachmentRepository extends JpaRepository<ClaimAttachment, Long>{
    List<ClaimAttachment> findByClaim(WarrantyClaim claim);

    List<ClaimAttachment> findByType(String type);

    List<ClaimAttachment> findByTypeAndClaim(String type, WarrantyClaim claim);
>>>>>>> main
}
