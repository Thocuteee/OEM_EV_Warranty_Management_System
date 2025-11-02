package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    private Long id;

    private Long claimId;
    private Long partId;
    private String partName; 
    private Long centerId;
    private String centerName;
    
    // Chi tiết Hóa đơn
    private String locationType;
    private Integer quantity;
    private Integer minStockLevel;
    private String paymentsStatus;
}
