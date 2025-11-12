package edu.uth.warranty.controller;

import edu.uth.warranty.dto.PartSerialRequest;
import edu.uth.warranty.dto.PartSerialResponse;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.service.IPartSerialService;
import edu.uth.warranty.service.IPartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/part-serials")
@Validated
public class PartSerialController {

    private final IPartSerialService partSerialService;
    private final IPartService partService;

    public PartSerialController(IPartSerialService partSerialService, IPartService partService) {
        this.partSerialService = partSerialService;
        this.partService = partService;
    }

    // --- Mapper Functions ---

    // Chuyển đổi Entity sang Response DTO
    private PartSerialResponse toResponseDTO(PartSerial partSerial) {
        return new PartSerialResponse(
            partSerial.getPartSerialId(),
            partSerial.getPart().getPartId(),
            partSerial.getSerialNumber(),
            partSerial.getDateReceived()
        );
    }

    // Chuyển đổi Request DTO sang Entity
    private PartSerial toEntity(PartSerialRequest request) {
        PartSerial partSerial = new PartSerial();

        if (request.getId() != null) {
            partSerial.setPartSerialId(request.getId());
        }

     
        Part part = partService.getPartById(request.getPartId())
                .orElseThrow(() -> new RuntimeException()); 

        partSerial.setPart(part);
        partSerial.setSerialNumber(request.getSerialNumber());
        partSerial.setDateReceived(request.getDateReceived());

        return partSerial;
    }


    // 1. POST /api/part : Tạo mới một PartSerial
    @PostMapping
    public ResponseEntity<PartSerialResponse> createPartSerial(@Valid @RequestBody PartSerialRequest request) {
        PartSerial newPartSerial = toEntity(request);
        PartSerial savedPartSerial = partSerialService.savePartSerial(newPartSerial);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(savedPartSerial));
    }

    // 2. GET /api/part Lấy tất cả PartSerials
    @GetMapping
    public ResponseEntity<List<PartSerialResponse>> getAllPartSerials() {
        List<PartSerial> partSerials = partSerialService.getAllPartSerials();
        List<PartSerialResponse> responses = partSerials.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 3. GET /api/part/{id} : Lấy chi tiết PartSerial
    @GetMapping("/{id}")
    public ResponseEntity<PartSerialResponse> getPartSerialById(@PathVariable Long id) {
        Optional<PartSerial> partSerial = partSerialService.getPartSerialById(id);

        if (partSerial.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(partSerial.get()));
    }

    // 4. PUT /api/part{id} : Cập nhật PartSerial
    @PutMapping("/{id}")
    public ResponseEntity<PartSerialResponse> updatePartSerial(@PathVariable Long id, @Valid @RequestBody PartSerialRequest request) {
        request.setId(id);

        if (partSerialService.getPartSerialById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        PartSerial updatedPartSerial = partSerialService.savePartSerial(toEntity(request));
        return ResponseEntity.ok(toResponseDTO(updatedPartSerial));
    }

    // 5. DELETE /api/part{id} : Xóa PartSerial
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePartSerial(@PathVariable Long id) {
        if (partSerialService.getPartSerialById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        partSerialService.deletePartSerial(id);
        return ResponseEntity.noContent().build();
    }
}