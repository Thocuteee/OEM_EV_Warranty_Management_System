package edu.uth.warranty.controller;

import edu.uth.warranty.dto.*;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.service.IPartService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/parts")
@CrossOrigin(origins = "http://localhost:3000")
public class PartController {
    private final IPartService partService;

    public PartController(IPartService partService) {
        this.partService = partService;
    }

    private PartResponse toResponseDTO(Part part) {
        return new PartResponse(
            part.getPartId(),
            part.getName(),
            part.getPartNumber(),
            part.getPrice()
        );
    }

    private Part toEntity(PartRequest request) {
        Part part = new Part();
        if (request.getId() != null) part.setPartId(request.getId());
        part.setName(request.getName());
        part.setPartNumber(request.getPartNumber());
        part.setPrice(request.getPrice());
        return part;
    }

    @PostMapping
    public ResponseEntity<PartResponse> create(@Valid @RequestBody PartRequest req) {
        Part saved = partService.savePart(toEntity(req));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
    }

    @GetMapping
    public ResponseEntity<List<PartResponse>> getAll() {
        List<PartResponse> res = partService.getAllParts().stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartResponse> getById(@PathVariable Long id) {
        return partService.getPartById(id)
                .map(p -> ResponseEntity.ok(toResponseDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PartResponse> update(@PathVariable Long id, @Valid @RequestBody PartRequest req) {
        req.setId(id);
        if (partService.getPartById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Part updated = partService.savePart(toEntity(req));
        return ResponseEntity.ok(toResponseDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        partService.deletePart(id);
        return ResponseEntity.noContent().build();
    }
}
