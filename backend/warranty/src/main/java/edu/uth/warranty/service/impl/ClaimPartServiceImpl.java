package edu.uth.warranty.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.uth.warranty.model.ClaimPart;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.repository.ClaimPartRepository;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.repository.WarrantyClaimRepository;
import edu.uth.warranty.service.IClaimPartService;

@Service
@Transactional
public class ClaimPartServiceImpl implements IClaimPartService{
    private final ClaimPartRepository claimPartRepository;
    private final WarrantyClaimRepository claimRepository;
    private final PartRepository partRepository;

    public ClaimPartServiceImpl(ClaimPartRepository claimPartRepository, WarrantyClaimRepository claimRepository, PartRepository partRepository) {
        this.claimPartRepository = claimPartRepository;
        this.claimRepository = claimRepository;
        this.partRepository = partRepository;
    }

    @Override
    public List<ClaimPart> getAllClaimParts() {
        return claimPartRepository.findAll();
    }

    @Override
    public Optional<ClaimPart> getClaimPartById(Long claimId, Long partId) {
        ClaimPart.IdClass id = new ClaimPart.IdClass(claimId, partId);
        return claimPartRepository.findById(id);
    }

    @Override
    public ClaimPart saveClaimPart(ClaimPart entity) {
        //Kiểm tra Khóa Ngoại (FK) có tồn tại không
        if (entity.getClaim() == null || entity.getClaim().getClaimId() == null || 
            claimRepository.findById(entity.getClaim().getClaimId()).isEmpty()) {
            throw new IllegalArgumentException("Warranty Claim không tồn tại hoặc không hợp lệ.");
        }
        if (entity.getPart() == null || entity.getPart().getPartId() == null || 
            partRepository.findById(entity.getPart().getPartId()).isEmpty()) {
            throw new IllegalArgumentException("Linh kiện (Part) không tồn tại hoặc không hợp lệ.");
        }

        //Tính toán Total Price nếu chưa được thiết lập (hoặc xác thực)
        if (entity.getTotalPrice() == null && entity.getUnitPrice() != null && entity.getQuantity() != null) {
            BigDecimal total = entity.getUnitPrice().multiply(new BigDecimal(entity.getQuantity()));
            entity.setTotalPrice(total);
        }

        return claimPartRepository.save(entity);
    }

    @Override
    public void deleteClaimParts(Long claimId, Long partId) {
        ClaimPart.IdClass id = new ClaimPart.IdClass(claimId, partId);
        claimPartRepository.deleteById(id);
    }

    @Override
    public List<ClaimPart> getClaimPartsByClaim(WarrantyClaim claim) {
        return claimPartRepository.findByClaim(claim);
    }

    @Override
    public List<ClaimPart> getClaimsByPart(Part part) {
        return claimPartRepository.findByPart(part);
    }

    @Override
    public List<ClaimPart> getClaimPartsByTotalPriceGreaterThan(BigDecimal totalPrice) {
        return claimPartRepository.findByTotalPriceGreaterThanEqual(totalPrice);
    }
}
