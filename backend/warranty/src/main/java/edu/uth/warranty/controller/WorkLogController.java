package edu.uth.warranty.controller;

import edu.uth.warranty.model.WorkLog;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.service.IWorkLogService;
import edu.uth.warranty.repository.WarrantyClaimRepository;
import edu.uth.warranty.repository.TechnicianRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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

    // Lấy toàn bộ WorkLog
    @GetMapping
    public ResponseEntity<List<WorkLog>> getAllWorkLogs() {
        return ResponseEntity.ok(workLogService.getAllWorkLogs());
    }

    // Lấy WorkLog theo ID
    @GetMapping("/{id}")
    public ResponseEntity<WorkLog> getWorkLogById(@PathVariable Long id) {
        return workLogService.getWorkLogById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Thêm mới WorkLog
    @PostMapping
    public ResponseEntity<?> createWorkLog(@RequestBody WorkLog workLog) {
        try {
            WorkLog saved = workLogService.saveWorkLog(workLog);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa WorkLog theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkLog(@PathVariable Long id) {
        workLogService.deleteWorkLog(id);
        return ResponseEntity.noContent().build();
    }

    // Lấy danh sách WorkLog theo Claim
    @GetMapping("/claim/{claimId}")
    public ResponseEntity<List<WorkLog>> getWorkLogsByClaim(@PathVariable Long claimId) {
        return claimRepository.findById(claimId)
                .map(claim -> ResponseEntity.ok(workLogService.getWorkLogsByClaim(claim)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy danh sách WorkLog theo Technician
    @GetMapping("/technician/{techId}")
    public ResponseEntity<List<WorkLog>> getWorkLogsByTechnician(@PathVariable Long techId) {
        return technicianRepository.findById(techId)
                .map(tech -> ResponseEntity.ok(workLogService.getWorkLogsByTechnician(tech)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Lọc WorkLog theo khoảng ngày
    @GetMapping("/date")
    public ResponseEntity<List<WorkLog>> getWorkLogsByDateRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        return ResponseEntity.ok(workLogService.getWorkLogsByLogDateBetween(start, end));
    }

    // Lọc WorkLog có Duration ≥ giá trị cho trước
    @GetMapping("/duration")
    public ResponseEntity<List<WorkLog>> getWorkLogsByMinDuration(@RequestParam BigDecimal min) {
        return ResponseEntity.ok(workLogService.getWorkLogsByDurationGreaterThan(min));
    }

    // Tìm WorkLog theo từ khóa trong ghi chú
    @GetMapping("/search")
    public ResponseEntity<List<WorkLog>> searchWorkLogsByNotes(@RequestParam String keyword) {
        return ResponseEntity.ok(workLogService.searchWorkLogsByNotes(keyword));
    }
}
