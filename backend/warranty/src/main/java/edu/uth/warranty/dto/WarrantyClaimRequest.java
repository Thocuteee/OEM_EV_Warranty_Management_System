package edu.uth.warranty.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyClaimRequest {
    @NotNull(message = "Staff ID không được để trống")
    private Long staffId;

    @NotNull(message = "Vehicle ID là bắt buộc")
    private Long VehicleId;

    @NotNull(message = "Customer ID là bắt buộc")
    private Long customerId;

    @NotNull(message = "Service Center ID là bắt buộc")
    private Long centerId;

    private Long technicianId;

    // Thông tin nội dung
    @Size(max = 255, message = "Mô tả không được vượt quá 255 ký tự")
    private String description;

    @NotNull(message = "Tổng chi phí là bắt buộc")
    private BigDecimal TotalCost;
    
    @NotNull(message = "Số KM hiện tại là bắt buộc để kiểm tra bảo hành")
    private Long currentMileage;
    // Lưu ý: status, created_at, updated_at sẽ do Service tự thiết lập sau -.- 
}
