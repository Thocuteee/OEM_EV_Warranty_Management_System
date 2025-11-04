package edu.uth.warranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryRequest {
    private Long id;

    @NotNull(message = "Part ID là bắt buộc")
    private Long partId;
    
    @NotNull(message = "Service Center ID là bắt buộc")
    private Long centerId;
    
    // Thông tin Tồn kho
    @NotNull(message = "Số lượng tồn kho là bắt buộc")
    @PositiveOrZero(message = "Số lượng không được âm")
    private BigDecimal amount;
    
    @NotNull(message = "Ngày hóa đơn là bắt buộc")
    private LocalDate invoiceDate;
}
