package edu.uth.warranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
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
    
    // Thời gian làm việc
    @NotNull(message = "Thời gian bắt đầu là bắt buộc")
    private LocalTime startTime;
    
    @NotNull(message = "Thời gian kết thúc là bắt buộc")
    private LocalTime endTime;
    
    // Ngày ghi log
    @NotNull(message = "Ngày ghi log là bắt buộc")
    private LocalDate logDate;

    private BigDecimal duration;
    
    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    private String notes;
}
