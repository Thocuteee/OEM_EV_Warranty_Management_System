package edu.uth.warranty.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Worklog;

@Repository
public interface WorkLogRepository extends JpaRepository<Worklog, Long> {

    // Lấy danh sách log theo claim
    List<Worklog> findByClaim_ClaimId(Long claimId);

    // Lấy log theo kỹ thuật viên
    List<Worklog> findByTechnician_TechnicianId(Long technicianId);

    // Lấy log theo kỹ thuật viên trong khoảng thời gian làm việc
    List<Worklog> findByTechnician_TechnicianIdAndWorkDateBetween(
            Long technicianId,
            LocalDate startDate,
            LocalDate endDate
    );
}
