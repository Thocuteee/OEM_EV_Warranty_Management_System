package edu.uth.warranty.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyPolicyRequest {
    private Long id;

    @NotBlank(message = "Tên chính sách là bắt buộc")
    private String policyName;

    @NotNull(message = "Thời hạn bảo hành (tháng) là bắt buộc")
    @Min(value = 1, message = "Thời hạn phải lớn hơn 0")
    private Integer durationMonths;

    @NotNull(message = "Giới hạn số KM là bắt buộc")
    @Min(value = 0, message = "Giới hạn KM không được âm")
    private Long mileageLimit;

    private String coverageDescription;
}