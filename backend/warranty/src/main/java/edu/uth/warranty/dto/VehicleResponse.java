package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {
    private Long id;
    private String VIN;
    private String model;
    private String year;

    // Thông tin Chủ sở hữu (ID và Tên để hiển thị)
    private Long customerId;
    private String customerName;
}
