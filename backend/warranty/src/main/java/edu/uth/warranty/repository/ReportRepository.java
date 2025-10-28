package edu.uth.warranty.repository;

import edu.uth.warranty.model.Report;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.RecallCampaign;
import edu.uth.warranty.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long>{
    Optional<Report> findByClaim(WarrantyClaim claim);

    List<Report> findByTechnician(Technician technician);

    List<Report> findByCenter(ServiceCenter center);

    List<Report> findByVehicle(Vehicle vehicle);

    List<Report> findByCampaign(RecallCampaign campaign);

    List<Report> findByCreatedBy(User createdBy);

    List<Report> findByStatus(String status);

    List<Report> findByReportDateBetween(LocalDate startDate, LocalDate endDate);

    List<Report> findByStartedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Report> findByFinishedAtBetween(LocalDateTime start, LocalDateTime end);
}
