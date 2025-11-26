package edu.uth.warranty.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
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

    @NotNull(message = "Thời hạn (tháng) là bắt buộc")
    @Positive(message = "Thời hạn phải lớn hơn 0")
    private Integer durationMonths;

    @NotNull(message = "Giới hạn KM là bắt buộc")
    @PositiveOrZero(message = "Giới hạn KM không được âm")
    private Integer mileageLimit;

    private String coverageDescription;
}

