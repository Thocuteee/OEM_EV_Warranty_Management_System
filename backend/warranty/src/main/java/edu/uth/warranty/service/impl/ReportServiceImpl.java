package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Report;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.User;

import edu.uth.warranty.repository.*; // Import tất cả các Repository cần thiết
import edu.uth.warranty.service.IReportService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReportServiceImpl implements IReportService{
    private final ReportRepository reportRepository;
    private final WarrantyClaimRepository claimRepository;
    private final TechnicianRepository technicianRepository;
    private final ServiceCenterRepository centerRepository;
    private final VehicleRepository vehicleRepository;
    private final RecallCampaignRepository campaignRepository;
    private final UserRepository userRepository;

    public ReportServiceImpl(
        ReportRepository reportRepository,
        WarrantyClaimRepository claimRepository,
        TechnicianRepository technicianRepository,
        ServiceCenterRepository centerRepository,
        VehicleRepository vehicleRepository,
        RecallCampaignRepository campaignRepository,
        UserRepository userRepository) {
        
        this.reportRepository = reportRepository;
        this.claimRepository = claimRepository;
        this.technicianRepository = technicianRepository;
        this.centerRepository = centerRepository;
        this.vehicleRepository = vehicleRepository;
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Override
    public Optional<Report> getReportById(Long id) {
        return reportRepository.findById(id);
    }

    @Override
    public Report saveReport(Report report) {
        if (report.getClaim() == null || claimRepository.findById(report.getClaim().getClaimId()).isEmpty()) {
            throw new IllegalArgumentException("Report phải liên kết với một Claim tồn tại.");
        }
        if (report.getTechnician() == null || technicianRepository.findById(report.getTechnician().getTechnicianId()).isEmpty()) {
            throw new IllegalArgumentException("Technician không tồn tại.");
        }
        //(Kiểm tra tương tự cho Center, Vehicle, Campaign, CreatedBy)

        //Đảm bảo ReportDate được thiết lập
        if (report.getReportDate() == null) {
            report.setReportDate(LocalDate.now());
        }
        
        //Cập nhật createdDate nếu là bản ghi mới
        if (report.getReportId() == null) {
            report.setCreatedDate(LocalDateTime.now());
        } else {
            report.setUpdatedAt(LocalDateTime.now());
        }
        
        return reportRepository.save(report);
    }

    @Override
    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }

    @Override
    public Optional<Report> getReportByClaim(WarrantyClaim claim) {
        return reportRepository.findByClaim(claim).stream().findFirst(); // Giả sử 1 Claim chỉ có 1 Report
    }

    @Override
    public List<Report> getReportsByTechnician(Technician technician) {
        return reportRepository.findByTechnician(technician);
    }

    @Override
    public List<Report> getReportsByCenter(ServiceCenter center) {
        return reportRepository.findByCenter(center);
    }

    @Override
    public List<Report> getReportsByStatus(String status) {
        return reportRepository.findByStatus(status);
    }

    @Override
    public List<Report> getReportsByCreatedByUser(User user) {
        return reportRepository.findByCreatedBy(user);
    }

    @Override
    public List<Report> getReportsByReportDateBetween(LocalDate startDate, LocalDate endDate) {
        return reportRepository.findByReportDateBetween(startDate, endDate);
    }

    @Override
    public List<Report> getReportsByActualCostGreaterThan(BigDecimal minCost) {
        return reportRepository.findByActualCostGreaterThanEqual(minCost);
    }
}
