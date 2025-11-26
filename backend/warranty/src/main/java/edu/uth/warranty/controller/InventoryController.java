package edu.uth.warranty.controller;

import edu.uth.warranty.dto.InventoryRequest;
import edu.uth.warranty.dto.InventoryResponse;
import edu.uth.warranty.dto.MessageResponse; 
import edu.uth.warranty.model.Inventory;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.service.IInventoryService;
import edu.uth.warranty.service.IPartService; 
import edu.uth.warranty.service.IServiceCenterService; 

import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final IInventoryService inventoryService;
    private final IPartService partService;
    private final IServiceCenterService serviceCenterService;

    public InventoryController(IInventoryService inventoryService, IPartService partService, IServiceCenterService serviceCenterService) {
        this.inventoryService = inventoryService;
        this.partService = partService;
        this.serviceCenterService = serviceCenterService;
    }

    private InventoryResponse toResponseDTO(Inventory entity) {
        String partNumber = null;
        String partName = null;
        String centerName = null;

        if(entity.getPart() != null && entity.getPart().getPartId() != null) {
            Optional<Part> partOpt = partService.getPartById(entity.getPart().getPartId());
            if(partOpt.isPresent()) { 
                partNumber = partOpt.get().getPartNumber();
                partName = partOpt.get().getName();
            }
        }

        if(entity.getCenter() != null && entity.getCenter().getCenterId() != null) {
            Optional<ServiceCenter> centerOpt = serviceCenterService.getServiceCenterById(entity.getCenter().getCenterId());
            if(centerOpt.isPresent()) {
                centerName = centerOpt.get().getName();
            }
        }

        return new InventoryResponse(
            entity.getInventoryId(),
            entity.getPart() != null ? entity.getPart().getPartId() : null,
            partNumber,
            partName,
            entity.getCenter() != null  ? entity.getCenter().getCenterId() : null,
            centerName,
            entity.getAmount(),
            entity.getInvoiceDate()
        );
    }

    private Inventory toEntity(InventoryRequest request) {
        Inventory entity = new Inventory();

        if(request.getId() != null){
            entity.setInventoryId(request.getId());
        }

        if(request.getPartId() != null) {
            Part part = new Part();
            part.setPartId(request.getPartId());
            entity.setPart(part);
        }

        if (request.getCenterId() != null) {
            ServiceCenter center = new ServiceCenter();
            center.setCenterId(request.getCenterId());
            entity.setCenter(center);
        }

        entity.setAmount(request.getAmount());
        entity.setInvoiceDate(request.getInvoiceDate());
        return entity;
    }

    // 1. POST /api/inventory : Tạo/Cập nhật bản ghi tồn kho
    @PostMapping
    public ResponseEntity<?> createOrUpdateInventory(@Valid @RequestBody InventoryRequest request) {
        try {
            Inventory entity = toEntity(request);
            Inventory saved = inventoryService.saveInventory(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 2. GET /api/inventory : Lấy tất cả bản ghi tồn kho
    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        List<InventoryResponse> records = inventoryService.getAllInventoryRecords().stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(records);
    }

    // 3. GET /api/inventory/{id} : Lấy chi tiết bản ghi
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getInventoryById(@PathVariable Long id) {
        Optional<Inventory> recordOpt = inventoryService.getInventoryById(id);
        if(recordOpt.isPresent()) {
            return ResponseEntity.ok(toResponseDTO(recordOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. PUT /api/inventory/{id} : Cập nhật bản ghi tồn kho
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInventory(@PathVariable Long id, @Valid @RequestBody InventoryRequest request) {
        request.setId(id);

        if (inventoryService.getInventoryById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Inventory entity = toEntity(request);
            // 2. Gọi Service để lưu/cập nhật
            Inventory updated = inventoryService.saveInventory(entity);
            return ResponseEntity.ok(toResponseDTO(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 5. DELETE /api/inventory/{id} : Xóa bản ghi tồn kho
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        if(inventoryService.getInventoryById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }

    // 6. GET /api/inventory/search/part/{partId} : Tìm kiếm theo Linh kiện
    @GetMapping("/search/part/{partId}")
    public ResponseEntity<List<InventoryResponse>> getInventoryByPart(@PathVariable Long partId) {
        Part part = new Part();
        part.setPartId(partId);

        List<InventoryResponse> records = inventoryService.getInventoryByPart(part).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(records);
    }

    // 7. GET /api/inventory/search/center/{centerId} : Tìm kiếm theo Trung tâm Dịch vụ
    @GetMapping("/search/center/{centerId}")
    public ResponseEntity<List<InventoryResponse>> getInventoryByCenter(@PathVariable Long centerId) {
        ServiceCenter center = new ServiceCenter();
        center.setCenterId(centerId);

        List<InventoryResponse> records = inventoryService.getInventoryByCenter(center).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(records);
    }

    // 8. GET /api/inventory/restock?amount={amount} : Tìm kiếm các mặt hàng cần bổ sung (Số lượng <= amount)
    @GetMapping("/restock")
    public ResponseEntity<List<InventoryResponse>> getInventoryForReStock(@RequestParam BigDecimal amount) {
        List<InventoryResponse> records = inventoryService.getInventoryForReStock(amount).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(records);
    }

    // 9. GET /api/inventory/invoicedate?start={date}&end={date} : Tìm kiếm theo Ngày Hóa đơn
    @GetMapping("/invoicedate")
    public ResponseEntity<List<InventoryResponse>> getInventoryByInvoiceDateBetween(@RequestParam LocalDate start, @RequestParam LocalDate end) {
        List<InventoryResponse> records = inventoryService.getInventoryByInvoiceDateBetween(start, end).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(records);
    }
    
}
