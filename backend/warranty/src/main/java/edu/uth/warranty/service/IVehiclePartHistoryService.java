package edu.uth.warranty.service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.VehiclePartHistory;

@Service
public interface IVehiclePartHistoryService {
    List<VehiclePartHistory> getAllVehiclePartHistorys();
    Optional<VehiclePartHistory> getVehiclePartHistoryById(Long id);

    // tao moi hoac cap nhat
    VehiclePartHistory saveVehiclePartHistory(VehiclePartHistory vehiclePartHistory);

    void deleteVehiclePartHistory(Long id);

    // tim kiem lich su
    Optional<VehiclePartHistory>findById(Long id);

    List<VehiclePartHistory>DateInstalled(LocalDate startDate, LocalDate endDate);
}
