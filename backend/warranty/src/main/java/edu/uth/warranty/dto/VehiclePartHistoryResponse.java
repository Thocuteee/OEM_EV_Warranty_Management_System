package edu.uth.warranty.dto;

import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiclePartHistoryResponse {
    private Long id;

    // Thông tin Xe
    private Long vehicleId;
    private String vehicleVIN;

    // Thông tin Linh kiện Serial
    private Long partSerialId;
    private String partSerialNumber;
    
    // Thông tin Claim liên quan
    private Long claimId;
    private String claimStatus;
    
    // Chi tiết
    private LocalDate dateInstalled;
}   
