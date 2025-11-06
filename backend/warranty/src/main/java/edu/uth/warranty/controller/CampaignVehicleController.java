package edu.uth.warranty.controller;

import edu.uth.warranty.dto.CampaignVehicleRequest;
import edu.uth.warranty.dto.CampaignVehicleResponse;
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
            
        );
    }






    // 1. POST /api/campaign-vehicles : Thêm Xe vào Chiến dịch (hoặc cập nhật trạng thái)







    // 2. GET /api/campaign-vehicles : Lấy tất cả các mối quan hệ Campaign-Vehicle








    // 3. GET /api/campaign-vehicles/{campaignId}/{vehicleId} : Lấy chi tiết mối quan hệ





    // 4. DELETE /api/campaign-vehicles/{campaignId}/{vehicleId} : Xóa mối quan hệ








    // 5. GET /api/campaign-vehicles/by-status?status={status} : Tìm kiếm theo trạng thái
}
