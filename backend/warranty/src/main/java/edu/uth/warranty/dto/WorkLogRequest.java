package edu.uth.warranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkLogRequest {
    private Long id;

    @NotNull(message = "Claim ID là bắt buộc")
    private Long claimId;
    
    @NotNull(message = "Technician ID là bắt buộc")
    private Long technicianId;
    
    // Time Work
    @NotNull(message = "Thời gian bắt đầu là bắt buộc")
    private LocalDate startTime;
    
    @NotNull(message = "Thời gian kết thúc là bắt buộc")
    private LocalDate endTime;
    
    private LocalDate logDate; // Ngày ghi log

    // Chi tiết
    private BigDecimal duration;
    
    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    private String notes;
}
