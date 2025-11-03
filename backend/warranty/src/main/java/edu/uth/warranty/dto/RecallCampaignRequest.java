package edu.uth.warranty.dto;

import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecallCampaignRequest {
    private Long id;

    @NotBlank(message = "Tiêu đề chiến dịch là bắt buộc")
    private String title; // Unique
    
    @NotNull(message = "Ngày bắt đầu là bắt buộc")
    private LocalDate startDate;
    
    private LocalDate endDate;
}
