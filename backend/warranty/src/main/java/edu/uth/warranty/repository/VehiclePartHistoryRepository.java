package edu.uth.warranty.repository;

import edu.uth.warranty.model.VehiclePartHistory;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.WarrantyClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehiclePartHistoryRepository extends JpaRepository<VehiclePartHistory, Long>{
    List<VehiclePartHistory> findByVehicle_PartSerial_Claim(Vehicle vehicle, PartSerial partSerial, WarrantyClaim claim);

    List<VehiclePartHistory> findByDateInstalledBetween(LocalDate startDate, LocalDate endDate);
}
