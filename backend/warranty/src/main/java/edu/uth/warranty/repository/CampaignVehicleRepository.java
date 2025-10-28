package edu.uth.warranty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.CampaignVehicle;

@Repository
public interface CampaignVehicleRepository extends JpaRepository<CampaignVehicle, CampaignVehicle.CampaignVehicleId> {
    List<CampaignVehicle> findByCampaignVehicle_CampaignId(String campaignId);

    List<CampaignVehicle> findByCampaignVehicle_Vin(String vin);
    List<CampaignVehicle> findByCampaignVehicle_Status(String status);
}
