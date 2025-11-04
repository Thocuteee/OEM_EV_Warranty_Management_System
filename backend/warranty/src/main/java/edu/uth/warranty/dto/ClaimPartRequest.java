package edu.uth.warranty.dto;

import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimPartRequest {
    @NotNull(message = "Claim ID là bắt buộc")
    private Long claimId;

    @NotNull(message = "Part ID là bắt buộc")
    private Long partId;
    
    // Chi tiết Linh kiện
    @NotNull(message = "Số lượng là bắt buộc")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;

    @NotNull(message = "Đơn giá là bắt buộc")
    private BigDecimal unitPrice;

    private BigDecimal totalPrice; 
}
