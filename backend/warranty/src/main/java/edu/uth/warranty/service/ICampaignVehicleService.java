package edu.uth.warranty.service;

import edu.uth.warranty.model.CampaignVehicle;
import edu.uth.warranty.model.RecallCampaign;
import edu.uth.warranty.model.Vehicle;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
@Service
public interface ICampaignVehicleService {
    List<CampaignVehicle> getAllCampaignVehicle();

    Optional<CampaignVehicle> getCampaignVehicleById(Long campaignId, Long vehicleId);

    CampaignVehicle saveCampaignVehicle(CampaignVehicle entity);

    void deleteCampaignVehicle(Long campaignId, Long vehicleId);

    List<CampaignVehicle> getCampaignVehiclesByCampaign(RecallCampaign campaign);

    List<CampaignVehicle> getCampaignsByVehicle(Vehicle vehicle);

    List<CampaignVehicle> getCampaignVehiclesByStatus(String status);
}
