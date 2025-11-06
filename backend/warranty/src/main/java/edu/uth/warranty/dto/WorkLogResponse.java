package edu.uth.warranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkLogResponse {
    private Long id;

    private Long claimId;
    private Long technicianId;
    private String technicianName;

    //? Time & Performents
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate logDate;
    private BigDecimal duration;
    private String notes;
}
