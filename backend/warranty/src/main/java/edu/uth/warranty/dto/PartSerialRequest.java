package edu.uth.warranty.dto;

import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartSerialRequest {
    private Long id;

    @NotNull(message = "Part ID là bắt buộc")
    private Long partId;
    
    // Thông tin Serial
    @NotBlank(message = "Số Serial là bắt buộc")
    private String serialNumber; // Unique
    
    @NotNull(message = "Ngày nhận hàng là bắt buộc")
    private LocalDate dateReceived;
}
