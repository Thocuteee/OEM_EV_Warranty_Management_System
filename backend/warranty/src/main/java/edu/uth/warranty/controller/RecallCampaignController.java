package edu.uth.warranty.controller;

import edu.uth.warranty.dto.RecallCampaignRequest;
import edu.uth.warranty.dto.RecallCampaignResponse;
import edu.uth.warranty.model.RecallCampaign;
import edu.uth.warranty.service.IRecallCampaignService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/campaigns")
public class RecallCampaignController {
    private final IRecallCampaignService recallCampaignService;

    public RecallCampaignController(IRecallCampaignService recallCampaignService) {
        this.recallCampaignService = recallCampaignService;
    }

    private RecallCampaignResponse toResponseDTO(RecallCampaign campaign) {
        String status = (campaign.getEndDate() != null && campaign.getEndDate().isBefore(java.time.LocalDate.now())) ? "FINISHED" : "ONGOING";
        
        return new RecallCampaignResponse(
            campaign.getCampaignId(),
            campaign.getTitle(),
            campaign.getStartDate(),
            campaign.getEndDate(),
            status
        );

    }

    private RecallCampaign toEntity(RecallCampaignRequest request) {
        RecallCampaign recallCampaign = new RecallCampaign();

        if(request.getId() != null) {
            recallCampaign.setCampaignId(request.getId());
        }
        recallCampaign.setTitle(request.getTitle());
        recallCampaign.setStartDate(request.getStartDate());
        recallCampaign.setEndDate(request.getEndDate());
        return recallCampaign;
    }



    // 1. POST /api/campaigns : Tạo mới Chiến dịch (EVM Staff/Admin)
    @PostMapping
    public ResponseEntity<RecallCampaignResponse> createCampaign(@Valid @RequestBody RecallCampaignRequest request) {
        try {
            RecallCampaign newCampaign = toEntity(request);
            RecallCampaign saveRecallCampaign = recallCampaignService.recallCampaign(newCampaign);

            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saveRecallCampaign));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 2. GET /api/campaigns : Lấy tất cả Chiến dịch
    @GetMapping
    public ResponseEntity<List<RecallCampaignResponse>> getAllCampain() {
        List<RecallCampaign> campaigns = recallCampaignService.getAllCampaign();
        List<RecallCampaignResponse> responses = campaigns.stream().map(this::toResponseDTO).collect(Collectors.toList());

        return ResponseEntity.ok(responses);

    }

    // 3. GET /api/campaigns/{id} : Lấy chi tiết Chiến dịch
    @GetMapping("/{id}")
    public ResponseEntity<RecallCampaignResponse> getCampaignById(@PathVariable Long id) {
        Optional<RecallCampaign> campaigns = recallCampaignService.getCampaignById(id);
        if(campaigns.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(campaigns.get()));
    }

    // 4. PUT /api/campaigns/{id} : Cập nhật Chiến dịch
    @PutMapping("/{id}")
    public ResponseEntity<RecallCampaignResponse> updateCampaign(@PathVariable Long id, @Valid @RequestBody RecallCampaignRequest request) {
        request.setId(id);

        if(recallCampaignService.getCampaignById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            RecallCampaign updatedCampaign = recallCampaignService.recallCampaign(toEntity(request));
            return ResponseEntity.ok(toResponseDTO(updatedCampaign));
        }  catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 5. DELETE /api/campaigns/{id} : Xóa Chiến dịch
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        try{
            recallCampaignService.deleteCampaign(id);
            return ResponseEntity.noContent().build();
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    
}
