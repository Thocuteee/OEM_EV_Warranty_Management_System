package edu.uth.warranty.dto;

import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartSerialResponse {
    public PartSerialResponse(Long partSerialId, Long partId2, String serialNumber2, LocalDate dateReceived2) {
        //TODO Auto-generated constructor stub
    }
    private Long id;

    // Thông tin Serial
    private String serialNumber;
    private LocalDate dateReceived;
    
    // Thông tin Linh kiện gốc
    private Long partId;
    private String partNumber;
    private String partName;
}
