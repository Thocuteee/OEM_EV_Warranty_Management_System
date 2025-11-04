package edu.uth.warranty.service;

import edu.uth.warranty.model.Report;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IReportService {
    List<Report> getAllReports();
    Optional<Report> getReportById(Long id);

    Report saveReport(Report report);
    
    void deleteReport(Long id);

    Optional<Report> getReportByClaim(WarrantyClaim claim);

    List<Report> getReportsByTechnician(Technician technician);

    List<Report> getReportsByCenter(ServiceCenter center);

    List<Report> getReportsByStatus(String status);

    List<Report> getReportsByCreatedByUser(User user);

    List<Report> getReportsByReportDateBetween(LocalDate startDate, LocalDate endDate);

    List<Report> getReportsByActualCostGreaterThan(BigDecimal minCost);
}
