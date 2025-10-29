package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.VehiclePartHistory;
import edu.uth.warranty.repository.VehiclePartHistoryRepository;
import edu.uth.warranty.service.IVehiclePartHistoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiclePartHistoryServiceImpl implements IVehiclePartHistoryService {

    private final VehiclePartHistoryRepository repository;

    public VehiclePartHistoryServiceImpl(VehiclePartHistoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<VehiclePartHistory> findByVehicleId(Long vehicleId) {
        return repository.findByVehicle_VehicleId(vehicleId);
    }

    @Override
    public List<VehiclePartHistory> findByPartId(Long partId) {
        return repository.findByPart_PartId(partId);
    }
}
