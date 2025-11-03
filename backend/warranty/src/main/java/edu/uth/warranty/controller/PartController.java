package edu.uth.warranty.controller;

import edu.uth.warranty.model.Part;
import edu.uth.warranty.service.IPartService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/parts")
public class PartController {

    private final IPartService partService;

    public PartController(IPartService partService) {
        this.partService = partService;
    }

    // Lấy danh sách tất cả Part
    @GetMapping
    public List<Part> getAllParts() {
        return partService.getAllParts();
    }

    // Lấy Part theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Part> getPartById(@PathVariable Long id) {
        Optional<Part> part = partService.getPartById(id);
        return part.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // Tạo mới hoặc cập nhật Part
    @PostMapping
    public ResponseEntity<?> savePart(@RequestBody Part part) {
        try {
            Part savedPart = partService.savePart(part);
            return ResponseEntity.ok(savedPart);
        } catch (IllegalArgumentException e) {
            // Nếu trùng partNumber → trả lỗi hợp lý
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa Part theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePart(@PathVariable Long id) {
        partService.deletePart(id);
        return ResponseEntity.ok("Đã xóa Part có ID = " + id);
    }

    // Tìm kiếm Part theo Part Number
    @GetMapping("/part-number/{partNumber}")
    public ResponseEntity<Part> getPartByPartNumber(@PathVariable String partNumber) {
        Optional<Part> part = partService.getPartByPartNumber(partNumber);
        return part.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // Tìm kiếm Part theo tên (một phần của tên)
    @GetMapping("/search")
    public List<Part> searchPartsByName(@RequestParam("name") String name) {
        return partService.getPartsByNameContaining(name);
    }

    // Lọc Part theo khoảng giá (min - max)
    @GetMapping("/filter")
    public List<Part> filterByPriceRange(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return partService.getPartsByPriceRange(minPrice, maxPrice);
    }

    // Kiểm tra mã PartNumber có bị trùng không
    @GetMapping("/unique/{partNumber}")
    public ResponseEntity<Boolean> checkUniquePartNumber(@PathVariable String partNumber) {
        Boolean isUnique = partService.isPartNumberUnique(partNumber);
        return ResponseEntity.ok(isUnique);
    }
}
