package edu.uth.warranty.model;

import jakarta.persistence.*;

@Entity
@Table(name = "CampaignVehicle")
public class CampaignVehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campaign_id;

    @OneToMany(mappedBy = "Vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private Long vehicle_id;

    @Column(name = "status", nullable = false)
    private String status;

    public Long getCampaign_id() {
        return campaign_id;
    }

    public void setCampaign_id(Long campaign_id) {
        this.campaign_id = campaign_id;
    }

    public Long getVehicle_id() {
        return vehicle_id;
    }

    public void setVehicle_id(Long vehicle_id) {
        this.vehicle_id = vehicle_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public CampaignVehicle() {
    }

    public CampaignVehicle(Long vehicle_id, String status) {
        this.vehicle_id = vehicle_id;
        this.status = status;
    }

    
}
