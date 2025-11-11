package edu.uth.warranty.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.uth.warranty.dto.ClaimAttachmentRequest;
import edu.uth.warranty.dto.ClaimAttachmentResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.ClaimAttachment;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.service.IClaimAttachmentService;
import edu.uth.warranty.service.IWarrantyClaimService; 
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/attachments")
public class ClaimAttachmentController {

    private final IClaimAttachmentService claimAttachmentService;
    private final IWarrantyClaimService warrantyClaimService; // Cần để kiểm tra Claim tồn tại

    public ClaimAttachmentController(IClaimAttachmentService claimAttachmentService, IWarrantyClaimService warrantyClaimService) {
        this.claimAttachmentService = claimAttachmentService;
        this.warrantyClaimService = warrantyClaimService;
    }

    private ClaimAttachmentResponse toResponseDTO(ClaimAttachment entity) {
        return new ClaimAttachmentResponse(
            entity.getAttachmentId(),
            entity.getClaim() != null ? entity.getClaim().getClaimId() : null,
            entity.getFileUrl(),
            entity.getType()
        ); 
    }

    private ClaimAttachment toEntity(ClaimAttachmentRequest request) {
        ClaimAttachment entity = new ClaimAttachment();

        if(request.getId() != null) {
            entity.setAttachmentId(request.getId());
        }

        if(request.getClaimId() != null) {
            entity.setClaim(new WarrantyClaim(request.getClaimId()));
        }

        entity.setFileUrl(request.getFileUrl());
        entity.setType(request.getType());

        return entity;
    }

    // 1. API: POST /api/attachments Tạo mới một file đính kèm
    @PostMapping
    public ResponseEntity<?> createAttachment(@Valid @RequestBody ClaimAttachmentRequest request) {
        try {
            ClaimAttachment newAttachment = toEntity(request);
            newAttachment.setAttachmentId(null);
            ClaimAttachment saved = claimAttachmentService.saveClaimAttachment(newAttachment);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
            
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }


    // 2. API: GET /api/attachments Lấy tất cả file đính kèm
    @GetMapping
    public ResponseEntity<List<ClaimAttachmentResponse>> getAllAttachment() {
        List<ClaimAttachmentResponse> responses = claimAttachmentService.getAllAttachment().stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 3. API: GET /api/attachments/{id} Lấy chi tiết 1 file đính kèm
    @GetMapping("/{id}")
    public ResponseEntity<ClaimAttachmentResponse> getAttachmentById(@PathVariable Long id) {
        Optional<ClaimAttachment> entity = claimAttachmentService.getAttachmentById(id);

        if(entity.isEmpty()) {
            return ResponseEntity.notFound().build();

        }
        return ResponseEntity.ok(toResponseDTO(entity.get()));

    }

    // 4. API: PUT /api/attachments/{id} Cập nhật 1 file đính kèm
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttachment(@PathVariable Long id, @Valid @RequestBody ClaimAttachmentRequest request) {
        request.setId(id); 
        
        if(claimAttachmentService.getAttachmentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            ClaimAttachment entity = toEntity(request);
            ClaimAttachment updated = claimAttachmentService.saveClaimAttachment(entity);
            return ResponseEntity.ok(toResponseDTO(updated));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }

    }

    // 5. API: DELETE /api/attachments/{id} Xóa 1 file đính kèm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long id) {
        if(claimAttachmentService.getAttachmentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        claimAttachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }

    // 6. API: GET /api/attachments/by-claim/{claimId} Lấy tất cả file đính kèm cho 1 claim
    @GetMapping("/by-claim/{claimId}")
    public ResponseEntity<List<ClaimAttachmentResponse>> getAttachmentByClaimId(@PathVariable Long claimId) {
        if(warrantyClaimService.getWarrantyClaimById(claimId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        WarrantyClaim claim = new WarrantyClaim(claimId);
        List<ClaimAttachment> list = claimAttachmentService.getAttachmentsByClaim(claim);
        List<ClaimAttachmentResponse> responses = list.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 7. API: GET /api/attachments/by-type?type={type} Lấy file đính kèm theo Loại
    @GetMapping("/by-type")
    public ResponseEntity<List<ClaimAttachmentResponse>> getAttachmentsByType(@RequestParam String type) {
        List<ClaimAttachmentResponse> responses = claimAttachmentService.getAttachmentsByType(type).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 8. API: GET /api/attachments/by-type-and-claim/{claimId}?type={type}
    // Lấy file đính kèm theo Loại và Claim ID
    @GetMapping("/by-type-and-claim/{claimId}")
    public ResponseEntity<List<ClaimAttachmentResponse>> getAttachmentsByTypeAndClaim(@PathVariable Long claimId, @RequestParam String type) {
        if(warrantyClaimService.getWarrantyClaimById(claimId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        WarrantyClaim claim = new WarrantyClaim(claimId);
        List<ClaimAttachmentResponse> responses = claimAttachmentService.getAttachmentsByTypeAndClaim(type, claim).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }




}