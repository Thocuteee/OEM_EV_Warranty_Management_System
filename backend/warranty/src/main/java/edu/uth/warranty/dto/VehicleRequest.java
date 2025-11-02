package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

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
    private String VIN;

    @NotBlank(message = "Model xe là bắt buộc")
    private String model;

    @NotBlank(message = "Năm sản xuất là bắt buộc")
    @Pattern(regexp = "^(19|20)\\d{2}$", message = "Năm sản xuất không hợp lệ") 
    private String year;
}
