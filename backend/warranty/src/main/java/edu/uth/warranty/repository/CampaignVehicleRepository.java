package edu.uth.warranty.repository;

import edu.uth.warranty.model.CampaignVehicle;
import edu.uth.warranty.model.RecallCampaign;
import edu.uth.warranty.model.Vehicle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignVehicleRepository extends JpaRepository<CampaignVehicle, CampaignVehicle.CampaignVehicleId>{
    List<CampaignVehicle> findByRecallCampaignEntity(RecallCampaign campaign);

    List<CampaignVehicle> findByVehicleEntity(Vehicle vehicle);

    Optional<CampaignVehicle> findByRecallCampaignEntityAndVehicleEntity(RecallCampaign campaign, Vehicle vehicle);

    List<CampaignVehicle> findByStatus(String status);
}