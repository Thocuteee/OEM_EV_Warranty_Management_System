package edu.uth.warranty.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.uth.warranty.model.VehiclePartHistory;
import edu.uth.warranty.repository.PartSerialRepository;
import edu.uth.warranty.repository.VehiclePartHistoryRepository;
import edu.uth.warranty.repository.VehicleRepository;
import edu.uth.warranty.repository.WarrantyClaimRepository;
import edu.uth.warranty.service.IVehiclePartHistoryService;


@Transactional
@Service
public class VehiclePartHistoryImpl implements IVehiclePartHistoryService {

    private final VehiclePartHistoryRepository vehiclePartHistoryRepository;
    private final PartSerialRepository partSerialRepository;
    private final VehicleRepository vehicleRepository;
    private final WarrantyClaimRepository warrantyClaimRepository;

    public VehiclePartHistoryImpl(VehiclePartHistoryRepository vehiclePartHistoryRepository, PartSerialRepository partSerialRepository, VehicleRepository vehicleRepository, WarrantyClaimRepository warrantyClaimRepository) {
        this.vehiclePartHistoryRepository = vehiclePartHistoryRepository;
        this.partSerialRepository = partSerialRepository;
        this.vehicleRepository = vehicleRepository;
        this.warrantyClaimRepository = warrantyClaimRepository;
    }

    @Override
    public List<VehiclePartHistory> getAllVehiclePartHistorys() {
        return vehiclePartHistoryRepository.findAll();
    }

    @Override
    public Optional<VehiclePartHistory> getVehiclePartHistoryById(Long id) {
        return vehiclePartHistoryRepository.findById(id);
    }

    @Override
    public VehiclePartHistory saveVehiclePartHistory(VehiclePartHistory vehiclePartHistory) {
        return vehiclePartHistoryRepository.save(vehiclePartHistory);
    }

    @Override
    public void deleteVehiclePartHistory(Long id) {
        vehiclePartHistoryRepository.deleteById(id);
    }

    @Override
    public Optional<VehiclePartHistory> findById(Long id) {
        return vehiclePartHistoryRepository.findById(id);
    }

    @Override
    public List<VehiclePartHistory> DateInstalled(LocalDate startDate,LocalDate endDate) {
        return vehiclePartHistoryRepository.findByDateInstalledBetween(startDate, endDate);
    }
}
