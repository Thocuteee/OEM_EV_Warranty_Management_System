package edu.uth.warranty.controller;

import edu.uth.warranty.dto.WorkLogRequest;
import edu.uth.warranty.dto.WorkLogResponse;
import edu.uth.warranty.model.WorkLog;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.service.IWorkLogService;
import edu.uth.warranty.repository.WarrantyClaimRepository;
import edu.uth.warranty.repository.TechnicianRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@RestController
@RequestMapping("/api/worklogs")
public class WorkLogController {

    private final IWorkLogService workLogService;
    private final WarrantyClaimRepository claimRepository;
    private final TechnicianRepository technicianRepository;

    public WorkLogController(IWorkLogService workLogService,
                             WarrantyClaimRepository claimRepository,
                             TechnicianRepository technicianRepository) {
        this.workLogService = workLogService;
        this.claimRepository = claimRepository;
        this.technicianRepository = technicianRepository;
    }

    // Lấy tất cả WorkLog
    @GetMapping
    public ResponseEntity<List<WorkLogResponse>> getAllWorkLogs() {
        List<WorkLogResponse> responses = workLogService.getAllWorkLogs()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Lấy WorkLog theo ID
    @GetMapping("/{id}")
    public ResponseEntity<WorkLogResponse> getWorkLogById(@PathVariable Long id) {
        Optional<WorkLog> workLogOpt = workLogService.getWorkLogById(id);
        return workLogOpt.map(workLog -> ResponseEntity.ok(toResponse(workLog)))
                         .orElse(ResponseEntity.notFound().build());
    }

    // Tạo mới WorkLog
    @PostMapping
    public ResponseEntity<WorkLogResponse> createWorkLog(@Valid @RequestBody WorkLogRequest request) {
        WorkLog entity = toEntity(request);
        WorkLog saved = workLogService.saveWorkLog(entity);
        return ResponseEntity.ok(toResponse(saved));
    }

    // Cập nhật WorkLog
    @PutMapping("/{id}")
    public ResponseEntity<WorkLogResponse> updateWorkLog(@PathVariable Long id,
                                                         @Valid @RequestBody WorkLogRequest request) {
        Optional<WorkLog> existingOpt = workLogService.getWorkLogById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        WorkLog entity = toEntity(request);
        entity.setLog_id(id);
        WorkLog updated = workLogService.saveWorkLog(entity);
        return ResponseEntity.ok(toResponse(updated));
    }

    // Xóa WorkLog
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkLog(@PathVariable Long id) {
        workLogService.deleteWorkLog(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================
    // Mapper nội bộ (chuyển đổi giữa Entity ↔ DTO)
    // ==========================

    private WorkLogResponse toResponse(WorkLog entity) {
        WorkLogResponse dto = new WorkLogResponse();
        dto.setId(entity.getLog_id());
        dto.setClaimId(entity.getClaim().getClaim_id());
        dto.setTechnicianId(entity.getTechnician().getTechnician_id());
        dto.setTechnicianName(entity.getTechnician().getName());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setLogDate(entity.getLogDate());
        dto.setDuration(entity.getDuration());
        dto.setNotes(entity.getNotes());
        return dto;
    }

    private WorkLog toEntity(WorkLogRequest request) {
        WorkLog entity = new WorkLog();

        // Gán quan hệ Claim
        WarrantyClaim claim = claimRepository.findById(request.getClaimId())
                .orElseThrow(() -> new IllegalArgumentException("Warranty Claim không tồn tại."));
        entity.setClaim(claim);

        // Gán quan hệ Technician
        Technician tech = technicianRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new IllegalArgumentException("Technician không tồn tại."));
        entity.setTechnician(tech);

        // Gán dữ liệu chính
        entity.setStartTime(request.getStartTime());
        entity.setEndTime(request.getEndTime());
        entity.setLogDate(request.getLogDate());
        entity.setDuration(request.getDuration());
        entity.setNotes(request.getNotes());
        return entity;
    }
}
