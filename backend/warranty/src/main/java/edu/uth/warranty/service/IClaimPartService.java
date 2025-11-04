package edu.uth.warranty.service;

import edu.uth.warranty.model.ClaimPart;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Part;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IClaimPartService {
    List<ClaimPart> getAllClaimParts();

    Optional<ClaimPart> getClaimPartById(Long claimId, Long partId);

    ClaimPart saveClaimPart(ClaimPart entity);

    void deleteClaimParts(Long claimId, Long partId);

    List<ClaimPart> getClaimPartsByClaim(WarrantyClaim claim);

    List<ClaimPart> getClaimsByPart(Part part);

    List<ClaimPart> getClaimPartsByTotalPriceGreaterThan(BigDecimal totalPrice);


}
