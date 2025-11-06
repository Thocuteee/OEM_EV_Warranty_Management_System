package edu.uth.warranty.controller;

import edu.uth.warranty.dto.PartSerialRequest;
import edu.uth.warranty.dto.PartSerialResponse;
import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.service.IPartSerialService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/part-serials")
@CrossOrigin(origins = "*")
public class PartSerialController {

    private final IPartSerialService partSerialService;
    private final PartRepository partRepository;

    public PartSerialController(IPartSerialService partSerialService, PartRepository partRepository) {
        this.partSerialService = partSerialService;
        this.partRepository = partRepository;
    }

    /* =====================================
      Mapper (entity <-> DTO)
    ====================================== */

    private PartSerialResponse mapToResponse(PartSerial entity) {
        PartSerialResponse dto = new PartSerialResponse();
        dto.setId(entity.getPart_serial_id());
        dto.setSerialNumber(entity.getSerialNumber());
        dto.setDateReceived(entity.getDateReceived());

        if (entity.getPart() != null) {
            dto.setPartId(entity.getPart().getPart_id());
            dto.setPartName(entity.getPart().getName());
            dto.setPartNumber(entity.getPart().getPartNumber());
        }

        return dto;
    }

    private PartSerial mapToEntity(PartSerialRequest req) {
        PartSerial entity = new PartSerial();
        entity.setPart_serial_id(req.getId());
        entity.setSerialNumber(req.getSerialNumber());
        entity.setDateReceived(req.getDateReceived());

        if (req.getPartId() != null) {
            Part part = partRepository.findById(req.getPartId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy linh kiện (Part) với ID: " + req.getPartId()));
            entity.setPart(part);
        } else {
            throw new IllegalArgumentException("partId là bắt buộc.");
        }

        return entity;
    }

    /* =====================================
        CRUD APIs
    ====================================== */

    // Lấy tất cả
    @GetMapping
    public ResponseEntity<List<PartSerialResponse>> getAll() {
        List<PartSerialResponse> list = partSerialService.getAllPartSerials()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // Lấy theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return partSerialService.getPartSerialById(id)
                .map(ps -> ResponseEntity.ok(mapToResponse(ps)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody PartSerialRequest request) {
        try {
            PartSerial entity = mapToEntity(request);
            PartSerial saved = partSerialService.savePartSerial(entity);
            return ResponseEntity.ok(mapToResponse(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody PartSerialRequest request) {
        try {
            request.setId(id);
            PartSerial entity = mapToEntity(request);
            PartSerial updated = partSerialService.savePartSerial(entity);
            return ResponseEntity.ok(mapToResponse(updated));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        partSerialService.deletePartSerial(id);
        return ResponseEntity.noContent().build();
    }

    /* =====================================
     Extra APIs
    ====================================== */

    // Tìm theo Serial Number
    @GetMapping("/search")
    public ResponseEntity<?> getBySerialNumber(@RequestParam String serialNumber) {
        return partSerialService.getPartSerialBySerialNumber(serialNumber)
                .map(ps -> ResponseEntity.ok(mapToResponse(ps)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Tìm theo khoảng ngày nhận
    @GetMapping("/date-range")
    public ResponseEntity<List<PartSerialResponse>> getByDateRange(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);

        List<PartSerialResponse> list = partSerialService
                .getPartSerialsByDateReceivedBetween(startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }
}
