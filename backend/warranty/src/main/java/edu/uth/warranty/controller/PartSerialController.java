package edu.uth.warranty.controller;

import edu.uth.warranty.dto.PartSerialRequest;
import edu.uth.warranty.dto.PartSerialResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.repository.PartRepository; 
import edu.uth.warranty.service.IPartSerialService;
import jakarta.validation.Valid; 

import org.springframework.http.HttpStatus;
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

    private PartSerialResponse mapToResponse(PartSerial entity) {
        PartSerialResponse dto = new PartSerialResponse();
        dto.setId(entity.getPartSerialId());
        dto.setSerialNumber(entity.getSerialNumber());
        dto.setDateReceived(entity.getDateReceived());

        if (entity.getPart() != null) {
            dto.setPartId(entity.getPart().getPartId());
            dto.setPartName(entity.getPart().getName());
            dto.setPartNumber(entity.getPart().getPartNumber());
        }

        return dto;
    }

    private PartSerial mapToEntity(PartSerialRequest req) {
        PartSerial entity = new PartSerial();
        entity.setPartSerialId(req.getId());
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

    // 1. Lấy tất cả
    @GetMapping
    public ResponseEntity<List<PartSerialResponse>> getAll() {
        List<PartSerialResponse> list = partSerialService.getAllPartSerials()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    //2.  Lấy theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return partSerialService.getPartSerialById(id)
                .map(ps -> ResponseEntity.ok(mapToResponse(ps)))
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Tạo mới
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody PartSerialRequest request) {
        try {
            PartSerial entity = mapToEntity(request);
            entity.setPartSerialId(null);
            PartSerial saved = partSerialService.savePartSerial(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
        }
    }

    // 3. Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody PartSerialRequest request) {
        if (partSerialService.getPartSerialById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            request.setId(id);
            PartSerial entity = mapToEntity(request);
            PartSerial updated = partSerialService.savePartSerial(entity);
            return ResponseEntity.ok(mapToResponse(updated));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
        }
    }

    // 4. Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        partSerialService.deletePartSerial(id);
        return ResponseEntity.noContent().build();
    }

    //5.  Tìm theo Serial Number
    @GetMapping("/search")
    public ResponseEntity<?> getBySerialNumber(@RequestParam String serialNumber) {
        return partSerialService.getPartSerialBySerialNumber(serialNumber)
                .map(ps -> ResponseEntity.ok(mapToResponse(ps)))
                .orElse(ResponseEntity.notFound().build());
    }

    //6.  Tìm theo khoảng ngày nhận
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