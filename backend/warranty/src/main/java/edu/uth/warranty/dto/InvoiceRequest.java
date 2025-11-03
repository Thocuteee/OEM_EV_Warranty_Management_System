package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceRequest {
    private Long id;

    @NotNull(message = "Claim ID là bắt buộc")
    private Long claimId;
    
    @NotNull(message = "Part ID là bắt buộc")
    private Long partId;
    
    @NotNull(message = "Service Center ID là bắt buộc")
    private Long centerId;
    
    // Thông tin Hóa đơn
    @NotBlank(message = "Loại vị trí là bắt buộc")
    private String locationType;
    
    @NotNull(message = "Số lượng là bắt buộc")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
    
    // Mức tồn kho tối thiểu 
    @NotNull(message = "Mức tồn kho tối thiểu là bắt buộc")
    @Min(value = 0, message = "Mức tồn kho không được âm")
    private Integer minStockLevel;

    @NotBlank(message = "Trạng thái thanh toán là bắt buộc")
    private String paymentsStatus;
}
