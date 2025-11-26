package edu.uth.warranty.controller;

import edu.uth.warranty.dto.WarrantyPolicyRequest;
import edu.uth.warranty.dto.WarrantyPolicyResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.WarrantyPolicy;
import edu.uth.warranty.service.IWarrantyPolicyService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/warranty-policies")
public class WarrantyPolicyController {
    private final IWarrantyPolicyService policyService;

    public WarrantyPolicyController(IWarrantyPolicyService policyService) {
        this.policyService = policyService;
    }

    private WarrantyPolicyResponse toResponseDTO(WarrantyPolicy entity) {
        return new WarrantyPolicyResponse(
            entity.getPolicyId(),
            entity.getPolicyName(),
            entity.getDurationMonths(),
            entity.getMileageLimit(),
            entity.getCoverageDescription()
        );
    }

    private WarrantyPolicy toEntity(WarrantyPolicyRequest request) {
        WarrantyPolicy entity = new WarrantyPolicy();
        if (request.getId() != null) {
            entity.setPolicyId(request.getId());
        }
        entity.setPolicyName(request.getPolicyName());
        entity.setDurationMonths(request.getDurationMonths());
        entity.setMileageLimit(request.getMileageLimit());
        entity.setCoverageDescription(request.getCoverageDescription());
        return entity;
    }

    // 1. GET /api/warranty-policies : Lấy tất cả chính sách
    @GetMapping
    public ResponseEntity<List<WarrantyPolicyResponse>> getAllPolicies() {
        List<WarrantyPolicyResponse> responses = policyService.getAllPolicies()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 2. GET /api/warranty-policies/{id} : Lấy chi tiết chính sách theo ID
    @GetMapping("/{id}")
    public ResponseEntity<WarrantyPolicyResponse> getPolicyById(@PathVariable Long id) {
        Optional<WarrantyPolicy> policyOpt = policyService.getPolicyById(id);
        if (policyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(policyOpt.get()));
    }

    // 3. POST /api/warranty-policies : Tạo mới chính sách
    @PostMapping
    public ResponseEntity<?> createPolicy(@Valid @RequestBody WarrantyPolicyRequest request) {
        try {
            WarrantyPolicy entity = toEntity(request);
            entity.setPolicyId(null); // Đảm bảo tạo mới
            WarrantyPolicy saved = policyService.savePolicy(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 4. PUT /api/warranty-policies/{id} : Cập nhật chính sách
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePolicy(@PathVariable Long id, @Valid @RequestBody WarrantyPolicyRequest request) {
        request.setId(id);
        if (policyService.getPolicyById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            WarrantyPolicy entity = toEntity(request);
            WarrantyPolicy updated = policyService.savePolicy(entity);
            return ResponseEntity.ok(toResponseDTO(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 5. DELETE /api/warranty-policies/{id} : Xóa chính sách
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePolicy(@PathVariable Long id) {
        try {
            policyService.deletePolicy(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

