package edu.uth.warranty.service;

import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Technician;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IWorkLogService {
    List<WorkLog> getAllWorkLogs();
    Optional<WorkLog> getWorkLogById(Long id);

    WorkLog saveWorkLog(WorkLog workLog);
    
    void deleteWorkLog(Long id);

    List<WorkLog> getWorkLogsByClaim(WarrantyClaim claim);

    List<WorkLog> getWorkLogsByTechnician(Technician technician);

    List<WorkLog> getWorkLogsByLogDateBetween(LocalDate startDate, LocalDate endDate);

    List<WorkLog> getWorkLogsByDurationGreaterThan(BigDecimal duration);

    List<WorkLog> searchWorkLogsByNotes(String keyword);
}
