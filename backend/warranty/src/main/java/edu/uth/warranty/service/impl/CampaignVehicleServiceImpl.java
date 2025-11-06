package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.CampaignVehicle;
import edu.uth.warranty.model.RecallCampaign;
import edu.uth.warranty.model.Vehicle;

import edu.uth.warranty.repository.CampaignVehicleRepository;
import edu.uth.warranty.repository.RecallCampaignRepository;
import edu.uth.warranty.repository.VehicleRepository;
import edu.uth.warranty.service.ICampaignVehicleService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CampaignVehicleServiceImpl implements ICampaignVehicleService{
    private final CampaignVehicleRepository campaignVehicleRepository;

    private final RecallCampaignRepository recallCampaignRepository;

    private final VehicleRepository vehicleRepository;

    public CampaignVehicleServiceImpl(CampaignVehicleRepository campaignVehicleRepository, RecallCampaignRepository recallCampaignRepository,VehicleRepository vehicleRepository) {
        this.campaignVehicleRepository = campaignVehicleRepository;
        this.recallCampaignRepository = recallCampaignRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public List<CampaignVehicle> getAllCampaignVehicle() {
        return campaignVehicleRepository.findAll();
    }

    @Override
    public Optional<CampaignVehicle> getCampaignVehicleById(Long campaignId, Long vehicleId) {
        CampaignVehicle.CampaignVehicleId id = new CampaignVehicle.CampaignVehicleId(campaignId, vehicleId);
        return campaignVehicleRepository.findById(id);
    }

    @Override
    public CampaignVehicle saveCampaignVehicle(CampaignVehicle entity) {
        Long campaignId = entity.getCampaign().getCampaign_id();
        Long vehicleId = entity.getVehicle().getVehicleId();
        // Kiểm tra xem Campaign và Vehicle có tồn tại không
        if (recallCampaignRepository.findById(campaignId).isEmpty()) {
            throw new IllegalArgumentException("Chiến dịch triệu hồi không tồn tại.");
        }
        if (vehicleRepository.findById(vehicleId).isEmpty()) {
            throw new IllegalArgumentException("Xe không tồn tại.");
        }
        return campaignVehicleRepository.save(entity);
    }

    @Override
    public void deleteCampaignVehicle(Long campaignId, Long vehicleId) {
        CampaignVehicle.CampaignVehicleId id = new CampaignVehicle.CampaignVehicleId(campaignId, vehicleId);
        campaignVehicleRepository.deleteById(id);
    }

    @Override
    public List<CampaignVehicle> getCampaignVehiclesByCampaign(RecallCampaign campaign) {
        return campaignVehicleRepository.findByCampaign(campaign);
    }

    @Override
    public List<CampaignVehicle> getCampaignsByVehicle(Vehicle vehicle) {
        return campaignVehicleRepository.findByVehicle(vehicle);
    }

    @Override
    public List<CampaignVehicle> getCampaignVehiclesByStatus(String status) {
        return campaignVehicleRepository.findByStatus(status);
    }
}
