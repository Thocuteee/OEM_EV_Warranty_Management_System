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
    public InventoryResponse(Long long1, Long long2, Long long3, BigDecimal bigDecimal, LocalDate localDateLong inventory_id, BigDecimal amount2, String invoice_date, Long part_id, String name,
            Long center_id, String name2) {
        //TODO #67 Auto-generated constructor stub
    }
    public InventoryResponse(Long inventory_id, Long partId2, Long center_id, BigDecimal amount2,
            LocalDate invoiceDate2) {
        //TODO Auto-generated constructor stub
    }
    public InventoryResponse() {
    }
    private Long id;

    private Long partId;
    private String partNumber; 
    private String partName;

    // Thông tin Trung tâm
    private Long centerId;
    private String centerName;
    
    // Chi tiết Tồn kho
    private BigDecimal amount;
    private LocalDate invoiceDate;
}
