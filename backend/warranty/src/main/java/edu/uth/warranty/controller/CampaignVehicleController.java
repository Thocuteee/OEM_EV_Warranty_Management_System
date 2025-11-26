package edu.uth.warranty.controller;

import edu.uth.warranty.dto.CampaignVehicleRequest;
import edu.uth.warranty.dto.CampaignVehicleResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.CampaignVehicle;
import edu.uth.warranty.model.RecallCampaign;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.service.ICampaignVehicleService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@RestController
@RequestMapping("/api/campaign-vehicles")
public class CampaignVehicleController {
    private final ICampaignVehicleService campaignVehicleService;

    public CampaignVehicleController(ICampaignVehicleService campaignVehicleService) {
        this.campaignVehicleService = campaignVehicleService;
    }

    private CampaignVehicleResponse toResponseDTO(CampaignVehicle campaignVehicle) {
        String campaigntitle = campaignVehicle.getRecallCampaignEntity() != null ? campaignVehicle.getRecallCampaignEntity().getTitle() : null;
        String vehicleVIN = campaignVehicle.getVehicleEntity() != null ? campaignVehicle.getVehicleEntity().getVIN() : null;
        String vehicleModel = campaignVehicle.getVehicleEntity() != null ? campaignVehicle.getVehicleEntity().getModel() : null;

        return new CampaignVehicleResponse(
            campaignVehicle.getRecallCampaignEntity() != null ? campaignVehicle.getRecallCampaignEntity().getCampaignId() : null,
            campaignVehicle.getVehicleEntity() != null ? campaignVehicle.getVehicleEntity().getVehicleId() : null,
            campaigntitle,
            vehicleVIN,
            vehicleModel,
            campaignVehicle.getStatus()
        );
    }

    private CampaignVehicle toEntity(CampaignVehicleRequest request) {
        RecallCampaign campaign = new RecallCampaign(request.getCampaignId());

        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleId(request.getVehicleId()); // Lấy ID từ Request

        CampaignVehicle entity = new CampaignVehicle();
        
        // Set composite key IDs trước khi set entities
        entity.setCampaignId(request.getCampaignId());
        entity.setVehicleId(request.getVehicleId());
        
        entity.setRecallCampaignEntity(campaign);
        entity.setVehicleEntity(vehicle);
        
        entity.setStatus(request.getStatus());
        return entity;
    }

    // 1. POST /api/campaign-vehicles : Thêm Xe vào Chiến dịch (hoặc cập nhật trạng thái)
    @PostMapping
    public ResponseEntity<?> createOrUpdateCampaignVehicle(@Valid @RequestBody CampaignVehicleRequest request) {
        try {
            CampaignVehicle entity = toEntity(request);
            CampaignVehicle saveEntity = campaignVehicleService.saveCampaignVehicle(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saveEntity));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch(Exception e) {
            // Log lỗi để debug
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Lỗi máy chủ: " + e.getMessage()));
        }
    }

    // 2. GET /api/campaign-vehicles : Lấy tất cả các mối quan hệ Campaign-Vehicle
    @GetMapping
    public ResponseEntity<List<CampaignVehicleResponse>> getAllCampaignVehicles() {
        List<CampaignVehicle> entity = campaignVehicleService.getAllCampaignVehicle();

        List<CampaignVehicleResponse> responses = entity.stream().map(this::toResponseDTO).collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    } 

    // 3. GET /api/campaign-vehicles/{campaignId}/{vehicleId} : Lấy chi tiết mối quan hệ
    @GetMapping("/{campaignId}/{vehicleId}")
    public ResponseEntity<CampaignVehicleResponse> getCampaignVehiclesById(@PathVariable Long campaignId, @PathVariable Long vehicleId) {
        Optional<CampaignVehicle> entity = campaignVehicleService.getCampaignVehicleById(campaignId, vehicleId);

        if(entity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(entity.get()));
    }

    // 4. DELETE /api/campaign-vehicles/{campaignId}/{vehicleId} : Xóa mối quan hệ
    @DeleteMapping("/{campaignId}/{vehicleId}")
    public ResponseEntity<Void> deleteCampaignVehicle(@PathVariable Long campaignId, @PathVariable Long vehicleId) {
        try {
            campaignVehicleService.deleteCampaignVehicle(campaignId, vehicleId);
            return ResponseEntity.noContent().build();
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 5. GET /api/campaign-vehicles/by-status?status={status} : Tìm kiếm theo trạng thái
    @GetMapping("/by-status")
    public ResponseEntity<List<CampaignVehicleResponse>> getCampaignVehicleByStatus(@RequestParam String status) {
        List<CampaignVehicle> entity = campaignVehicleService.getCampaignVehiclesByStatus(status);

        List<CampaignVehicleResponse> responses = entity.stream().map(this::toResponseDTO).collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // 6. GET /api/campaign-vehicles/by-campaign/{campaignId} : Lấy tất cả xe trong một chiến dịch
    @GetMapping("/by-campaign/{campaignId}")
    public ResponseEntity<List<CampaignVehicleResponse>> getCampaignVehiclesByCampaignId(@PathVariable Long campaignId) {
        RecallCampaign campaign = new RecallCampaign();
        campaign.setCampaignId(campaignId);
        
        List<CampaignVehicle> entities = campaignVehicleService.getCampaignVehiclesByCampaign(campaign);
        List<CampaignVehicleResponse> responses = entities.stream().map(this::toResponseDTO).collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    // 7. GET /api/campaign-vehicles/by-vehicle/{vehicleId} : Lấy tất cả chiến dịch của một xe
    @GetMapping("/by-vehicle/{vehicleId}")
    public ResponseEntity<List<CampaignVehicleResponse>> getCampaignVehiclesByVehicleId(@PathVariable Long vehicleId) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleId(vehicleId);
        
        List<CampaignVehicle> entities = campaignVehicleService.getCampaignsByVehicle(vehicle);
        List<CampaignVehicleResponse> responses = entities.stream().map(this::toResponseDTO).collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
}