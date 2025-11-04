package edu.uth.warranty.dto;

import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimPartResponse {
    private Long claimId;
    private Long partId;

    // Thông tin hiển thị 
    private String partNumber;
    private String partName;

    // Chi tiết
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}
