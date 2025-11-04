package edu.uth.warranty.dto;

import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartRequest {
    private Long id;

    @NotBlank(message = "Tên linh kiện là bắt buộc")
    private String name;
    
    @NotBlank(message = "Mã linh kiện (Part Number) là bắt buộc")
    private String partNumber; // Unique
    
    @NotNull(message = "Giá là bắt buộc")
    @PositiveOrZero(message = "Giá không được âm")
    private BigDecimal price;
}
