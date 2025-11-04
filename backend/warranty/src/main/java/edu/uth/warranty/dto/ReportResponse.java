package edu.uth.warranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long id;

    // trạng thái
    private String status; 
    private LocalDate reportDate;
    private String diagnosticCodes;

    // Chi phí
    private BigDecimal partCost;
    private BigDecimal actualCost;
    private BigDecimal totalCalculatedCost; // Tổng chi phí (Part + Actual)

    // Thời gian công việc và mô tả
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private String actionTaken;
    
    // Mối quan hệ (IDs và Tên hiển thị)
    private Long claimId;
    private Long technicianId;
    private String technicianName;
    private Long centerId;
    
    // Người tạo/cập nhật
    private String createdByText;
    private LocalDateTime createdDate;
    private LocalDateTime updatedAt;
}
