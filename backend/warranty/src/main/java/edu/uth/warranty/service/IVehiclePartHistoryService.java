package edu.uth.warranty.service;
<<<<<<< HEAD

import edu.uth.warranty.model.VehiclePartHistory;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.WarrantyClaim;

=======
<<<<<<< HEAD

import java.util.List;

import edu.uth.warranty.model.VehiclePartHistory;

public interface IVehiclePartHistoryService {
    List<VehiclePartHistory> findByVehicleId(Long vehicleId);
    List<VehiclePartHistory> findByPartId(Long partId);
=======
>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

<<<<<<< HEAD
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
=======
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
>>>>>>> main
>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
}
