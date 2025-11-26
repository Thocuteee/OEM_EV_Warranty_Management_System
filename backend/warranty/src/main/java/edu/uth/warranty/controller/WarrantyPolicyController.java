package edu.uth.warranty.controller;

import java.util.ArrayList;
import java.util.List;

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

import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.dto.WarrantyPolicyRequest;
import edu.uth.warranty.dto.WarrantyPolicyResponse;
import edu.uth.warranty.model.WarrantyPolicy;
import edu.uth.warranty.service.IWarrantyPolicyService;
import jakarta.validation.Valid;

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

    // 1. GET ALL POLICIES
    @GetMapping
    public ResponseEntity<List<WarrantyPolicyResponse>> getAllPolicies() {
        List<WarrantyPolicy> policies = policyService.getAllPolicies();
        List<WarrantyPolicyResponse> responses = new ArrayList<>();
        
        for (WarrantyPolicy policy : policies) {
            responses.add(toResponseDTO(policy));
        }
        
        return ResponseEntity.ok(responses);
    }

    // 2. CREATE
    @PostMapping
    public ResponseEntity<?> createPolicy(@Valid @RequestBody WarrantyPolicyRequest request) {
        try {
            WarrantyPolicy entity = toEntity(request);
            entity.setPolicyId(null);
            WarrantyPolicy saved = policyService.savePolicy(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // 3. UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePolicy(@PathVariable Long id, @Valid @RequestBody WarrantyPolicyRequest request) {
        request.setId(id);
        
        if (policyService.getPolicyById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            WarrantyPolicy saved = policyService.savePolicy(toEntity(request));
            return ResponseEntity.ok(toResponseDTO(saved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 4. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        if (policyService.getPolicyById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }
}