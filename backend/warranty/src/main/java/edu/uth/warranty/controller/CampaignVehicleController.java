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
        String campaigntitle = campaignVehicle.getCampaign() != null ? campaignVehicle.getCampaign().getTitle():null;
        String vehicleVIN = campaignVehicle.getVehicle() != null ? campaignVehicle.getVehicle().getVIN():null;

        return new CampaignVehicleResponse(
            campaignVehicle.getCampaign().getCampaignId(),
            campaignVehicle.getVehicle().getVehicleId(),
            campaigntitle,
            vehicleVIN,
            campaignVehicle.getStatus()
        );
    }

    private CampaignVehicle toEntity(CampaignVehicleRequest request) {
        RecallCampaign campaign = new RecallCampaign();
        campaign.setCampaignId(campaign.getCampaignId());

        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleId(vehicle.getVehicleId());

        CampaignVehicle entity = new CampaignVehicle();
        entity.setCampaign(campaign);
        entity.setVehicle(vehicle);
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
            // HTTP 204 No Content là tiêu chuẩn cho Delete thành công

            campaignVehicleService.deleteCampaignVehicle(campaignId, vehicleId);

            return ResponseEntity.noContent().build();
        } catch(Exception e) {
            // Xử lý lỗi nếu việc xóa thất bại (có thể là lỗi server)
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
}
