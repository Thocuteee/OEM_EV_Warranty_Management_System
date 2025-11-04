package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignVehicleResponse {
    private Long campaignId;
    private Long vehicleId;

    private String campaignTitle; 
    private String vehicleVIN;
    private String status;
}
