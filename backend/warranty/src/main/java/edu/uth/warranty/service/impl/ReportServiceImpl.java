package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Report;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.User;

import edu.uth.warranty.repository.*; 
import edu.uth.warranty.service.IReportService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReportServiceImpl implements IReportService{
    private final ReportRepository reportRepository;
    private final WarrantyClaimRepository warrantyClaimRepository;
    private final TechnicianRepository technicianRepository;
    private final ServiceCenterRepository centerRepository;
    private final VehicleRepository vehicleRepository;
    private final RecallCampaignRepository campaignRepository;
    private final UserRepository userRepository;

    public ReportServiceImpl(
        ReportRepository reportRepository,
        WarrantyClaimRepository warrantyClaimRepository,
        TechnicianRepository technicianRepository,
        ServiceCenterRepository centerRepository,
        VehicleRepository vehicleRepository,
        RecallCampaignRepository campaignRepository,
        UserRepository userRepository) {
        
        this.reportRepository = reportRepository;
        this.warrantyClaimRepository = warrantyClaimRepository;
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

        // 1. Kiểm tra Claim (WarrantyClaim)
        if (report.getClaim() == null || report.getClaim().getClaimId() == null || warrantyClaimRepository.findById(report.getClaim().getClaimId()).isEmpty()) {
            throw new IllegalArgumentException("Report phải liên kết với một Claim tồn tại.");
        }
        
        // 2. Kiểm tra Technician
        if (report.getTechnician() == null || report.getTechnician().getTechnicianId() == null || technicianRepository.findById(report.getTechnician().getTechnicianId()).isEmpty()) {
            throw new IllegalArgumentException("Technician không tồn tại.");
        }
        
        // 3. Kiểm tra Service Center (Đã thêm)
        if (report.getCenter() == null || report.getCenter().getCenterId() == null || centerRepository.findById(report.getCenter().getCenterId()).isEmpty()) {
            throw new IllegalArgumentException("Service Center không tồn tại.");
        }

        // 4. Kiểm tra Vehicle (Đã thêm)
        if (report.getVehicle() == null || report.getVehicle().getVehicleId() == null || vehicleRepository.findById(report.getVehicle().getVehicleId()).isEmpty()) {
            throw new IllegalArgumentException("Vehicle không tồn tại.");
        }

        // 5. Kiểm tra Campaign (Tùy chọn, chỉ kiểm tra nếu ID được cung cấp)
        if (report.getCampaign() != null && report.getCampaign().getCampaignId() != null && campaignRepository.findById(report.getCampaign().getCampaignId()).isEmpty()) {
            throw new IllegalArgumentException("Recall Campaign không tồn tại.");
        }

        // 6. Kiểm tra User (Created By - Đã thêm)
        if (report.getCreatedBy() == null || report.getCreatedBy().getId() == null || userRepository.findById(report.getCreatedBy().getId()).isEmpty()) {
            throw new IllegalArgumentException("Người tạo (User ID) không tồn tại.");
        }
        
        // Đảm bảo ReportDate được thiết lập
        if (report.getReportDate() == null) {
            report.setReportDate(LocalDate.now());
        }
        
        // Cập nhật createdDate/updatedAt
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

    @Override
    public Map<String, BigDecimal> getMonthlyTotalCostAnalysis(int year) {
        List<Object[]> results = warrantyClaimRepository.findMonthlyTotalCostByYear(year);

        return results.stream()
            .collect(Collectors.toMap(
                row -> String.format("%02d", (Integer) row[0]), 
                row -> (BigDecimal) row[1] 
            ));
    }
}
