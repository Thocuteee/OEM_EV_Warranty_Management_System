package edu.uth.warranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkLogResponse {
    private Long id;

    private Long claimId;
    private Long technicianId;
    private String technicianName;

    //? Time & Performents
    private LocalDate startTime;
    private LocalDate endTime;
    private LocalDate logDate;
    private BigDecimal duration;
    private String notes;
}
