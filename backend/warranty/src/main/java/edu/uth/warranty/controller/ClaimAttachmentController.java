package edu.uth.warranty.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping; 
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.uth.warranty.dto.ClaimAttachmentRequest;
import edu.uth.warranty.dto.ClaimAttachmentResponse;
import edu.uth.warranty.model.ClaimAttachment;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.service.IClaimAttachmentService;
import edu.uth.warranty.service.IWarrantyClaimService; // Cần để kiểm tra FK
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/attachments")
public class ClaimAttachmentController {

    private final IClaimAttachmentService attachmentService;
    private final IWarrantyClaimService claimService; // Cần để kiểm tra Claim tồn tại

    public ClaimAttachmentController(IClaimAttachmentService attachmentService, IWarrantyClaimService claimService) {
        this.attachmentService = attachmentService;
        this.claimService = claimService;
    }

    // --- Helpers (DTO <-> Entity) ---

    // Chuyển Request DTO -> Entity
    private ClaimAttachment toEntity(ClaimAttachmentRequest request) {
        ClaimAttachment entity = new ClaimAttachment();
        
        // Set ID nếu là cập nhật (request có ID)
        if (request.getId() != null) {
            entity.setAttachmentId(request.getId());
        }
        
        // Tạo proxy cho Claim FK
        if (request.getClaimId() != null) {
            WarrantyClaim claim = new WarrantyClaim();
            claim.setClaimId(request.getClaimId());
            entity.setClaim(claim);
        }

        entity.setFileUrl(request.getFileUrl());
        entity.setType(request.getType());
        return entity;
    }

    // Chuyển Entity -> Response DTO
    private ClaimAttachmentResponse toResponseDTO(ClaimAttachment entity) {
        ClaimAttachmentResponse response = new ClaimAttachmentResponse();
        response.setId(entity.getAttachmentId());
        response.setClaimId(entity.getClaim() != null ? entity.getClaim().getClaimId() : null);
        response.setFileUrl(entity.getFileUrl());
        response.setType(entity.getType());
        return response;
    }

    // --- API Endpoints ---

    //API: POST /api/attachments Tạo mới một file đính kèm
    @PostMapping
    public ResponseEntity<ClaimAttachmentResponse> createAttachment(@Valid @RequestBody ClaimAttachmentRequest request) {
        ClaimAttachment newAttachment = toEntity(request);
        
        // Service Impl sẽ kiểm tra FK
        ClaimAttachment savedAttachment = attachmentService.saveClaimAttachment(newAttachment);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(savedAttachment));
    }

    // API: GET /api/attachments/by-claim/{claimId} Lấy tất cả file đính kèm cho 1 claim
    @GetMapping("/by-claim/{claimId}")
    public ResponseEntity<List<ClaimAttachmentResponse>> getAttachmentsByClaimId(@PathVariable Long claimId) {
        // Kiểm tra Claim tồn tại
        if (claimService.getWarrantyClaimById(claimId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        WarrantyClaim claim = new WarrantyClaim();
        claim.setClaimId(claimId);

        List<ClaimAttachment> list = attachmentService.getAttachmentsByClaim(claim);
        
        // Chuyển sang DTO
        List<ClaimAttachmentResponse> responseList = new ArrayList<>();
        for (ClaimAttachment entity : list) {
            responseList.add(toResponseDTO(entity));
        }
        
        return ResponseEntity.ok(responseList);
    }

    //API: GET /api/attachments/{id} Lấy chi tiết 1 file đính kèm
    @GetMapping("/{id}")
    public ResponseEntity<ClaimAttachmentResponse> getAttachmentById(@PathVariable Long id) {
        Optional<ClaimAttachment> entity = attachmentService.getAttachmentById(id);

        if (entity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(toResponseDTO(entity.get()));
    }

    // API: PUT /api/attachments/{id} Cập nhật 1 file đính kèm
    @PutMapping("/{id}")
    public ResponseEntity<ClaimAttachmentResponse> updateAttachment(@PathVariable Long id,@Valid @RequestBody ClaimAttachmentRequest request) {
        
        // Kiểm tra xem file này có tồn tại không
        if (attachmentService.getAttachmentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        request.setId(id); // Đảm bảo ID được set cho việc cập nhật
        ClaimAttachment entityToUpdate = toEntity(request);
        ClaimAttachment updatedEntity = attachmentService.saveClaimAttachment(entityToUpdate);
        
        return ResponseEntity.ok(toResponseDTO(updatedEntity));
    }

    //API: DELETE /api/attachments/{id} Xóa 1 file đính kèm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long id) {
        // Kiểm tra tồn tại
        if (attachmentService.getAttachmentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        attachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }
}