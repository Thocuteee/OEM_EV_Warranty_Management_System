package edu.uth.warranty.controller;

import edu.uth.warranty.dto.ClaimPartRequest;
import edu.uth.warranty.dto.ClaimPartResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.ClaimPart;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.service.IClaimPartService;
import edu.uth.warranty.service.IPartService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/claim-parts")
@CrossOrigin(origins = "*")
public class ClaimPartController {
    private final IClaimPartService claimPartService;
    private final IPartService partService;

    public ClaimPartController(IClaimPartService claimPartService, IPartService partService) {
        this.claimPartService = claimPartService;
        this.partService = partService;
    }

    private ClaimPartResponse toResponseDTO(ClaimPart entity) {
        String partNumber = null;
        String partName = null;

        if(entity.getPartEntity() != null && entity.getPartEntity().getPartId() != null) {
            Optional<Part> partOpt = partService.getPartById(entity.getPartEntity().getPartId());
            if(partOpt.isPresent()) {
                partNumber = partOpt.get().getPartNumber();
                partName = partOpt.get().getName();
            }
        }

        return new ClaimPartResponse(
            entity.getClaimEntity().getClaimId(),
            entity.getPartEntity().getPartId(),
            partNumber,
            partName,
            entity.getQuantity(),
            entity.getUnitPrice(),
            entity.getTotalPrice()
        );
    }

    private ClaimPart toEntity(ClaimPartRequest request) {
        ClaimPart entity = new ClaimPart();

        if(request.getClaimId() != null) {
            entity.setClaim(request.getClaimId());
            entity.setClaimEntity(new WarrantyClaim(request.getClaimId())); 
        }

        if (request.getPartId() != null) {
            Part part = new Part(); 
            part.setPartId(request.getPartId());
            
            entity.setPart(request.getPartId());    
            entity.setPartEntity(part);             
        }

        entity.setQuantity(request.getQuantity());
        entity.setUnitPrice(request.getUnitPrice());
        entity.setTotalPrice(request.getTotalPrice());
        
        return entity;
    }

    // 1. POST /api/claim-parts : Thêm/Cập nhật Linh kiện cho Claim (Upsert)
    @PostMapping
    public ResponseEntity<?> createOrUpdateClaimPart(@Valid @RequestBody ClaimPartRequest request) {
        try {
            ClaimPart entity = toEntity(request);
            ClaimPart saved = claimPartService.saveClaimPart(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 2. GET /api/claim-parts : Lấy tất cả các bản ghi Claim-Part
    @GetMapping
    public ResponseEntity<List<ClaimPartResponse>> getAllClaimParts() {
        List<ClaimPartResponse> responses = claimPartService.getAllClaimParts().stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 3. GET /api/claim-parts/{claimId}/{partId} : Lấy chi tiết 1 bản ghi theo Composite ID
    @GetMapping("/{claimId}/{partId}")
    public ResponseEntity<ClaimPartResponse> getClaimPartById(@PathVariable Long claimId, @PathVariable Long partId) {
        Optional<ClaimPart> partOpt = claimPartService.getClaimPartById(claimId, partId);

        if(partOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(partOpt.get()));
    }

    // 4. DELETE /api/claim-parts/{claimId}/{partId} : Xóa 1 bản ghi theo Composite ID
    @DeleteMapping("/{claimId}/{partId}")
    public ResponseEntity<Void> deleteClaimPart(@PathVariable Long claimId, @PathVariable Long partId) {
        Optional<ClaimPart> partOpt = claimPartService.getClaimPartById(claimId, partId);

        if(partOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        claimPartService.deleteClaimParts(claimId, partId);
        return ResponseEntity.noContent().build();

    }

    // 5. GET /api/claim-parts/by-claim/{claimId} : Lấy tất cả Linh kiện thuộc một Claim
    @GetMapping("/by-claim/{claimId}")
    public ResponseEntity<List<ClaimPartResponse>> getClaimPartsByClaim(@PathVariable Long claimId) {
        WarrantyClaim claim = new WarrantyClaim(claimId);

        List<ClaimPartResponse> responses = claimPartService.getClaimPartsByClaim(claim).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 6. GET /api/claim-parts/by-total-cost?minCost={minCost} : Tìm kiếm theo Tổng Chi phí (>= minCost)
    @GetMapping("/by-total-cost")
    public ResponseEntity<List<ClaimPartResponse>> getClaimPartsByMinTotalCost(@RequestParam("minCost") BigDecimal minCost) {
        List<ClaimPartResponse> responses = claimPartService.getClaimPartsByTotalPriceGreaterThan(minCost).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }



}