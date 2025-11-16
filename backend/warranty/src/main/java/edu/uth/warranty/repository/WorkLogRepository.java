package edu.uth.warranty.repository;

import edu.uth.warranty.model.WorkLog;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;


@Repository
public interface WorkLogRepository extends JpaRepository<WorkLog, Long>{
    List<WorkLog> findByClaim(WarrantyClaim claim);

    List<WorkLog> findByTechnician(Technician technician);

    List<WorkLog> findByLogDateBetween(LocalDate startDate, LocalDate endDate);

    List<WorkLog> findByDurationGreaterThanEqual(BigDecimal duration);

    List<WorkLog> findByNotesContaining(String keyword);
}
