package edu.uth.warranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {
    private Long id;

    private Long partId;

    //thông tin sẽ thêm nếu cần 
    
    // private String partNumber; 
    // private String partName;

    // Thông tin Trung tâm
    private Long centerId;
    // private String centerName;
    
    // Chi tiết Tồn kho
    private BigDecimal amount;
    private LocalDate invoiceDate;
}
