package edu.uth.warranty.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {
    private Long id;

    @NotNull(message = "ID chủ xe là bắt buộc")
    private Long customerId;

    // Thông tin Xe
    @NotBlank(message = "Số VIN là bắt buộc")
    @Size(min = 17, max = 17, message = "VIN phải có đúng 17 ký tự")
    @JsonProperty("VIN")
    private String VIN;

    @NotBlank(message = "Model xe là bắt buộc")
    private String model;

    @NotNull(message = "Năm sản xuất là bắt buộc")
    @Pattern(regexp = "^(19[0-9]{2}|20[0-9]{2}|2100)$", message = "Năm sản xuất phải từ 1900 đến 2100")
    private String year;

    @NotNull(message = "ID người đăng ký là bắt buộc")
    private Long registeredByUserId;
}
