package edu.uth.warranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    private Long id;
    // Khóa Ngoại (Chỉ gửi ID)
    @NotNull(message = "Claim ID là bắt buộc")
    private Long claimId;
    @NotNull(message = "Technician ID là bắt buộc")
    private Long technicianId;
    @NotNull(message = "Service Center ID là bắt buộc")
    private Long centerId;
    @NotNull(message = "Vehicle ID là bắt buộc")
    private Long vehicleId;

    private Long campaignId;

    // User ID người tạo/cập nhật Report
    @NotNull(message = "Created By User ID là bắt buộc")
    private Long createdById;

    //Information
    @NotNull(message = "Trạng thái báo cáo là bắt buộc")
    private String status;

    private LocalDate reportDate; // Ngày lập báo cáo
    private String diagnosticCodes; // Mã chẩn đoán lỗi

    // Time Work
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;

    // Mô tả công việc
    private String description;
    private String actionTaken;
    private String partUsed;
    private String replacedPart;

    // Chi phí
    @NotNull(message = "Chi phí linh kiện là bắt buộc")
    private BigDecimal partCost;
    @NotNull(message = "Chi phí lao động là bắt buộc")
    private BigDecimal actualCost;
    
    // Thông tin người tạo (String)
    private String createdByText;
    private String updatedBy;
}
