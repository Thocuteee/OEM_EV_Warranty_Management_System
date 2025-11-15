package edu.uth.warranty.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignVehicleRequest {
    // Khóa Phức Hợp (Chỉ gửi ID)
    @NotNull(message = "Campaign ID là bắt buộc")
    private Long campaignId;
    
    @NotNull(message = "Vehicle ID là bắt buộc")
    private Long vehicleId;
    
    // Thông tin Trạng thái
    @NotBlank(message = "Trạng thái tham gia là bắt buộc")
    private String status; 
}
