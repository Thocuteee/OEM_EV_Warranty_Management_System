package edu.uth.warranty.repository;

import edu.uth.warranty.model.VehiclePartHistory;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.WarrantyClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehiclePartHistoryRepository extends JpaRepository<VehiclePartHistory, Long>{
    @Query("SELECT h FROM VehiclePartHistory h JOIN FETCH h.partserial ps JOIN FETCH h.claim c WHERE h.vehicle = :vehicle")
    List<VehiclePartHistory> findByVehicle(Vehicle vehicle);

    List<VehiclePartHistory> findByPartserial(PartSerial partserial);

    List<VehiclePartHistory> findByClaim(WarrantyClaim claim);

    List<VehiclePartHistory> findByDateInstalledBetween(LocalDate startDate, LocalDate endDate);
}
