package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.ClaimPart;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.repository.ClaimPartRepository;
import edu.uth.warranty.repository.WarrantyClaimRepository;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.service.IClaimPartService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

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
        Long claimId = entity.getClaim();
        if (claimId == null || claimRepository.findById(claimId).isEmpty()) {
            throw new IllegalArgumentException("Warranty Claim không tồn tại hoặc không hợp lệ.");
        }

        Long partId = entity.getPart();
        if (partId == null || partRepository.findById(partId).isEmpty()) {
            throw new IllegalArgumentException("Linh kiện (Part) không tồn tại hoặc không hợp lệ.");
        }

        if (entity.getQuantity() == null || entity.getQuantity() <= 0) {
            throw new IllegalArgumentException("Số lượng linh kiện phải lớn hơn 0.");
        }
        if (entity.getUnitPrice() == null || entity.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Đơn giá không được âm.");
        }

        // TÍNH TOÁN TOTAL PRICE (Logic giữ nguyên)
        if (entity.getTotalPrice() == null) {
            BigDecimal total = entity.getUnitPrice().multiply(new BigDecimal(entity.getQuantity()));
            entity.setTotalPrice(total);
        }
        
        return claimPartRepository.save(entity);
    }

    @Override
    public void deleteClaimParts(Long claimId, Long partId) {
        ClaimPart.IdClass id = new ClaimPart.IdClass(claimId, partId);
        
        // Kiểm tra xem bản ghi có tồn tại không trước khi xóa
        if (!claimPartRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy Linh kiện với Claim ID " + claimId + " và Part ID " + partId + ".");
        }
        
        claimPartRepository.deleteById(id);
    }

    @Override
    public List<ClaimPart> getClaimPartsByClaim(WarrantyClaim claim) {
        // Sử dụng claimId trực tiếp để tránh vấn đề với lazy loading
        if (claim != null && claim.getClaimId() != null) {
            // Sử dụng method với JOIN FETCH để đảm bảo load các entity liên quan
            return claimPartRepository.findByClaimIdWithFetch(claim.getClaimId());
        }
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
