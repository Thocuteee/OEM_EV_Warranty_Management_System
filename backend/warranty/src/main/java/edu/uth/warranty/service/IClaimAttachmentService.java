package edu.uth.warranty.service;

import java.util.List;
import java.util.Optional;

import edu.uth.warranty.model.ClaimAttachment;
import edu.uth.warranty.model.WarrantyClaim;


public interface IClaimAttachmentService {
    List<ClaimAttachment> getAllAttachment();
    Optional<ClaimAttachment> getAttachmentById(Long id);

    ClaimAttachment saveClaimAttachment(ClaimAttachment claimAttachment);

    void deleteAttachment(Long id);

    List<ClaimAttachment> getAttachmentsByClaim(WarrantyClaim claim);

    List<ClaimAttachment> getAttachmentsByType(String type);

    List<ClaimAttachment> getAttachmentsByTypeAndClaim(String type, WarrantyClaim claim);
}
