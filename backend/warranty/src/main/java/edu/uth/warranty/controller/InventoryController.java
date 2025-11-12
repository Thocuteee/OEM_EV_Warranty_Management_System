package edu.uth.warranty.controller;

import edu.uth.warranty.dto.InventoryRequest;
import edu.uth.warranty.dto.InventoryResponse;
import edu.uth.warranty.model.Inventory;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.service.IInventoryService;
import edu.uth.warranty.service.IPartService;
import edu.uth.warranty.service.IServiceCenterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
@Validated
public class InventoryController {

    private final IInventoryService inventoryService;
    private final IPartService partService;
    private final IServiceCenterService serviceCenterService;

 
    public InventoryController(IInventoryService inventoryService, IPartService partService, IServiceCenterService serviceCenterService) {
        this.inventoryService = inventoryService;
        this.partService = partService;
        this.serviceCenterService = serviceCenterService;
    }

 

    // Chuyển đổi Entity sang Response DTO
    private InventoryResponse toResponseDTO(Inventory inventory) {
       
        return new InventoryResponse(
                inventory.getInventory_id(),      
                inventory.getPart().getPartId(), 
                inventory.getCenter().getCenter_id(), 
                inventory.getAmount(),           
                inventory.getInvoiceDate()       
        );
    }

    // Chuyển đổi Request DTO sang Entity
    private Inventory toEntity(InventoryRequest request) {
        Inventory inventory = new Inventory();

        if (request.getId() != null) {
            inventory.setInventory_id(request.getId());
        }

     
        Part part = partService.getPartById(request.getPartId())
                .orElseThrow(() -> new RuntimeException()); 
        
        ServiceCenter center = serviceCenterService.getServiceCenterById(request.getCenterId())
                .orElseThrow(() -> new RuntimeException());

        inventory.setPart(part);
        inventory.setCenter(center);
        inventory.setAmount(request.getAmount());
        inventory.setInvoiceDate(request.getInvoiceDate());

        return inventory;
    }

    

    // 1. POST /api : Tạo mới một Inventory
    @PostMapping
    public ResponseEntity<InventoryResponse> createInventory(@Valid @RequestBody InventoryRequest request) {
        Inventory newInventory = toEntity(request);
        Inventory savedInventory = inventoryService.saveInventory(newInventory);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(savedInventory));
    }

    // 2. GET /api/: Lấy tất cả Inventory
    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        List<Inventory> inventories = inventoryService.getAllInventoryRecords();
        List<InventoryResponse> responses = inventories.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 3. GET /api{id} : Lấy chi tiết Inventory
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getInventoryById(@PathVariable Long id) {
        Optional<Inventory> inventory = inventoryService.getInventoryById(id);

        if (inventory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(inventory.get()));
    }

    // 4. PUT /api{id} : Cập nhật Inventory
    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponse> updateInventory(@PathVariable Long id, @Valid @RequestBody InventoryRequest request) {
        request.setId(id);

        if (inventoryService.getInventoryById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Inventory updatedInventory = inventoryService.saveInventory(toEntity(request));
        return ResponseEntity.ok(toResponseDTO(updatedInventory));
    }

    // 5. DELETE /api{id} : Xóa Inventory
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        if (inventoryService.getInventoryById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }
}