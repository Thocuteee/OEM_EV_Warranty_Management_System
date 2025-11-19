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
        private Long campaignId; 
        private Long vehicleId;  

        public CampaignVehicleId() {}

        public CampaignVehicleId(Long campaignId, Long vehicleId) {
            this.campaignId = campaignId;
            this.vehicleId = vehicleId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            CampaignVehicleId id = (CampaignVehicleId) o;
            return Objects.equals(campaignId, id.campaignId) && Objects.equals(vehicleId, id.vehicleId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(campaignId, vehicleId);
        }
    }

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private RecallCampaign campaign; 

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle; 

    @Column(name = "status", nullable = false)
    private String status;

    public CampaignVehicle(Vehicle vehicle, String status, RecallCampaign campaign) {
        this.vehicle = vehicle;
        this.status = status;
        this.campaign = campaign;
    }
}