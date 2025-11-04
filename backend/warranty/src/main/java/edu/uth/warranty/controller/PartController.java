package edu.uth.warranty.controller;

import edu.uth.warranty.dto.PartRequest;
import edu.uth.warranty.dto.PartResponse;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.service.IPartService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/parts")
public class PartController {

    private final IPartService partService;

    public PartController(IPartService partService) {
        this.partService = partService;
    }

    // Lấy tất cả linh kiện
    @GetMapping
    public ResponseEntity<List<PartResponse>> getAllParts() {
        List<PartResponse> parts = partService.getAllParts()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(parts);
    }

    // Lấy Part theo ID
    @GetMapping("/{id}")
    public ResponseEntity<PartResponse> getPartById(@PathVariable Long id) {
        Optional<Part> partOpt = partService.getPartById(id);
        return partOpt.map(part -> ResponseEntity.ok(toResponse(part)))
                      .orElse(ResponseEntity.notFound().build());
    }

    // Tạo mới linh kiện
    @PostMapping
    public ResponseEntity<PartResponse> createPart(@Valid @RequestBody PartRequest request) {
        Part entity = toEntity(request);
        Part saved = partService.savePart(entity);
        return ResponseEntity.ok(toResponse(saved));
    }

    // Cập nhật linh kiện
    @PutMapping("/{id}")
    public ResponseEntity<PartResponse> updatePart(@PathVariable Long id,
                                                   @Valid @RequestBody PartRequest request) {
        Optional<Part> existingOpt = partService.getPartById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Part entity = toEntity(request);
        entity.setPart_id(id);
        Part updated = partService.savePart(entity);
        return ResponseEntity.ok(toResponse(updated));
    }

    // Xóa linh kiện
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePart(@PathVariable Long id) {
        partService.deletePart(id);
        return ResponseEntity.noContent().build();
    }

    // Tìm theo tên
    @GetMapping("/search")
    public ResponseEntity<List<PartResponse>> searchByName(@RequestParam String keyword) {
        List<PartResponse> parts = partService.getPartsByNameContaining(keyword)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(parts);
    }

    // Tìm theo khoảng giá
    @GetMapping("/price-range")
    public ResponseEntity<List<PartResponse>> getByPriceRange(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        List<PartResponse> parts = partService.getPartsByPriceRange(minPrice, maxPrice)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(parts);
    }

    // ======================
    // Mapper nội bộ (Entity ↔ DTO)
    // ======================

    private PartResponse toResponse(Part entity) {
        PartResponse dto = new PartResponse();
        dto.setId(entity.getPart_id());
        dto.setPartNumber(entity.getPartNumber());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setStockQuantity(entity.getStockQuantity());
        return dto;
    }

    private Part toEntity(PartRequest request) {
        Part entity = new Part();
        entity.setPartNumber(request.getPartNumber());
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setPrice(request.getPrice());
        entity.setStockQuantity(request.getStockQuantity());
        return entity;
    }
}
