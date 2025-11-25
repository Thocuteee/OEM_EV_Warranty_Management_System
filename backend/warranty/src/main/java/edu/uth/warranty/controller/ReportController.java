package edu.uth.warranty.controller;

import edu.uth.warranty.dto.ReportRequest;
import edu.uth.warranty.dto.ReportResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.*;
import edu.uth.warranty.service.*;

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
@RequestMapping("/api/reports")
public class ReportController {
    private final IReportService reportService;
    private final ITechnicianService technicianService;
    private final IUserService userService;

    public ReportController(IReportService reportService, ITechnicianService technicianService, IUserService userService) {
        this.reportService = reportService;
        this.technicianService = technicianService;
        this.userService = userService;
    }

    private ReportResponse toResponseDTO(Report entity) {
        String technicianName = null;
        String createdByUsername = entity.getCreatedByUsername();

        if(entity.getTechnician() != null && entity.getTechnician().getTechnicianId() != null) {
            Optional<Technician> techOpt = technicianService.getTechnicianById(entity.getTechnician().getTechnicianId());
            technicianName = techOpt.map(Technician::getName).orElse(null);
        }

        BigDecimal totalCalculatedCost = BigDecimal.ZERO;
        if(entity.getPartCost() != null) {
            totalCalculatedCost = totalCalculatedCost.add(entity.getPartCost());
        } if (entity.getActualCost() != null) {
            totalCalculatedCost = totalCalculatedCost.add(entity.getActualCost());
        }

        return new ReportResponse(
            entity.getReportId(),
            entity.getStatus(),
            entity.getReportDate(),
            null,
            entity.getPartCost(),
            entity.getActualCost(),
            totalCalculatedCost,
            entity.getStartedAt(),
            entity.getFinishedAt(),
            entity.getActionTaken(),
            entity.getClaim() != null ? entity.getClaim().getClaimId() : null,
            entity.getTechnician() != null ? entity.getTechnician().getTechnicianId() : null,
            technicianName,
            entity.getCenter() != null ? entity.getCenter().getCenterId() : null,
            entity.getVehicle() != null ? entity.getVehicle().getVehicleId() : null,
            entity.getCampaign() != null ? entity.getCampaign().getCampaignId() : null,
            entity.getDescription(),
            entity.getPartUsed(),
            entity.getReplacedPart(),
            createdByUsername, 
            entity.getCreatedDate(),
            entity.getUpdatedAt()
        );
    }

    private Report toEntity(ReportRequest request) {
        Report entity = new Report();
        if(request.getId() != null) {
            entity.setReportId(request.getId());
        }

        if (request.getClaimId() != null) {
            entity.setClaim(new WarrantyClaim(request.getClaimId())); 
        }

        if (request.getTechnicianId() != null) {
            entity.setTechnician(new Technician(request.getTechnicianId())); 
        }

        if (request.getCenterId() != null) {
            entity.setCenter(new ServiceCenter(request.getCenterId())); 
        }

        if (request.getVehicleId() != null) {
            entity.setVehicle(new Vehicle(request.getVehicleId())); 
        }

        // Campaign là optional - chỉ set nếu có campaignId, nếu không set null
        if (request.getCampaignId() != null && request.getCampaignId() > 0) {
            entity.setCampaign(new RecallCampaign(request.getCampaignId())); 
        } else {
            entity.setCampaign(null); // Đảm bảo set null khi không có campaignId
        }
    
        if (request.getCreatedById() != null) {
            entity.setCreatedBy(new User(request.getCreatedById()));
        }

        entity.setStatus(request.getStatus());
        entity.setReportDate(request.getReportDate());
        entity.setStartedAt(request.getStartedAt());
        entity.setFinishedAt(request.getFinishedAt());
        entity.setDescription(request.getDescription());
        entity.setActionTaken(request.getActionTaken());
        entity.setPartUsed(request.getPartUsed());
        entity.setReplacedPart(request.getReplacedPart());
        entity.setPartCost(request.getPartCost());
        entity.setActualCost(request.getActualCost());
        entity.setCreatedByUsername(request.getCreatedByText()); 
        entity.setUpdatedBy(request.getUpdatedBy());
        
        
        return entity;
    }

    // 1. POST /api/reports : Tạo mới Report
    @PostMapping
    public ResponseEntity<?> createReport(@Valid @RequestBody ReportRequest request) {
        try {
            Report entity = toEntity(request);
            entity.setReportId(null);

            Report saved = reportService.saveReport(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 2. GET /api/reports : Lấy tất cả Reports
    @GetMapping
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        List<ReportResponse> responses = reportService.getAllReports().stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 3. GET /api/reports/{id} : Lấy chi tiết Report
    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        Optional<Report> reportOpt = reportService.getReportById(id);
        if(reportOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(reportOpt.get()));
    }

    // 4. PUT /api/reports/{id} : Cập nhật Report
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReport(@PathVariable Long id, @Valid @RequestBody ReportRequest request) {
        request.setId(id);
        if(reportService.getReportById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            Report entity = toEntity(request);
            Report updated = reportService.saveReport(entity);
            return ResponseEntity.ok(toResponseDTO(updated));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 5. DELETE /api/reports/{id} : Xóa Report
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        if (reportService.getReportById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    // 6. GET /api/reports/search/technician/{technicianId} : Tìm kiếm theo Technician
    @GetMapping("/search/technician/{technicianId}")
    public ResponseEntity<List<ReportResponse>> getReportsByTechnician(@PathVariable Long technicianId) {
        Technician technician = new Technician(technicianId);
        List<ReportResponse> responses = reportService.getReportsByTechnician(technician).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 7. GET /api/reports/search/status?status={status} : Tìm kiếm theo Trạng thái Report
    @GetMapping("/search/status")
    public ResponseEntity<List<ReportResponse>> getReportsByStatus(@RequestParam String status) {
        List<ReportResponse> responses = reportService.getReportsByStatus(status).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 8. GET /api/reports/search/date?start={date}&end={date} : Tìm kiếm theo Ngày Report
    @GetMapping("/search/date")
    public ResponseEntity<List<ReportResponse>> getReportsByReportDateBetween(@RequestParam LocalDate start, @RequestParam LocalDate end) {
        List<ReportResponse> responses = reportService.getReportsByReportDateBetween(start, end).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 9. GET /api/reports/search/cost?minCost={minCost} : Tìm kiếm theo Chi phí Lao động thực tế (>= minCost)
    @GetMapping("/search/cost")
    public ResponseEntity<List<ReportResponse>> getReportsByActualCostGreaterThan(@RequestParam BigDecimal minCost) {
        List<ReportResponse> responses = reportService.getReportsByActualCostGreaterThan(minCost).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 10. GET /api/reports/search/claim/{claimId} : Tìm kiếm theo Claim
    @GetMapping("/search/claim/{claimId}")
    public ResponseEntity<List<ReportResponse>> getReportsByClaim(@PathVariable Long claimId) {
        WarrantyClaim claim = new WarrantyClaim(claimId);

        List<ReportResponse> responses = reportService.getReportByClaim(claim).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }




}
