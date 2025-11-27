package edu.uth.warranty.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyClaimResponse {
    private Long id;

    // Thông tin FK
    private Long vehicleId;
    private String vehicleVIN;
    private String vehicleModel; // Model của xe
    private Long customerId;
    private String customerName;
    private Long centerId;

    private Long technicianId;

    private String status; //Trang thái xử lí
    private String approvalStatus; // Trạng thái phê duyệt 
    private BigDecimal totalCost; // Tổng tiền 

    // time
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String description;

    private Long currentMileage; // Số KM hiện tại của xe

}
