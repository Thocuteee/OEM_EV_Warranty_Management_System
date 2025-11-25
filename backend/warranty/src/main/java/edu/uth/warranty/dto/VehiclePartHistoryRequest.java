package edu.uth.warranty.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiclePartHistoryRequest {
    private Long id;

    @NotNull(message = "Vehicle ID là bắt buộc")
    private Long vehicleId;
    
    @NotNull(message = "Part Serial ID là bắt buộc")
    private Long partSerialId;
    
    @NotNull(message = "Claim ID là bắt buộc")
    private Long claimId;
    
    // Thông tin Lịch sử
    private LocalDate dateInstalled; // Ngày lắp đặt 
}
