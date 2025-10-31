package edu.uth.warranty.service;

import edu.uth.warranty.model.VehiclePartHistory;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.WarrantyClaim;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IVehiclePartHistoryService {
    List<VehiclePartHistory> getAllHistoryRecords();
    Optional<VehiclePartHistory> getHistoryRecordById(Long id);

    VehiclePartHistory saveHistoryRecord(VehiclePartHistory record);
    
    void deleteHistoryRecord(Long id);

    List<VehiclePartHistory> getHistoryByVehicle(Vehicle vehicle);

    List<VehiclePartHistory> getHistoryByPartSerial(PartSerial partserial);

    List<VehiclePartHistory> getHistoryByClaim(WarrantyClaim claim);

    List<VehiclePartHistory> getHistoryByDateInstalledBetween(LocalDate startDate, LocalDate endDate);
}
