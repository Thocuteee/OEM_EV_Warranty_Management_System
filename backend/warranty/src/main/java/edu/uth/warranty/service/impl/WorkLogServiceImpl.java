package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.WorkLog;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.repository.WorkLogRepository;
import edu.uth.warranty.repository.WarrantyClaimRepository;
import edu.uth.warranty.repository.TechnicianRepository;
import edu.uth.warranty.service.IWorkLogService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit; // Dùng để tính toán thời gian
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkLogServiceImpl implements IWorkLogService{
    private final WorkLogRepository workLogRepository;
    private final WarrantyClaimRepository claimRepository;
    private final TechnicianRepository technicianRepository;

    public WorkLogServiceImpl(WorkLogRepository workLogRepository,WarrantyClaimRepository claimRepository,TechnicianRepository technicianRepository) {
        this.workLogRepository = workLogRepository;
        this.claimRepository = claimRepository;
        this.technicianRepository = technicianRepository;
    }

    @Override
    public List<WorkLog> getAllWorkLogs() {
        return workLogRepository.findAll();
    }

    @Override
    public Optional<WorkLog> getWorkLogById(Long id) {
        return workLogRepository.findById(id);
    }

    @Override
    public WorkLog saveWorkLog(WorkLog workLog) {
        //Kiểm tra Khóa Ngoại (FK) có tồn tại không (Logic giữ nguyên)
        if (workLog.getClaim() == null || claimRepository.findById(workLog.getClaim().getClaimId()).isEmpty()) {
            throw new IllegalArgumentException("Warranty Claim không tồn tại hoặc không hợp lệ.");
        }
        if (workLog.getTechnician() == null || technicianRepository.findById(workLog.getTechnician().getTechnicianId()).isEmpty()) {
            throw new IllegalArgumentException("Technician không tồn tại hoặc không hợp lệ.");
        }

        // Tính toán Duration nếu startTime và endTime được cung cấp
        if (workLog.getStartTime() != null && workLog.getEndTime() != null) {
            
            // 1. Kiểm tra logic ngày tháng
            if (workLog.getStartTime().isAfter(workLog.getEndTime())) {
                throw new IllegalArgumentException("Ngày bắt đầu phải trước hoặc bằng Ngày kết thúc.");
            }
            
            // 2. TÍNH TOÁN DURATION (Tính số ngày làm việc, bao gồm ngày cuối)
            if (workLog.getDuration() == null) {
                long daysBetween = ChronoUnit.DAYS.between(workLog.getStartTime(), workLog.getEndTime());
                
                // Thời gian làm việc tối thiểu là 1 ngày (kể cả khi start=end)
                long finalDays = daysBetween + 1;
                
                workLog.setDuration(new BigDecimal(finalDays)); 
            }

        } else if (workLog.getDuration() == null) {
            throw new IllegalArgumentException("Không thể tính Duration, thiếu Ngày bắt đầu hoặc Ngày kết thúc.");
        }
        
        // Thiết lập logDate nếu không có
        if (workLog.getLogDate() == null) {
            workLog.setLogDate(LocalDate.now());
        }

        return workLogRepository.save(workLog);
    }

    @Override
    public void deleteWorkLog(Long id) {
        workLogRepository.deleteById(id);
    }
    
    @Override
    public List<WorkLog> getWorkLogsByClaim(WarrantyClaim claim) {
        return workLogRepository.findByClaim(claim);
    }

    @Override
    public List<WorkLog> getWorkLogsByTechnician(Technician technician) {
        return workLogRepository.findByTechnician(technician);
    }

    @Override
    public List<WorkLog> getWorkLogsByLogDateBetween(LocalDate startDate, LocalDate endDate) {
        return workLogRepository.findByLogDateBetween(startDate, endDate);
    }

    @Override
    public List<WorkLog> getWorkLogsByDurationGreaterThan(BigDecimal duration) {
        return workLogRepository.findByDurationGreaterThanEqual(duration);
    }
    
    @Override
    public List<WorkLog> searchWorkLogsByNotes(String keyword) {
        return workLogRepository.findByNotesContaining(keyword);
    }
}
