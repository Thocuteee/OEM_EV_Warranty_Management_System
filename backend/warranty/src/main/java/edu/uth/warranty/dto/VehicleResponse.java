package edu.uth.warranty.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    //Trạng thái và thông tin người đăng ký
    private String registrationStatus;
    private Long registeredByUserId;
    private String registeredByUsername;
}
