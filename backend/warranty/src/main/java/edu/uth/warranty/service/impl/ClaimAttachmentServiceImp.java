package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.ClaimAttachment;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.repository.ClaimAttachmentRepository;
import edu.uth.warranty.repository.WarrantyClaimRepository; 
import edu.uth.warranty.service.IClaimAttachmentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClaimAttachmentServiceImp implements IClaimAttachmentService{
    private final ClaimAttachmentRepository claimAttachmentRepository;
    private final WarrantyClaimRepository warrantyClaimRepository;

    public ClaimAttachmentServiceImp(ClaimAttachmentRepository claimAttachmentRepository, WarrantyClaimRepository warrantyClaimRepository) {
        this.claimAttachmentRepository = claimAttachmentRepository;
        this.warrantyClaimRepository = warrantyClaimRepository;
    }

    @Override
    public List<ClaimAttachment> getAllAttachment() {
        return claimAttachmentRepository.findAll();
    }

    @Override
    public Optional<ClaimAttachment> getAttachmentById(Long id) {
        return claimAttachmentRepository.findById(id);
    }

    @Override
    public ClaimAttachment saveClaimAttachment(ClaimAttachment claimAttachment) {
        // Đảm bảo Warranty Claim tồn tại trước khi thêm file đính kèm
        if(claimAttachment.getClaim() == null || claimAttachment.getClaim().getClaimId() == null) {
            throw new IllegalArgumentException("File đính kèm phải liên kết với một Claim hợp lệ.");
        }
        if(claimAttachmentRepository.findById(claimAttachment.getClaim().getClaimId()).isEmpty()) {
            throw new IllegalArgumentException("Warranty Claim không tồn tại.");
        }
        return claimAttachmentRepository.save(claimAttachment);
    }

    @Override
    public void deleteAttachment(Long id) {
        claimAttachmentRepository.deleteById(id);
    }

    @Override
    public List<ClaimAttachment> getAttachmentsByClaim(WarrantyClaim claim) {
        return claimAttachmentRepository.findByClaim(claim);
    }

    @Override
    public List<ClaimAttachment> getAttachmentsByType(String type) {
        return claimAttachmentRepository.findByType(type);
    }

    @Override
    public List<ClaimAttachment> getAttachmentsByTypeAndClaim(String type, WarrantyClaim claim) {
        return claimAttachmentRepository.findByTypeAndClaim(type, claim);
    }
}
