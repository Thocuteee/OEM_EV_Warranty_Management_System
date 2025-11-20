package edu.uth.warranty.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CampaignVehicle")
@IdClass(CampaignVehicle.CampaignVehicleId.class)
public class CampaignVehicle {
    public static class CampaignVehicleId implements Serializable {
        private Long campaign; 
        private Long vehicle;

        public CampaignVehicleId() {}

        public CampaignVehicleId(Long campaign, Long vehicle) {
            this.campaign = campaign;
            this.vehicle = vehicle;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            CampaignVehicleId id = (CampaignVehicleId) o;
            return Objects.equals(campaign, id.campaign) && Objects.equals(vehicle, id.vehicle);
        }

        @Override
        public int hashCode() {
            return Objects.hash(campaign, vehicle);
        }
    }

    @Id
    private Long campaign; 

    @Id
    private Long vehicle; 
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("campaign") 
    @JoinColumn(name = "campaign_id", nullable = false)
    private RecallCampaign recallCampaignEntity; // SỬA: Đổi tên trường
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("vehicle") 
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicleEntity; // SỬA: Đổi tên trường

    @Column(name = "status", nullable = false)
    private String status;

    public CampaignVehicle(Vehicle vehicle, String status, RecallCampaign campaign) {
        this.vehicleEntity = vehicle;
        this.status = status;
        this.recallCampaignEntity = campaign;
    } 
}