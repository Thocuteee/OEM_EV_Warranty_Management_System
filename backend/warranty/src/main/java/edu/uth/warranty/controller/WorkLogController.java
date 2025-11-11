package edu.uth.warranty.controller;

import edu.uth.warranty.dto.WorkLogRequest;
import edu.uth.warranty.dto.WorkLogResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.WorkLog;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.service.IWorkLogService;
import edu.uth.warranty.service.ITechnicianService;
import edu.uth.warranty.service.IWarrantyClaimService;

import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/worklogs")
public class WorkLogController {
    private final IWorkLogService workLogService;
    private final ITechnicianService technicianService;

    public WorkLogController(IWorkLogService workLogService, ITechnicianService technicianService) {
        this.workLogService = workLogService;
        this.technicianService = technicianService;
    }

    private WorkLogResponse toReponseDTO(WorkLog entity) {
        String technicianName = null;

        if(entity.getTechnician() != null && entity.getTechnician().getTechnicianId() != null) {
            Optional<Technician> techOpt = technicianService.getTechnicianById(entity.getTechnician().getTechnicianId());
            technicianName = techOpt.map(Technician::getName).orElse(null);
        }   
        return new WorkLogResponse(
            entity.getLogId(),
            entity.getClaim() != null ? entity.getClaim().getClaimId() : null,
            entity.getTechnician() != null ? entity.getTechnician().getTechnicianId() : null,
            technicianName,
            entity.getStartTime(),
            entity.getEndTime(),
            entity.getLogDate(),
            entity.getDuration(),
            entity.getNotes()
        );

    }

    private WorkLog toEntity(WorkLogRequest request) {
        WorkLog entity = new WorkLog();

        if(request.getId() != null) {
            entity.setLogId(request.getId());
        }

        if(request.getClaimId() != null) {
            entity.setClaim(new WarrantyClaim(request.getClaimId()));
        }

        if(request.getTechnicianId() != null) {
            entity.setTechnician(new Technician(request.getTechnicianId()));
        }

        entity.setStartTime(request.getStartTime());
        entity.setEndTime(request.getEndTime());
        entity.setLogDate(request.getLogDate());
        entity.setDuration(request.getDuration());
        entity.setNotes(request.getNotes());
        
        return entity;
    }

    // 1. POST /api/worklogs : Tạo mới Work Log
    @PostMapping
    public ResponseEntity<?> createWorkLog(@Valid @RequestBody WorkLogRequest request) {
        try {
            WorkLog entity = toEntity(request);
            entity.setLogId(null);
            WorkLog saved = workLogService.saveWorkLog(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(toReponseDTO(saved));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }

    }

    // 2. GET /api/worklogs : Lấy tất cả Work Logs
    @GetMapping
    public ResponseEntity<List<WorkLogResponse>> getAllWorkLog() {
        List<WorkLogResponse> records = workLogService.getAllWorkLogs().stream().map(this::toReponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(records);
    }

    // 3. GET /api/worklogs/{id} : Lấy chi tiết Work Log
    @GetMapping("/{id}")
    public ResponseEntity<WorkLogResponse> getWorkLogById(@PathVariable Long id) {
        Optional<WorkLog> recordOpt = workLogService.getWorkLogById(id);

        if(recordOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toReponseDTO(recordOpt.get()));
    }

    // 4. PUT /api/worklogs/{id} : Cập nhật Work Log
    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorkLog(@PathVariable Long id, @Valid @RequestBody WorkLogRequest request) {
        request.setId(id);

        if(workLogService.getWorkLogById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            WorkLog entity = toEntity(request);
            WorkLog updated = workLogService.saveWorkLog(entity);
            return ResponseEntity.ok(toReponseDTO(updated));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 5. DELETE /api/worklogs/{id} : Xóa Work Log
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkLog(@PathVariable Long id) {
        if(workLogService.getWorkLogById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        workLogService.deleteWorkLog(id);
        return ResponseEntity.noContent().build();
    }

    // 6. GET /api/worklogs/search/claim/{claimId} : Tìm kiếm theo Claim
    @GetMapping("/search/claim/{claimId}")
    public ResponseEntity<List<WorkLogResponse>> getWorkLogsByClaim(@PathVariable Long claimId) {
        WarrantyClaim claim = new WarrantyClaim(claimId);

        List<WorkLogResponse> responses = workLogService.getWorkLogsByClaim(claim).stream().map(this::toReponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 7. GET /api/worklogs/search/technician/{technicianId} : Tìm kiếm theo Technician
    @GetMapping("/search/technician/{technicianId}")
    public ResponseEntity<List<WorkLogResponse>> getWorkLogsByTechnician(@PathVariable Long technicianId) {
        Technician technician = new Technician();

        List<WorkLogResponse> responses = workLogService.getWorkLogsByTechnician(technician).stream().map(this::toReponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 8. GET /api/worklogs/search/date?start={date}&end={date} : Tìm kiếm theo Ngày Log
    @GetMapping("/search/date")
    public ResponseEntity<List<WorkLogResponse>> getWorkLogsByLogDateBetween(@RequestParam LocalDate start, @RequestParam LocalDate end) {
        List<WorkLogResponse> responses = workLogService.getWorkLogsByLogDateBetween(start, end).stream().map(this::toReponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 9. GET /api/worklogs/search/duration?duration={duration} : Tìm kiếm theo Thời lượng làm việc (>= duration)
    @GetMapping("/search/duration")
    public ResponseEntity<List<WorkLogResponse>> getWorkLogsByDurationGreaterThan(@RequestParam BigDecimal duration) {
        List<WorkLogResponse> responses = workLogService.getWorkLogsByDurationGreaterThan(duration).stream().map(this::toReponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 10. GET /api/worklogs/search/notes?keyword={keyword} : Tìm kiếm theo Ghi chú (chứa keyword)
    @GetMapping("/search/notes")
    public ResponseEntity<List<WorkLogResponse>> searchWorkLogsByNotes(@RequestParam String keyword) {
        List<WorkLogResponse> responses = workLogService.searchWorkLogsByNotes(keyword).stream().map(this::toReponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

}
