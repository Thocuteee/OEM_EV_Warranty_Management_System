package edu.uth.warranty.model;

import jakarta.persistence.*;
import java.util.Objects;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "CampaignVehicle")
public class CampaignVehicle {
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CampaignVehicle that = (CampaignVehicle) o;
        return Objects.equals(campaign.getCampaign_id(), that.campaign.getCampaign_id()) && Objects.equals(vehicle.getVehicle_id(), that.vehicle.getVehicle_id());
    }

    @Override
    public int hashCode() {
        return Objects.hash(campaign, vehicle);

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
