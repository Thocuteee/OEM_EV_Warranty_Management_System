package edu.uth.warranty.controller;

import edu.uth.warranty.dto.InventoryRequest;
import edu.uth.warranty.dto.InventoryResponse;
import edu.uth.warranty.model.Inventory;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.service.IInventoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private IInventoryService inventoryService;

    @Autowired
    private PartRepository partRepository;

    @Autowired
    private ServiceCenterRepository centerRepository;

    // ==========================
    // 🔹 GET: Lấy tất cả
    // ==========================
    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        List<InventoryResponse> responseList = inventoryService.getAllInventoryRecords()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    // ==========================
    // 🔹 GET: Lấy theo ID
    // ==========================
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getInventoryById(@PathVariable Long id) {
        Optional<Inventory> inventoryOpt = inventoryService.getInventoryById(id);
        return inventoryOpt.map(inventory -> ResponseEntity.ok(mapToResponse(inventory)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================
    // 🔹 POST: Tạo mới
    // ==========================
    @PostMapping
    public ResponseEntity<?> createInventory(@RequestBody InventoryRequest request) {
        try {
            Inventory newInventory = mapToEntity(request);
            Inventory saved = inventoryService.saveInventory(newInventory);
            return ResponseEntity.ok(mapToResponse(saved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ Lỗi: " + e.getMessage());
        }
    }

    // ==========================
    // 🔹 PUT: Cập nhật
    // ==========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInventory(@PathVariable Long id, @RequestBody InventoryRequest request) {
        Optional<Inventory> existing = inventoryService.getInventoryById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Inventory updatedEntity = mapToEntity(request);
            updatedEntity.setInventory_id(id);
            Inventory updated = inventoryService.saveInventory(updatedEntity);
            return ResponseEntity.ok(mapToResponse(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ Lỗi: " + e.getMessage());
        }
    }

    // ==========================
    // 🔹 DELETE: Xóa theo ID
    // ==========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        Optional<Inventory> existing = inventoryService.getInventoryById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        inventoryService.deleteInventory(id);
        return ResponseEntity.ok("✅ Đã xóa bản ghi tồn kho có ID: " + id);
    }

    // ==========================
    // 🔸 Mapper nội bộ
    // ==========================

    private Inventory mapToEntity(InventoryRequest req) {
        Part part = partRepository.findById(req.getPartId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Part ID: " + req.getPartId()));

        ServiceCenter center = centerRepository.findById(req.getCenterId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Service Center ID: " + req.getCenterId()));

        Inventory inventory = new Inventory();
        inventory.setInventory_id(req.getId());
        inventory.setPart(part);
        inventory.setCenter(center);
        inventory.setAmount(req.getAmount());
        inventory.setInvoiceDate(req.getInvoiceDate());
        return inventory;
    }

    private InventoryResponse mapToResponse(Inventory inventory) {
        InventoryResponse res = new InventoryResponse();
        res.setId(inventory.getInventory_id());

        // Thông tin Part
        res.setPartId(inventory.getPart().getPart_id());
        // Thông tin Center
        res.setCenterId(inventory.getCenter().getCenter_id());
        // Thông tin tồn kho
        res.setAmount(inventory.getAmount());
        res.setInvoiceDate(inventory.getInvoiceDate());
        return res;
    }
}
