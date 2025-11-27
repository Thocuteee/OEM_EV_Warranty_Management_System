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
import java.time.LocalDateTime;
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
        // Sử dụng Long IDs trực tiếp từ entity (không phụ thuộc vào lazy loading)
        Long claimId = entity.getClaim() != null ? entity.getClaim() : 
                      (entity.getClaimEntity() != null ? entity.getClaimEntity().getClaimId() : null);
        Long partId = entity.getPart() != null ? entity.getPart() : 
                     (entity.getPartEntity() != null ? entity.getPartEntity().getPartId() : null);
        
        String partNumber = null;
        String partName = null;

        // Nếu có partId, lấy thông tin part
        if(partId != null) {
            Optional<Part> partOpt = partService.getPartById(partId);
            if(partOpt.isPresent()) {
                partNumber = partOpt.get().getPartNumber();
                partName = partOpt.get().getName();
            }
        }

        // Đảm bảo không null cho các giá trị bắt buộc
        if(claimId == null) {
            throw new IllegalArgumentException("Claim ID không thể null trong ClaimPart.");
        }
        if(partId == null) {
            throw new IllegalArgumentException("Part ID không thể null trong ClaimPart.");
        }

        return new ClaimPartResponse(
            claimId,
            partId,
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
    public ResponseEntity<?> deleteClaimPart(@PathVariable Long claimId, @PathVariable Long partId) {
        try {
            Optional<ClaimPart> partOpt = claimPartService.getClaimPartById(claimId, partId);

            if(partOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Không tìm thấy Linh kiện với Claim ID " + claimId + " và Part ID " + partId + "."));
            }
            
            claimPartService.deleteClaimParts(claimId, partId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Lỗi máy chủ khi xóa Linh kiện: " + e.getMessage()));
        }
    }

    // 5. GET /api/claim-parts/by-claim/{claimId} : Lấy tất cả Linh kiện thuộc một Claim
    @GetMapping("/by-claim/{claimId}")
    public ResponseEntity<?> getClaimPartsByClaim(@PathVariable Long claimId) {
        try {
            WarrantyClaim claim = new WarrantyClaim(claimId);
            List<ClaimPart> claimParts = claimPartService.getClaimPartsByClaim(claim);
            
            // Map to DTO với error handling
            List<ClaimPartResponse> responses = claimParts.stream()
                .map(entity -> {
                    try {
                        return toResponseDTO(entity);
                    } catch (Exception e) {
                        e.printStackTrace();
                        // Log lỗi nhưng vẫn tiếp tục với các entity khác
                        return null;
                    }
                })
                .filter(response -> response != null) // Loại bỏ các response null
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Lỗi khi lấy danh sách Linh kiện: " + e.getMessage()));
        }
    }

    // 6. GET /api/claim-parts/by-total-cost?minCost={minCost} : Tìm kiếm theo Tổng Chi phí (>= minCost)
    @GetMapping("/by-total-cost")
    public ResponseEntity<List<ClaimPartResponse>> getClaimPartsByMinTotalCost(@RequestParam("minCost") BigDecimal minCost) {
        List<ClaimPartResponse> responses = claimPartService.getClaimPartsByTotalPriceGreaterThan(minCost).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }



}