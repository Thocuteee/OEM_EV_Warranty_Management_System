package edu.uth.warranty.controller;

import edu.uth.warranty.dto.VehiclePartHistoryRequest;
import edu.uth.warranty.dto.VehiclePartHistoryResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.VehiclePartHistory;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.service.IVehiclePartHistoryService;
import edu.uth.warranty.service.IVehicleService;
import edu.uth.warranty.service.IPartSerialService;
import edu.uth.warranty.service.IWarrantyClaimService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vehicle-history")
public class VehiclePartHistoryController {
    private final IVehiclePartHistoryService vehiclePartHistoryService;
    private final IVehicleService vehicleService;
    private final IPartSerialService partSerialService;
    private final IWarrantyClaimService warrantyClaimService;

    public VehiclePartHistoryController(IVehiclePartHistoryService vehiclePartHistoryService, IVehicleService vehicleService, IPartSerialService partSerialService, IWarrantyClaimService warrantyClaimService) {
        this.vehiclePartHistoryService = vehiclePartHistoryService;
        this.vehicleService = vehicleService;
        this.partSerialService = partSerialService;
        this.warrantyClaimService = warrantyClaimService;
    }

    private VehiclePartHistoryResponse toResponseDTO(VehiclePartHistory entity) {
        String vehicleVIN = null;
        String partSerialNumber = null;
        String claimStatus = null;

        if(entity.getVehicle() != null && entity.getVehicle().getVehicleId() != null) {
            vehicleVIN = vehicleService.getAllById(entity.getVehicle().getVehicleId()).map(Vehicle::getVIN).orElse(null);
        }
        if(entity.getPartserial() != null && entity.getPartserial().getPartSerialId() != null){
            partSerialNumber = partSerialService.getPartSerialById(entity.getPartserial().getPartSerialId()).map(PartSerial::getSerialNumber).orElse(null);
        }
        if(entity.getClaim() != null && entity.getClaim().getClaimId() != null) {
            claimStatus = warrantyClaimService.getWarrantyClaimById(entity.getClaim().getClaimId()).map(WarrantyClaim::getStatus).orElse(null);
        }

        return new VehiclePartHistoryResponse(
            entity.getHistoryId(),
            entity.getVehicle() != null ? entity.getVehicle().getVehicleId() : null,
            vehicleVIN,
            entity.getPartserial() != null ? entity.getPartserial().getPartSerialId():null,
            partSerialNumber,
            entity.getClaim() != null ? entity.getClaim().getClaimId():null,
            claimStatus,
            entity.getDateInstalled()
        );
    }

    private VehiclePartHistory toEntity(VehiclePartHistoryRequest request) {
        VehiclePartHistory entity = new VehiclePartHistory();
        if(request.getId() != null) {
            entity.setHistoryId(request.getId());
        }
        if(request.getVehicleId() != null) {
            entity.setVehicle(new Vehicle(request.getVehicleId()));
        }
        if(request.getPartSerialId() != null) {
            PartSerial partSerial = new PartSerial();
            partSerial.setPartSerialId(request.getPartSerialId());
            entity.setPartserial(partSerial);
        }
        if(request.getClaimId() != null) {
            entity.setClaim(new WarrantyClaim(request.getClaimId()));
        }
        entity.setDateInstalled(request.getDateInstalled());
        return entity;
    }

    // 1. POST /api/vehicle-history : Tạo mới Lịch sử Linh kiện
    @PostMapping
    public ResponseEntity<?> createVehicleRecord(@Valid @RequestBody VehiclePartHistoryRequest request) {
        try {
            VehiclePartHistory newRecord = toEntity(request);
            request.setId(null);
            VehiclePartHistory saved = vehiclePartHistoryService.saveHistoryRecord(newRecord);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
            
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }   

    // 2. GET /api/vehicle-history : Lấy tất cả Lịch sử Linh kiện
    @GetMapping
    public ResponseEntity<List<VehiclePartHistoryResponse>> getAllVehicleRecord() {
        List<VehiclePartHistoryResponse>responses = vehiclePartHistoryService.getAllHistoryRecords().stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 3. GET /api/vehicle-history/{id} : Lấy chi tiết Lịch sử
    @GetMapping("/{id}")
    public ResponseEntity<VehiclePartHistoryResponse> getAllVehicleById(@PathVariable Long id) {
        Optional<VehiclePartHistory> recordOpt = vehiclePartHistoryService.getHistoryRecordById(id);
        if(recordOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(recordOpt.get()));
    }

    // 4. PUT /api/vehicle-history/{id} : Cập nhật Lịch sử
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicleRecords(@PathVariable Long id, @Valid @RequestBody VehiclePartHistoryRequest request) {
        request.setId(id);

        if(vehiclePartHistoryService.getHistoryRecordById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            VehiclePartHistory entity = toEntity(request);
            VehiclePartHistory updated = vehiclePartHistoryService.saveHistoryRecord(entity);
            return ResponseEntity.ok(toResponseDTO(entity));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 5. DELETE /api/vehicle-history/{id} : Xóa Lịch sử
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicleRecord(@PathVariable Long id) {
        if(vehiclePartHistoryService.getHistoryRecordById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        vehiclePartHistoryService.deleteHistoryRecord(id);
        return ResponseEntity.noContent().build();
    }

    // 6. GET /api/vehicle-history/by-vehicle/{vehicleId} : Lấy lịch sử theo Xe
    @GetMapping("/by-vehicle/{vehicleId}")
    public ResponseEntity<List<VehiclePartHistoryResponse>> getHistoryByVehicle(@PathVariable Long vehicelId) {
        Vehicle vehicle = new Vehicle(vehicelId);

        List<VehiclePartHistoryResponse> responses = vehiclePartHistoryService.getHistoryByVehicle(vehicle).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 7. GET /api/vehicle-history/by-claim/{claimId} : Lấy lịch sử theo Claim
    @GetMapping("/by-claim/{claimId}")
    public ResponseEntity<List<VehiclePartHistoryResponse>> getHistoryByClai(@PathVariable Long claimId) {
        WarrantyClaim claim = new WarrantyClaim(claimId);

        List<VehiclePartHistoryResponse> responses = vehiclePartHistoryService.getHistoryByClaim(claim).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 8. GET /api/vehicle-history/by-date?start={date}&end={date} : Tìm kiếm theo Ngày Lắp đặt
    @GetMapping("/by-date")
    public ResponseEntity<List<VehiclePartHistoryResponse>> getHistoryByDateInstalledBetween(@RequestParam LocalDate start, @RequestParam LocalDate end) {
        List<VehiclePartHistoryResponse> responses = vehiclePartHistoryService.getHistoryByDateInstalledBetween(start, end).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }






}
