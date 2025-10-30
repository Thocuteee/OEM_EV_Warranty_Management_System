package edu.uth.warranty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.VehiclePartHistory;


@Repository
public interface VehiclePartHistoryRepository extends JpaRepository<VehiclePartHistory, Long> {

    List<VehiclePartHistory> findByHistory_Vehicle_PartSerial_Claim(Long history ,Vehicle vehicle, Long partSerial, Long claim);

    List<VehiclePartHistory> findByDateInstalled(java.time.LocalDate dateInstalled);
}
